import { PDFBuilder } from "../pdfBuilder";

/**
 * [FUTURE COMPATIBILITY]
 * Generates a comparison report PDF for multiple projects.
 * 
 * @param {Array<Object>} projects - List of MarketProject documents
 * @returns {Buffer}
 */
export function generateCompareReportPDF(projects) {
  const builder = new PDFBuilder();
  builder.drawHeader("PROJECT COMPARISON REPORT");

  builder.addSectionHeading("Project Comparison Report");
  
  builder.doc.setFont("helvetica", "normal");
  builder.doc.setFontSize(10);
  builder.doc.text("Side-by-side investment analytics and pricing comparison.", builder.leftMargin, builder.y);
  builder.y += 10;

  const names = projects.map(p => p.projectName || "Unnamed Project");
  builder.addBulletList(names.map(name => `Compare Target: ${name}`));

  return builder.toBuffer();
}
