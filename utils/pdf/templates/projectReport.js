import { PDFBuilder } from "../pdfBuilder.js";
import { formatCurrency, formatPriceRange, formatAreaRange, isEmpty } from "../formatter.js";

/**
 * Generates a project report PDF for a single MarketProject.
 * 
 * @param {Object} project - The MongoDB MarketProject document
 * @returns {Buffer} - Node.js buffer representing the PDF
 */
export function generateProjectReportPDF(project) {
  const builder = new PDFBuilder();
  builder.drawHeader();

  // --- 1. HERO SECTION: IDENTITY & LOCATION ---
  builder.doc.setTextColor(builder.primaryColor[0], builder.primaryColor[1], builder.primaryColor[2]);
  builder.doc.setFont("helvetica", "bold");
  builder.doc.setFontSize(20);
  
  // Wrap project name to fit width
  const nameLines = builder.doc.splitTextToSize(project.projectName || "Unnamed Project", builder.contentWidth);
  builder.doc.text(nameLines, builder.leftMargin, builder.y);
  builder.y += (nameLines.length * 7) + 2;

  // Builder info
  if (!isEmpty(project.builderName)) {
    builder.doc.setFontSize(10.5);
    builder.doc.setTextColor(builder.secondaryColor[0], builder.secondaryColor[1], builder.secondaryColor[2]);
    builder.doc.text(`Developed by: ${project.builderName}`, builder.leftMargin, builder.y);
    builder.y += 5.5;
  }

  // Location info (Locality, City, State)
  const locParts = [];
  if (!isEmpty(project.locality)) locParts.push(project.locality);
  if (!isEmpty(project.city)) locParts.push(project.city);
  if (!isEmpty(project.state)) locParts.push(project.state);
  
  // If locParts is empty, try project.location
  if (locParts.length === 0 && !isEmpty(project.location)) {
    locParts.push(project.location);
  }

  if (locParts.length > 0) {
    builder.doc.setFontSize(9.5);
    builder.doc.setTextColor(builder.primaryColor[0], builder.primaryColor[1], builder.primaryColor[2]);
    builder.doc.text(locParts.join(", "), builder.leftMargin, builder.y);
    builder.y += 6;
  }

  // Separator Line
  builder.doc.setDrawColor(builder.borderColor[0], builder.borderColor[1], builder.borderColor[2]);
  builder.doc.setLineWidth(0.3);
  builder.doc.line(builder.leftMargin, builder.y, 195, builder.y);
  builder.y += 8;

  // --- 2. PROJECT HIGHLIGHTS SECTION ---
  const highlights = [];
  
  if (!isEmpty(project.status)) {
    highlights.push(`Status: ${project.status}`);
  }
  
  if (project.bhk && project.bhk.length > 0) {
    highlights.push(`BHK Options: ${project.bhk.join(", ")} BHK`);
  }
  
  const priceRange = formatPriceRange(project.minPrice, project.maxPrice, "INR ");
  if (!isEmpty(priceRange) && priceRange !== "Price on Request") {
    highlights.push(`Price Range: ${priceRange}`);
  }
  
  const areaRange = formatAreaRange(project.minArea, project.maxArea, project.superArea, project.avgAreaSqft);
  if (!isEmpty(areaRange)) {
    highlights.push(`Area Range: ${areaRange}`);
  }
  
  // Possession Timeline
  let possession = "";
  if (!isEmpty(project.possessionDate)) {
    possession = project.possessionDate;
  } else if (project.possessionYear !== undefined && project.possessionYear !== null) {
    possession = project.possessionYear === 0 ? "Ready to Move" : `Dec ${project.possessionYear}`;
  }
  if (!isEmpty(possession)) {
    highlights.push(`Possession: ${possession}`);
  }

  if (highlights.length > 0) {
    builder.addSectionHeading("Project Highlights");
    builder.addBulletList(highlights);
  }

  // --- 3. PROJECT OVERVIEW SECTION ---
  const overviewItems = [];
  if (!isEmpty(project.propertyType)) {
    overviewItems.push({ label: "Property Type", value: project.propertyType });
  }
  if (!isEmpty(project.towers)) {
    overviewItems.push({ label: "Towers", value: project.towers });
  }
  if (!isEmpty(project.units)) {
    overviewItems.push({ label: "Total Units", value: `${project.units} Units` });
  }
  if (!isEmpty(project.totalArea)) {
    overviewItems.push({ label: "Total Area", value: project.totalArea });
  }
  if (!isEmpty(project.launchedDate)) {
    overviewItems.push({ label: "Launch Date", value: project.launchedDate });
  }
  if (!isEmpty(project.configuration)) {
    overviewItems.push({ label: "Configuration", value: project.configuration });
  }

  if (overviewItems.length > 0) {
    builder.addSectionHeading("Project Overview");
    builder.addKeyValueGrid(overviewItems);
  }

  // --- 4. PRICING & RENTAL INFORMATION SECTION ---
  const priceRentItems = [];
  if (!isEmpty(project.perSqftRate)) {
    priceRentItems.push({ 
      label: "Per Sq Ft Rate", 
      value: `${formatCurrency(project.perSqftRate, "INR ")}/sq.ft` 
    });
  }
  if (!isEmpty(project.monthlyRentRange)) {
    priceRentItems.push({ 
      label: "Monthly Rent Range", 
      value: project.monthlyRentRange 
    });
  }
  if (!isEmpty(project.perSqftRentalAvg)) {
    priceRentItems.push({ 
      label: "Avg. Monthly Rental Rate", 
      value: `${formatCurrency(project.perSqftRentalAvg, "INR ")}/sq.ft` 
    });
  }

  // Calculate rental yield if average rent and rate are available
  const rate = Number(project.perSqftRate);
  const rentAvg = Number(project.perSqftRentalAvg);
  if (!isNaN(rate) && !isNaN(rentAvg) && rate > 0 && rentAvg > 0) {
    const yieldValue = ((rentAvg * 12) / rate) * 100;
    priceRentItems.push({
      label: "Estimated Rental Yield",
      value: `${yieldValue.toFixed(2)}% p.a.`
    });
  }

  if (priceRentItems.length > 0) {
    builder.addSectionHeading("Pricing & Rental Information");
    builder.addKeyValueGrid(priceRentItems);
  }

  return builder.toBuffer();
}
