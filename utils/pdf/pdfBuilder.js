import { jsPDF } from "jspdf";

function drawLogoSVG(doc, x, y, w, isWatermark = false) {
  const originalW = 119.3321;
  const originalH = 75.2825;
  const h = w * (originalH / originalW);
  const scaleX = w / originalW;
  const scaleY = h / originalH;

  const polyLeft = [
    [49.0587, 27.034],
    [6.6296, 37.6412],
    [49.0587, 48.2485],
    [55.8136, 75.2825],
    [0, 44.2708],
    [0, 31.0117],
    [55.8136, 0]
  ];

  const polyRight = [
    [119.3321, 31.0117],
    [119.3321, 44.2708],
    [63.5186, 75.2825],
    [70.2734, 48.2485],
    [112.7025, 37.6412],
    [70.2734, 27.034],
    [63.5186, 0]
  ];

  const mappedLeft = polyLeft.map(p => [x + p[0] * scaleX, y + p[1] * scaleY]);
  const mappedRight = polyRight.map(p => [x + p[0] * scaleX, y + p[1] * scaleY]);

  const drawPolygon = (points) => {
    const startX = points[0][0];
    const startY = points[0][1];
    const relative = [];
    let prevX = startX;
    let prevY = startY;
    for (let i = 1; i < points.length; i++) {
      relative.push([points[i][0] - prevX, points[i][1] - prevY]);
      prevX = points[i][0];
      prevY = points[i][1];
    }
    doc.lines(relative, startX, startY, [1, 1], "F", true);
  };

  const hasGState = typeof doc.GState === "function";

  if (isWatermark) {
    if (hasGState) {
      const gState = new doc.GState({ opacity: 0.035 });
      doc.saveGraphicsState();
      doc.setGState(gState);
      
      doc.setFillColor(50, 95, 236);
      drawPolygon(mappedLeft);
      doc.setFillColor(81, 143, 255);
      drawPolygon(mappedRight);
      
      doc.restoreGraphicsState();
    } else {
      doc.setFillColor(242, 245, 253);
      drawPolygon(mappedLeft);
      drawPolygon(mappedRight);
    }
  } else {
    doc.setFillColor(50, 95, 236);
    drawPolygon(mappedLeft);
    doc.setFillColor(81, 143, 255);
    drawPolygon(mappedRight);
  }
}


export class PDFBuilder {
  constructor() {
    this.doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    
    // Core Brand Design Colors
    this.primaryColor = [15, 22, 41];     // Deep Navy (#0F1629)
    this.secondaryColor = [92, 104, 128];  // Slate (#5C6880)
    this.accentColor = [50, 95, 236];     // Brand Blue (#325fec)
    this.lightBgColor = [250, 250, 248];   // Brand BG light (#FAFAF8)
    this.borderColor = [235, 237, 240];   // Slate-200 (#E2E8F0)
    
    this.y = 20; // Current Y-cursor position
    this.leftMargin = 15;
    this.rightMargin = 15;
    this.contentWidth = 180; // A4 width (210) - leftMargin(15) - rightMargin(15)
    this.currentPage = 1;
    this.currentLabel = "OFFICIAL PROJECT REPORT";
  }

  /**
   * Draw the top teal accent stripe.
   */
  drawAccentLine() {
    this.doc.setFillColor(this.accentColor[0], this.accentColor[1], this.accentColor[2]);
    this.doc.rect(0, 0, 210, 4, "F");
  }

  drawWatermark() {
    drawLogoSVG(this.doc, 45, 110.65, 120, true);
  }

  /**
   * Draw the standard page header.
   */
  drawHeader(label) {
    this.drawAccentLine();
    this.drawWatermark();
    
    if (label) {
      this.currentLabel = label;
    }
    const displayLabel = this.currentLabel || "OFFICIAL PROJECT REPORT";

    // Logo Icon
    drawLogoSVG(this.doc, this.leftMargin, 10.5, 8.5);

    // Logo text
    this.doc.setTextColor(this.primaryColor[0], this.primaryColor[1], this.primaryColor[2]);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(16);
    this.doc.text("FollowProperty", this.leftMargin + 10, 15);

    // Document label
    this.doc.setTextColor(this.secondaryColor[0], this.secondaryColor[1], this.secondaryColor[2]);
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(8);
    this.doc.text(displayLabel, this.leftMargin + 10, 20);

    // Date on the right
    const dateStr = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    this.doc.text(`Generated: ${dateStr}`, 195, 15, { align: "right" });

    // Divider Line
    this.doc.setDrawColor(this.borderColor[0], this.borderColor[1], this.borderColor[2]);
    this.doc.setLineWidth(0.3);
    this.doc.line(this.leftMargin, 23, 195, 23);
    
    this.y = 32;
  }

  /**
   * Add a section heading with a vertical teal indicator block.
   * @param {string} text 
   */
  addSectionHeading(text) {
    // Check if Y is too close to the bottom (reserve ~25mm)
    if (this.y > 250) {
      this.addPage();
    }
    
    // Brand Blue vertical bar
    this.doc.setFillColor(this.accentColor[0], this.accentColor[1], this.accentColor[2]);
    this.doc.rect(this.leftMargin, this.y, 2, 5, "F");

    // Heading text
    this.doc.setTextColor(this.primaryColor[0], this.primaryColor[1], this.primaryColor[2]);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(10);
    this.doc.text(text, this.leftMargin + 4, this.y + 4);

    this.y += 8;
  }

  addKeyValueGrid(items) {
    if (!items || items.length === 0) return;
    
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(9);
    
    const rowHeight = 8;
    items.forEach((item) => {
      // Check page height, leave ~20mm margin
      if (this.y > 270) {
        this.addPage();
      }

      // Clean, thin-line bordered white layout rows
      this.doc.setDrawColor(238, 239, 242);
      this.doc.setLineWidth(0.2);
      this.doc.line(this.leftMargin, this.y + 2, 195, this.y + 2);

      // Label (Column 1)
      this.doc.setTextColor(this.secondaryColor[0], this.secondaryColor[1], this.secondaryColor[2]);
      this.doc.setFont("helvetica", "normal");
      this.doc.text(item.label, this.leftMargin + 3, this.y);

      // Value (Column 2)
      this.doc.setTextColor(this.primaryColor[0], this.primaryColor[1], this.primaryColor[2]);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(String(item.value), this.leftMargin + 90, this.y);

      this.y += rowHeight;
    });
    
    this.y += 4; // Spacing below grid
  }

  /**
   * Add a list of items with teal circle bullet points.
   * @param {string[]} items 
   */
  addBulletList(items) {
    if (!items || items.length === 0) return;

    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(9);
    
    items.forEach((item) => {
      if (this.y > 270) {
        this.addPage();
      }

      // Small teal dot for bullet
      this.doc.setFillColor(this.accentColor[0], this.accentColor[1], this.accentColor[2]);
      this.doc.circle(this.leftMargin + 4, this.y - 1, 0.8, "F");

      // Text
      this.doc.setTextColor(this.primaryColor[0], this.primaryColor[1], this.primaryColor[2]);
      this.doc.setFont("helvetica", "bold");
      
      // Wrap text in case of long values
      const lines = this.doc.splitTextToSize(item, this.contentWidth - 10);
      this.doc.text(lines, this.leftMargin + 8, this.y);
      
      this.y += (lines.length * 4.5) + 1.5;
    });
    
    this.y += 3; // Spacing below list
  }

  /**
   * Draw the bottom footer with disclaimer and brand signature.
   */
  drawFooter() {
    this.doc.setDrawColor(this.borderColor[0], this.borderColor[1], this.borderColor[2]);
    this.doc.setLineWidth(0.3);
    this.doc.line(this.leftMargin, 282, 195, 282);

    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(this.secondaryColor[0], this.secondaryColor[1], this.secondaryColor[2]);
    this.doc.setFontSize(7.5);
    
    // Left-aligned footer: logo icon + text
    const logoWidth = 5;
    const logoSpacing = 1.5;
    const footerX = this.leftMargin;
    
    drawLogoSVG(this.doc, footerX, 283.5, logoWidth);

    this.doc.setTextColor(this.secondaryColor[0], this.secondaryColor[1], this.secondaryColor[2]);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(8);
    this.doc.text("followproperty.com", footerX + logoWidth + logoSpacing, 287);
    
    // Right-aligned footer
    this.doc.setFont("helvetica", "normal");
    this.doc.text(`Page ${this.currentPage}`, 195, 287, { align: "right" });
  }

  /**
   * Insert a new page.
   */
  addPage() {
    this.drawFooter(); // Draw footer on page being completed
    this.doc.addPage();
    this.currentPage++;
    this.drawHeader(); // Setup header on new page
  }

  /**
   * Finalizes document and exports as Node buffer.
   * @returns {Buffer}
   */
  toBuffer() {
    this.drawFooter(); // Finalize last page
    return Buffer.from(this.doc.output("arraybuffer"));
  }
}
