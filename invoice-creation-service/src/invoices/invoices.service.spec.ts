import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from './invoices.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

describe('InvoicesService', () => {
  let service: InvoicesService;
  let model: Model<InvoiceDocument>;

  const mockInvoice = {
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
      providers: [
        InvoicesService,
        {
          provide: getModelToken(Invoice.name),
          useValue: {
            create: jest.fn().mockResolvedValue(mockInvoice),
            find: jest.fn().mockImplementation(
              () =>
                ({
                  exec: jest.fn().mockResolvedValue([mockInvoice]),
                }) as unknown as Query<any, InvoiceDocument>,
            ),
            findById: jest
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

    service = module.get<InvoicesService>(InvoicesService);
    model = module.get<Model<InvoiceDocument>>(getModelToken(Invoice.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should successfully create an invoice', async () => {
    const result = await service.create(createInvoiceDto);
    expect(result).toEqual(mockInvoice);
    expect(model.create).toHaveBeenCalledWith(createInvoiceDto);
  });

  it('should successfully retrieve all invoices', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockInvoice]);
  });

  it('should successfully retrieve an invoice by ID', async () => {
    const result = await service.findOne(mockId);
    console.log('result...', result);
    expect(result).toEqual(mockInvoice);
    expect(model.findById).toHaveBeenCalledWith(mockId);
  });
});
