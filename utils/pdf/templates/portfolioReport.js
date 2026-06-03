import { PDFBuilder } from "../pdfBuilder";

/**
 * [FUTURE COMPATIBILITY]
 * Generates a portfolio valuation summary report PDF.
 * 
 * @param {Array<Object>} properties - List of portfolio property documents
 * @returns {Buffer}
 */
export function generatePortfolioReportPDF(properties) {
  const builder = new PDFBuilder();
  builder.drawHeader();

  builder.addSectionHeading("Portfolio Valuation Report");
  
  builder.doc.setFont("helvetica", "normal");
  builder.doc.setFontSize(10);
  builder.doc.text("Consolidated real estate portfolio performance, gains, and monthly rent logs.", builder.leftMargin, builder.y);
  builder.y += 10;

  return builder.toBuffer();
}
