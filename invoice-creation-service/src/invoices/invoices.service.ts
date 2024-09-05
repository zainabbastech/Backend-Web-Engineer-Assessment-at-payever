import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Cron } from '@nestjs/schedule';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class InvoicesService {
  private readonly logger = new Logger(InvoicesService.name);
  private client: ClientProxy;

  constructor(
    @InjectModel(Invoice.name)
    private readonly invoiceModel: Model<InvoiceDocument>,
  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://rabbitmq:5672'],
        queue: 'daily_sales_report',
      },
    });
  }

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    try {
      const createdInvoice = await this.invoiceModel.create(createInvoiceDto);
      return createdInvoice;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Invoice with reference "${createInvoiceDto.reference}" already exists.`,
        );
      }
      this.logger.error('Error creating invoice:', error.message);
      throw new InternalServerErrorException(
        'An error occurred while creating the invoice.',
      );
    }
  }

  async findAll(filters?: any): Promise<Invoice[]> {
    try {
      return await this.invoiceModel.find(filters).exec();
    } catch (error) {
      this.logger.error('Error finding invoices:', error.message);
      throw new InternalServerErrorException(
        'An error occurred while retrieving the invoices.',
      );
    }
  }

  async findOne(id: string): Promise<Invoice> {
    try {
      const invoice = await this.invoiceModel.findById(id);
      if (!invoice) {
        throw new NotFoundException(`Invoice with ID ${id} not found`);
      }
      return invoice;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Error finding invoice by ID:', error.message);
      throw new InternalServerErrorException(
        'An error occurred while retrieving the invoice.',
      );
    }
  }

  @Cron('0 12 * * *') // Runs daily at 12 PM
  async handleCron() {
    this.logger.log('Running daily sales report cron job');
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const invoices = await this.invoiceModel
        .find({
          date: { $gte: today },
        })
        .exec();

      if (invoices.length === 0) {
        this.logger.log('No invoices found for today');
        return;
      }

      const totalSales = invoices.reduce(
        (sum, invoice) => sum + invoice.amount,
        0,
      );
      const itemSummary = this.getItemSummary(invoices);

      const report = {
        totalSales,
        itemSummary,
      };

      this.logger.log('Publishing daily sales report');
      this.publishToQueue(report);
    } catch (error) {
      this.logger.error(
        'Error during daily sales report cron job:',
        error.message,
      );
    }
  }

  private getItemSummary(invoices: Invoice[]) {
    return invoices.reduce((summary, invoice) => {
      invoice.items.forEach((item) => {
        summary[item.sku] = (summary[item.sku] || 0) + item.qt;
      });
      return summary;
    }, {});
  }

  private publishToQueue(report: any) {
    try {
      console.log('Publishing report to RabbitMQ:', report);
      this.client.emit('daily_sales_report', report);
    } catch (error) {
      this.logger.error('Error publishing to RabbitMQ:', error.message);
    }
  }
}
