import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { InvoicesModule } from './invoices/invoices.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017/invoice-db'),
    ScheduleModule.forRoot(),
    InvoicesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
