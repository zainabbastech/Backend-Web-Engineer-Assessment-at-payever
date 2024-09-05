import { Module } from '@nestjs/common';
import { EmailController } from './email/email.controller';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [EmailController],
  providers: [EmailService],
})
export class AppModule {}
