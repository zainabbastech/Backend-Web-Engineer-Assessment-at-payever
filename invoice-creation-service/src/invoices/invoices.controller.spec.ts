import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { Invoice } from './schemas/invoice.schema';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

describe('InvoicesController', () => {
  let controller: InvoicesController;
  let service: InvoicesService;

  const mockInvoice: Invoice = {
    customer: '1',
    amount: 200,
    reference: 'reference2',
    date: new Date(),
    items: [
      { sku: 'item1', qt: 2000 },
      { sku: 'item2', qt: 2000 },
    ],
  };

  const createInvoiceDto: CreateInvoiceDto = {
    customer: '1',
    amount: 200,
    reference: 'reference2',
    items: [
      { sku: 'item1', qt: 2000 },
      { sku: 'item2', qt: 2000 },
    ],
    date: new Date(),
  };

  const mockId = '66d86d299af7af45e3936b58';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [
        {
          provide: InvoicesService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockInvoice),
            findAll: jest.fn().mockResolvedValue([mockInvoice]),
            findOne: jest
              .fn()
              .mockImplementation((id: string) =>
                id === mockId
                  ? Promise.resolve(mockInvoice)
                  : Promise.resolve(null),
              ),
          },
        },
      ],
    }).compile();

    controller = module.get<InvoicesController>(InvoicesController);
    service = module.get<InvoicesService>(InvoicesService);
  });

  describe('create', () => {
    it('should create a new invoice', async () => {
      const result = await controller.create(createInvoiceDto);
      expect(result).toEqual(mockInvoice);
      expect(service.create).toHaveBeenCalledWith(createInvoiceDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of invoices', async () => {
      const result = await controller.findAll({});
      expect(result).toEqual([mockInvoice]);
      expect(service.findAll).toHaveBeenCalledWith({});
    });

    it('should return filtered invoices based on query parameters', async () => {
      const startDate = new Date().toISOString();
      const endDate = new Date().toISOString();
      const result = await controller.findAll({ startDate, endDate });
      expect(result).toEqual([mockInvoice]);
      expect(service.findAll).toHaveBeenCalledWith({
        date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      });
    });
  });

  describe('findOne', () => {
    it('should return an invoice by ID', async () => {
      const result = await controller.findOne(mockId);
      expect(result).toEqual(mockInvoice);
      expect(service.findOne).toHaveBeenCalledWith(mockId);
    });

    it('should return null if invoice not found', async () => {
      const result = await controller.findOne('invalidId');
      expect(result).toBeNull();
      expect(service.findOne).toHaveBeenCalledWith('invalidId');
    });
  });
});
