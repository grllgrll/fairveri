import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFExportOptions {
  title?: string;
  subtitle?: string;
  includeCharts?: boolean;
  includeRecommendations?: boolean;
  format?: 'a4' | 'letter';
}

export class PDFExporter {
  private pdf: jsPDF;
  private yPosition: number = 20;
  private pageHeight: number;
  private pageWidth: number;
  private margin: number = 20;

  constructor(format: 'a4' | 'letter' = 'a4') {
    this.pdf = new jsPDF('p', 'mm', format);
    this.pageHeight = this.pdf.internal.pageSize.height;
    this.pageWidth = this.pdf.internal.pageSize.width;
  }

  private checkPageBreak(height: number = 20): void {
    if (this.yPosition + height > this.pageHeight - this.margin) {
      this.pdf.addPage();
      this.yPosition = this.margin;
    }
  }

  private addTitle(text: string, fontSize: number = 20): void {
    this.checkPageBreak(30);
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(text, this.margin, this.yPosition);
    this.yPosition += fontSize * 0.5 + 10;
  }

  private addSubtitle(text: string, fontSize: number = 14): void {
    this.checkPageBreak(20);
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(100, 100, 100);
    this.pdf.text(text, this.margin, this.yPosition);
    this.pdf.setTextColor(0, 0, 0);
    this.yPosition += fontSize * 0.5 + 8;
  }

  private addText(text: string, fontSize: number = 11, fontWeight: 'normal' | 'bold' = 'normal'): void {
    this.checkPageBreak(15);
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont('helvetica', fontWeight);
    
    // Handle text wrapping
    const lines = this.pdf.splitTextToSize(text, this.pageWidth - 2 * this.margin);
    this.pdf.text(lines, this.margin, this.yPosition);
    this.yPosition += lines.length * fontSize * 0.5 + 5;
  }

  private addSection(title: string): void {
    this.yPosition += 10;
    this.checkPageBreak(25);
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(59, 130, 246); // Blue color
    this.pdf.text(title, this.margin, this.yPosition);
    this.pdf.setTextColor(0, 0, 0);
    this.yPosition += 15;
  }

  private addScoreCard(title: string, score: number, maxScore: number, color: string): void {
    this.checkPageBreak(30);
    
    const percentage = Math.round((score / maxScore) * 100);
    
    // Draw background rectangle
    this.pdf.setFillColor(245, 245, 245);
    this.pdf.rect(this.margin, this.yPosition - 5, this.pageWidth - 2 * this.margin, 25, 'F');
    
    // Add title
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, this.margin + 5, this.yPosition + 5);
    
    // Add score
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`${score}/${maxScore} (${percentage}%)`, this.margin + 5, this.yPosition + 15);
    
    // Draw progress bar
    const barWidth = 50;
    const barHeight = 4;
    const barX = this.pageWidth - this.margin - barWidth - 5;
    const barY = this.yPosition + 5;
    
    // Background bar
    this.pdf.setFillColor(220, 220, 220);
    this.pdf.rect(barX, barY, barWidth, barHeight, 'F');
    
    // Progress bar
    const progressWidth = (barWidth * percentage) / 100;
    const colorRgb = this.hexToRgb(color);
    this.pdf.setFillColor(colorRgb.r, colorRgb.g, colorRgb.b);
    this.pdf.rect(barX, barY, progressWidth, barHeight, 'F');
    
    this.yPosition += 35;
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  private addBulletList(items: string[]): void {
    items.forEach(item => {
      this.checkPageBreak(15);
      this.pdf.setFontSize(11);
      this.pdf.setFont('helvetica', 'normal');
      
      // Add bullet point
      this.pdf.text('•', this.margin + 5, this.yPosition);
      
      // Add text with wrapping
      const lines = this.pdf.splitTextToSize(item, this.pageWidth - 2 * this.margin - 15);
      this.pdf.text(lines, this.margin + 15, this.yPosition);
      this.yPosition += lines.length * 6 + 3;
    });
  }

  async addChartFromElement(elementId: string): Promise<void> {
    try {
      const element = document.getElementById(elementId);
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = this.pageWidth - 2 * this.margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      this.checkPageBreak(imgHeight + 10);
      this.pdf.addImage(imgData, 'PNG', this.margin, this.yPosition, imgWidth, imgHeight);
      this.yPosition += imgHeight + 10;
    } catch (error) {
      // Error adding chart to PDF export
    }
  }

  generateReport(results: any, assessmentData: any, options: PDFExportOptions = {}): void {
    const {
      title = 'FAIR Assessment Report',
      subtitle = `Generated on ${new Date().toLocaleDateString()}`,
      includeCharts = true,
      includeRecommendations = true
    } = options;

    // Title page
    this.addTitle(title);
    this.addSubtitle(subtitle);
    this.yPosition += 20;

    // Executive Summary
    this.addSection('Executive Summary');
    const overallPercentage = Math.round((results.totalScore / results.maxScore) * 100);
    this.addText(`Your dataset achieved an overall FAIR score of ${overallPercentage}% (${results.totalScore}/${results.maxScore} points).`);
    this.addText(`Assessment Level: ${results.level}`);
    this.addText(results.levelDescription);

    // Detailed Scores
    this.addSection('Detailed Category Scores');
    assessmentData.assessment.categories.forEach((category: any) => {
      const categoryScore = results.categoryScores[category.id];
      if (categoryScore) {
        this.addScoreCard(
          category.title,
          categoryScore.score,
          categoryScore.maxScore,
          category.color
        );
      }
    });

    // Recommendations
    if (includeRecommendations && results.recommendations.length > 0) {
      this.addSection('Recommendations for Improvement');
      this.addBulletList(results.recommendations);
    }

    // Category Details
    this.addSection('Category Breakdown');
    assessmentData.assessment.categories.forEach((category: any) => {
      const categoryScore = results.categoryScores[category.id];
      if (categoryScore) {
        this.yPosition += 5;
        this.addText(`${category.icon} ${category.title}`, 13, 'bold');
        this.addText(category.description);
        this.addText(`Score: ${categoryScore.score}/${categoryScore.maxScore} (${Math.round(categoryScore.percentage)}%)`);
        this.yPosition += 10;
      }
    });

    // Footer
    this.yPosition = this.pageHeight - 30;
    this.pdf.setFontSize(9);
    this.pdf.setTextColor(150, 150, 150);
    this.pdf.text('Generated by FairVeri Assessment Tool', this.margin, this.yPosition);
    this.pdf.text(`Page ${this.pdf.internal.getCurrentPageInfo().pageNumber}`, this.pageWidth - 40, this.yPosition);
  }

  save(filename: string = 'fair-assessment-report.pdf'): void {
    this.pdf.save(filename);
  }

  getBlob(): Blob {
    return this.pdf.output('blob');
  }

  getDataURL(): string {
    return this.pdf.output('dataurlstring');
  }
}

export const generateAssessmentPDF = async (
  results: any,
  assessmentData: any,
  options: PDFExportOptions = {}
): Promise<void> => {
  const exporter = new PDFExporter(options.format);
  exporter.generateReport(results, assessmentData, options);
  
  const timestamp = new Date().toISOString().split('T')[0];
  exporter.save(`fair-assessment-report-${timestamp}.pdf`);
};