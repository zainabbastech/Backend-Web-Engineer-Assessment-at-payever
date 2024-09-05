import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { InvoicesModule } from '../src/invoices/invoices.module';
import { MongooseModule } from '@nestjs/mongoose';

describe('Invoices - E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        InvoicesModule,
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/invoice-db'),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST invoices (Create Invoice)', async () => {
    const createInvoiceDto = {
      customer: '1',
      amount: 200,
      reference: 'ref-123457',
      items: [
        { sku: 'item1', qt: 2 },
        { sku: 'item2', qt: 5 },
      ],
    };
    return request(app.getHttpServer())
      .post('/invoices')
      .send(createInvoiceDto)
      .expect(201)
      .expect((res) => {
        expect(res.body.reference).toBe(createInvoiceDto.reference);
      });
  });

  it('/GET invoices (Get All Invoices)', async () => {
    return request(app.getHttpServer())
      .get('/invoices')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
      });
  });

  it('/GET invoices/:id (Get Invoice by ID)', async () => {
    const id = '66d86d4d9af7af45e3936b63'; // Replace with a valid invoice ID from your DB

    return request(app.getHttpServer())
      .get(`/invoices/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(id);
      });
  });
});
