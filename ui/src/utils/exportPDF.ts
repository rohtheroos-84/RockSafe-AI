import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { RiskZone } from '@/services/riskMap';

export async function generateRiskMapPDF(
  zones: RiskZone[],
  mapRef: HTMLElement,
  sensorData: { name: string; value: number }[]
) {
  // Create PDF document
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  
  // Add header
  pdf.setFontSize(20);
  pdf.text('RockSafe AI - Risk Assessment Report', pageWidth / 2, 20, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.text(`Generated on: ${format(new Date(), 'PPpp')}`, pageWidth / 2, 30, { align: 'center' });

  // Capture map view
  const mapCanvas = await html2canvas(mapRef, {
    scale: 2,
    logging: false,
    useCORS: true,
    allowTaint: true,
  });
  const mapImage = mapCanvas.toDataURL('image/jpeg', 1.0);
  
  // Add map to PDF
  pdf.addImage(mapImage, 'JPEG', 10, 40, pageWidth - 20, 80);
  
  // Add risk zones table
  pdf.setFontSize(14);
  pdf.text('Risk Zone Analysis', 10, 135);
  
  pdf.setFontSize(10);
  const headers = ['Zone Name', 'Risk Level', 'Probability', 'Sensors', 'Last Incident'];
  const rows = zones.map(zone => [
    zone.name,
    zone.risk.toUpperCase(),
    `${zone.probability}%`,
    zone.sensors.toString(),
    zone.lastIncident
  ]);
  
  // Create table
  const tableData = [headers, ...rows];
  const startY = 140;
  const cellWidth = 35;
  const cellHeight = 7;
  const textPadding = 2;
  
  // Draw table headers
  tableData[0].forEach((header, i) => {
    pdf.setFillColor(240, 240, 240);
    pdf.rect(10 + i * cellWidth, startY, cellWidth, cellHeight, 'F');
    pdf.text(header, 10 + i * cellWidth + textPadding, startY + 5);
  });
  
  // Draw table rows
  rows.forEach((row, rowIndex) => {
    const y = startY + (rowIndex + 1) * cellHeight;
    row.forEach((cell, cellIndex) => {
      pdf.text(cell, 10 + cellIndex * cellWidth + textPadding, y + 5);
    });
  });
  
  // Add sensor status
  const totalSensors = sensorData.reduce((acc, curr) => acc + curr.value, 0);
  pdf.setFontSize(14);
  pdf.text('Sensor Status Overview', 10, 220);
  pdf.setFontSize(10);
  sensorData.forEach((item, index) => {
    const percentage = ((item.value / totalSensors) * 100).toFixed(1);
    pdf.text(
      `${item.name}: ${item.value} (${percentage}%)`,
      10,
      230 + (index * 6)
    );
  });

  // Add footer
  pdf.setFontSize(8);
  pdf.text(
    'RockSafe AI - Automated Mining Safety System',
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  return pdf;
}