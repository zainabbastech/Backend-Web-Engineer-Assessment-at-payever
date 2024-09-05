import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from './email.controller';
import { EmailService } from './email.service'; // Import EmailService

describe('EmailController', () => {
  let emailController: EmailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [EmailService],
    }).compile();

    emailController = module.get<EmailController>(EmailController);
  });

  it('should be defined', () => {
    expect(emailController).toBeDefined();
  });
});
