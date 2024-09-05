import { EmailService } from './email.service';

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(() => {
    emailService = new EmailService();
  });

  describe('sendSalesReport', () => {
    it('should log the formatted report', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const report = {
        totalSales: 1000,
        itemSummary: {
          item1: 50,
          item2: 30,
        },
      };

      emailService.sendSalesReport(report);

      const expectedLog = `
      Recipient: recipient@example.com
      Subject: Daily Sales Summary Report
      Report:
      
    Total Sales: 1000
    Per Item Sales Summary:
    SKU: item1, Total Quantity Sold: 50
    SKU: item2, Total Quantity Sold: 30
  `
        .replace(/\s+/g, ' ')
        .trim();

      const actualLog = consoleSpy.mock.calls[0][0].replace(/\s+/g, ' ').trim();

      expect(actualLog).toBe(expectedLog);

      consoleSpy.mockRestore();
    });
  });
});
