import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { EmailService } from './email.service';

@Controller()
export class EmailController {
  private readonly logger = new Logger(EmailController.name);

  constructor(private emailService: EmailService) {}

  @EventPattern('daily_sales_report')
  handleSalesReport(report: any) {
    this.logger.log('Received daily sales report');
    console.log('Report:', report);

    console.log('Total Sales:', report.totalSales);
    console.log('Item Summary:', report.itemSummary);

    this.emailService.sendSalesReport(report);
  }
}
