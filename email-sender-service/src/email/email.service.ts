import { Injectable } from '@nestjs/common';
@Injectable()
export class EmailService {
  sendSalesReport(report: any) {
    const formattedReport = this.formatReport(report);
    console.log(`
      Recipient: recipient@example.com
      Subject: Daily Sales Summary Report
      Report:
      ${formattedReport}
    `);
  }

  private formatReport(report: any): string {
    const itemSummary = report.itemSummary || {};

    const itemSummaryText = Object.entries(itemSummary)
      .map(
        ([sku, totalQuantity]) =>
          `SKU: ${sku}, Total Quantity Sold: ${totalQuantity}`,
      )
      .join('\n');

    return `
    Total Sales: ${report.totalSales}
    Per Item Sales Summary:
    ${itemSummaryText}
  `;
  }
}
