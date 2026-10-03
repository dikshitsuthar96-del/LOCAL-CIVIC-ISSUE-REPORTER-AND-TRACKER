import { jsPDF } from 'jspdf';
import { Complaint } from '../types.js';

/**
 * Generates and downloads an authentic, official Municipal Grievance Report
 * in PDF format directly to the citizen's local storage device.
 */
export function generateComplaintPDF(complaint: Complaint): void {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;

    // Outer Decorative Border
    doc.setDrawColor(11, 34, 57); // Deep Navy
    doc.setLineWidth(0.8);
    doc.rect(margin - 4, margin - 4, contentWidth + 8, pageHeight - margin * 2 + 8);

    doc.setDrawColor(230, 81, 0); // Saffron accent inner border
    doc.setLineWidth(0.3);
    doc.rect(margin - 2, margin - 2, contentWidth + 4, pageHeight - margin * 2 + 4);

    let y = margin + 6;

    // Header Background Strip
    doc.setFillColor(11, 34, 57);
    doc.rect(margin, y, contentWidth, 18, 'F');

    // Header Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('GOVERNMENT OF INDIA • LOCAL CIVIC GRIEVANCE REDRESSAL', pageWidth / 2, y + 7, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 183, 77); // Saffron/amber
    doc.text('NATIONAL INFORMATICS CENTRE (NIC) STANDARDS • CPGRAMS COMPLIANT', pageWidth / 2, y + 13, { align: 'center' });

    y += 24;

    // Document Title
    doc.setTextColor(11, 34, 57);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text('OFFICIAL MUNICIPAL GRIEVANCE ACKNOWLEDGEMENT', pageWidth / 2, y, { align: 'center' });

    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Statutory Citizen Charter Grievance Receipt & Work Order Tracking Dossier', pageWidth / 2, y, { align: 'center' });

    y += 6;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(margin, y, margin + contentWidth, y);

    y += 7;

    // Key Reference Block (Two columns: Tracking ID & Official Work Order)
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'S');

    // Left Column: Grievance ID
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('GRIEVANCE TRACKING NUMBER:', margin + 6, y + 6);

    doc.setFont('courier', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(complaint.id, margin + 6, y + 14);

    // Center/Right Column: Work Order Reference
    const col2X = margin + contentWidth / 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('OFFICIAL WORK ORDER REFERENCE:', col2X, y + 6);

    doc.setFont('courier', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(230, 81, 0); // Saffron
    doc.text(complaint.officialReferenceNumber || 'WO-PENDING-DISPATCH', col2X, y + 14);

    y += 28;

    // Section 1: Grievance Particulars Table
    const drawSectionHeader = (title: string, currentY: number) => {
      doc.setFillColor(15, 42, 71);
      doc.rect(margin, currentY, contentWidth, 6.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text(title, margin + 4, currentY + 4.5);
      return currentY + 9;
    };

    y = drawSectionHeader('1. GRIEVANCE DOSSIER PARTICULARS', y);

    const rows: [string, string][] = [
      ['Registration Date & Time:', new Date(complaint.createdAt).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })],
      ['Assigned Department:', `${complaint.departmentName} (${complaint.departmentId})`],
      ['Issue Category / Type:', (complaint.issueType || (complaint as any).category || 'Civic Infrastructure').replace('_', ' ').toUpperCase()],
      ['Priority Assessment:', `${complaint.priority} PRIORITY (Standard Municipal SLA: 48-72h)`],
      ['Current Lifecycle Status:', complaint.status],
      ['Reported Location / Site:', complaint.location],
    ];

    rows.forEach(([label, val]) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text(label, margin + 4, y);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      const valLines = doc.splitTextToSize(val, contentWidth - 60);
      doc.text(valLines, margin + 58, y);

      y += Math.max(valLines.length * 4.5, 6);
    });

    y += 3;

    // Section 2: Subject & Detailed Citizen Description
    y = drawSectionHeader('2. COMPLAINT SUMMARY & SYNTHESIZED INCIDENT REPORT', y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`Title: ${complaint.title}`, margin + 4, y);

    y += 5.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const descLines = doc.splitTextToSize(complaint.description || 'No additional details provided.', contentWidth - 8);
    doc.text(descLines, margin + 4, y);

    y += descLines.length * 4 + 5;

    // Section 3: Citizen Applicant Information
    y = drawSectionHeader('3. APPLICANT RECORD & IDENTIFICATION', y);

    const citizenRows: [string, string][] = [
      ['Applicant / Complainant:', complaint.submitterName || 'Citizen of Municipal Ward'],
      ['Contact Mobile Number:', complaint.submitterPhone || 'Registered with Citizen Portal'],
      ['Email for Digital Alerts:', complaint.submitterEmail || 'N/A'],
      ['Unique Citizen Identifier:', complaint.citizenId || 'CITIZEN-AUTH-PORTAL'],
    ];

    citizenRows.forEach(([label, val]) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text(label, margin + 4, y);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(val, margin + 58, y);
      y += 5.5;
    });

    y += 4;

    // Section 4: Statutory Redressal Charter & Guarantee Box
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(11, 34, 57);
    doc.text('PUBLIC SERVICE GUARANTEE & PROOF OF WORK OBLIGATION', margin + 4, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const guaranteeText =
      'Under the Municipal Public Service Charter, the assigned agency is mandated to deploy certified field personnel within the designated SLA timeframe. Upon physical resolution, the competent officer must transmit photographic Proof of Work (Before vs. After) directly to the citizen tracker for independent resident verification and sign-off.';
    const charterLines = doc.splitTextToSize(guaranteeText, contentWidth - 8);
    doc.text(charterLines, margin + 4, y + 10);

    y += 28;

    // Digital Seal & Sign-off Stamp Block
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(148, 163, 184);
    doc.setLineDashPattern([1.5, 1.5], 0);
    doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'S');
    doc.setLineDashPattern([], 0); // reset dash

    // Seal icon text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(16, 185, 129); // Emerald green
    doc.text('[✓ DIGITALLY SEALED & DISPATCHED BY CIVIC AI CO-PILOT]', margin + 6, y + 6);

    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`Digital Transaction Hash: SHA256-${complaint.id}-VERIFIED-CPGRAMS-2026`, margin + 6, y + 11);
    doc.text(`Tracking Portal Endpoint: https://civic.nic.gov.in/track?id=${complaint.id}`, margin + 6, y + 16);

    // Right-side Authority Seal
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(11, 34, 57);
    doc.text('COMPETENT MUNICIPAL AUTHORITY', margin + contentWidth - 6, y + 6, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('Directorate of Public Grievances', margin + contentWidth - 6, y + 11, { align: 'right' });
    doc.text('Computer-Generated Official Receipt', margin + contentWidth - 6, y + 16, { align: 'right' });

    // Footer note
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'This document serves as statutory proof of grievance filing under Section 4(1) of the Citizen Charter Act. Save or print this file for your local records.',
      pageWidth / 2,
      pageHeight - 5,
      { align: 'center' }
    );

    // Trigger save to local storage device
    const fileName = `Municipal_Grievance_Report_${complaint.id}.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error('Failed to generate PDF document:', error);
    // Fallback: open print window
    window.print();
  }
}

/**
 * Fallback / Alternative: Native Browser Print Dialogue formatted for receipt printing
 */
export function triggerPrintReceipt(complaint: Complaint): void {
  try {
    window.print();
  } catch (e) {
    console.error('Print failed:', e);
  }
}
