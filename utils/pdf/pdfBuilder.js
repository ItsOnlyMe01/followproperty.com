import { jsPDF } from "jspdf";

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
    this.accentColor = [13, 148, 136];     // Teal (#0D9488)
    this.lightBgColor = [248, 250, 252];   // Slate-50 (#F8FAFC)
    this.borderColor = [226, 232, 240];   // Slate-200 (#E2E8F0)
    
    this.y = 20; // Current Y-cursor position
    this.leftMargin = 15;
    this.rightMargin = 15;
    this.contentWidth = 180; // A4 width (210) - leftMargin(15) - rightMargin(15)
  }

  /**
   * Draw the top teal accent stripe.
   */
  drawAccentLine() {
    this.doc.setFillColor(this.accentColor[0], this.accentColor[1], this.accentColor[2]);
    this.doc.rect(0, 0, 210, 4, "F");
  }

  /**
   * Draw the standard page header.
   */
  drawHeader() {
    this.drawAccentLine();
    
    // Logo text
    this.doc.setTextColor(this.primaryColor[0], this.primaryColor[1], this.primaryColor[2]);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(16);
    this.doc.text("FollowProperty", this.leftMargin, 15);

    // Document label
    this.doc.setTextColor(this.secondaryColor[0], this.secondaryColor[1], this.secondaryColor[2]);
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(8);
    this.doc.text("OFFICIAL PROJECT REPORT", this.leftMargin, 20);

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
    
    // Teal vertical bar
    this.doc.setFillColor(this.accentColor[0], this.accentColor[1], this.accentColor[2]);
    this.doc.rect(this.leftMargin, this.y, 2, 5, "F");

    // Heading text
    this.doc.setTextColor(this.primaryColor[0], this.primaryColor[1], this.primaryColor[2]);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(10);
    this.doc.text(text, this.leftMargin + 4, this.y + 4);

    this.y += 8;
  }

  /**
   * Draw a clean 2-column specifications table grid with alternating fills.
   * @param {Array<{label: string, value: string|number}>} items 
   */
  addKeyValueGrid(items) {
    if (!items || items.length === 0) return;
    
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(9);
    
    const rowHeight = 7;
    items.forEach((item, index) => {
      // Check page height, leave ~20mm margin
      if (this.y > 270) {
        this.addPage();
      }

      // Alternating background row
      if (index % 2 === 0) {
        this.doc.setFillColor(this.lightBgColor[0], this.lightBgColor[1], this.lightBgColor[2]);
        this.doc.rect(this.leftMargin, this.y - 4, this.contentWidth, rowHeight, "F");
      }

      // Label (Column 1)
      this.doc.setTextColor(this.secondaryColor[0], this.secondaryColor[1], this.secondaryColor[2]);
      this.doc.setFont("helvetica", "normal");
      this.doc.text(item.label, this.leftMargin + 3, this.y + 1);

      // Value (Column 2)
      this.doc.setTextColor(this.primaryColor[0], this.primaryColor[1], this.primaryColor[2]);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(String(item.value), this.leftMargin + 90, this.y + 1);

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
    
    // Left-aligned footer
    this.doc.text("Generated by FollowProperty", this.leftMargin, 288);
    
    // Right-aligned footer
    this.doc.text("", 195, 288, { align: "right" });
  }

  /**
   * Insert a new page.
   */
  addPage() {
    this.drawFooter(); // Draw footer on page being completed
    this.doc.addPage();
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
