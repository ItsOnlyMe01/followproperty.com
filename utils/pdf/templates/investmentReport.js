import { PDFBuilder } from "../pdfBuilder";

/**
 * [FUTURE COMPATIBILITY]
 * Generates an advanced investment analysis report PDF.
 * 
 * @param {Object} project - MarketProject data
 * @param {Object} projections - Appreciation and IRR estimations
 * @returns {Buffer}
 */
export function generateInvestmentReportPDF(project, projections) {
  const builder = new PDFBuilder();
  builder.drawHeader();

  builder.addSectionHeading("Property Investment Analysis");
  
  builder.doc.setFont("helvetica", "normal");
  builder.doc.setFontSize(10);
  builder.doc.text("Ten-year capital appreciation projection, loan offset schedules, and IRR estimation.", builder.leftMargin, builder.y);
  builder.y += 10;

  return builder.toBuffer();
}
