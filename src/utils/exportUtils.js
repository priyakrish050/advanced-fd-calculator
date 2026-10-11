/**
 * Export utilities for PDF and CSV reports
 * Uses jsPDF when available; falls back gracefully.
 */

import { formatINR } from './fdCalculations';

/**
 * Export calculation as CSV string and trigger download
 */
export function exportToCSV(result, inputs, filename = 'fd-calculation.csv') {
  const rows = [
    ['Advanced Fixed Deposit Calculator - Calculation Report'],
    ['Generated on', new Date().toLocaleString('en-IN')],
    [],
    ['INPUT PARAMETERS'],
    ['Principal Amount (₹)', inputs.principal],
    ['Annual Interest Rate (%)', inputs.rate],
    ['Duration (Years)', inputs.years],
    ['Duration (Months)', inputs.months],
    ['Compounding Frequency', inputs.frequency],
    [],
    ['RESULTS'],
    ['Principal Amount', formatINR(result.principal)],
    ['Total Interest Earned', formatINR(result.interestEarned)],
    ['Maturity Amount', formatINR(result.maturityAmount)],
    ['Effective Annual Yield (%)', result.effectiveAnnualYield],
    ['Total Duration (Years)', result.totalYears],
    [],
    ['FORMULA USED'],
    ['A = P (1 + r/n)^(n t)'],
    ['Where A = Maturity, P = Principal, r = rate (decimal), n = compounding frequency, t = time in years'],
    [],
    ['ASSUMPTIONS'],
    ['- Standard compound interest model'],
    ['- No TDS, penalties, or bank-specific day-count conventions applied'],
    ['- Rounding to 2 decimal places'],
    ['- This is an educational tool and not financial advice'],
  ];

  const csvContent = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  downloadBlob(csvContent, filename, 'text/csv;charset=utf-8;');
}

/**
 * Generate and download PDF report using jsPDF (dynamic import recommended in component)
 */
export async function exportToPDF(result, inputs, growthTable = []) {
  try {
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(18);
    doc.setTextColor(30, 64, 175); // blue
    doc.text('Advanced Fixed Deposit Calculator', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(11);
    doc.setTextColor(80);
    doc.text('Financial Growth Analysis Report', pageWidth / 2, 28, { align: 'center' });
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, pageWidth / 2, 35, { align: 'center' });

    // Inputs section
    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text('1. Input Parameters', 14, 48);

    autoTable(doc, {
      startY: 52,
      head: [['Parameter', 'Value']],
      body: [
        ['Principal Amount', formatINR(inputs.principal)],
        ['Annual Interest Rate', `${inputs.rate}%`],
        ['Duration', `${inputs.years} years ${inputs.months} months`],
        ['Compounding Frequency', inputs.frequency],
      ],
      theme: 'striped',
      headStyles: { fillColor: [30, 64, 175] },
      margin: { left: 14, right: 14 },
    });

    // Results
    let finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(13);
    doc.text('2. Calculation Results', 14, finalY);

    autoTable(doc, {
      startY: finalY + 4,
      head: [['Metric', 'Value']],
      body: [
        ['Principal Amount', formatINR(result.principal)],
        ['Total Interest Earned', formatINR(result.interestEarned)],
        ['Maturity Amount', formatINR(result.maturityAmount)],
        ['Effective Annual Yield', `${result.effectiveAnnualYield}%`],
        ['Total Duration (Years)', String(result.totalYears)],
      ],
      theme: 'striped',
      headStyles: { fillColor: [5, 150, 105] },
      margin: { left: 14, right: 14 },
    });

    // Formula
    finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(13);
    doc.text('3. Formula & Assumptions', 14, finalY);
    doc.setFontSize(10);
    doc.text('Formula: A = P (1 + r/n)^(n × t)', 14, finalY + 8);
    doc.setFontSize(9);
    const assumptions = [
      '• A = Maturity Amount, P = Principal, r = annual rate (decimal), n = compounding periods/year, t = years',
      '• Standard compound interest model used. Does not replicate every bank FD rule.',
      '• No TDS, premature withdrawal charges, or leap-year adjustments applied.',
      '• Amounts rounded to 2 decimal places (paise).',
      '• This tool is for educational purposes only and does not constitute financial advice.',
    ];
    assumptions.forEach((line, i) => {
      doc.text(line, 14, finalY + 16 + i * 6);
    });

    // Growth table if provided
    if (growthTable && growthTable.length > 0) {
      finalY = finalY + 16 + assumptions.length * 6 + 8;
      if (finalY > 250) {
        doc.addPage();
        finalY = 20;
      }
      doc.setFontSize(13);
      doc.text('4. Year-wise Growth Summary', 14, finalY);

      autoTable(doc, {
        startY: finalY + 4,
        head: [['Year', 'Years Elapsed', 'Closing Balance', 'Cumulative Interest']],
        body: growthTable.map((row) => [
          row.year,
          row.yearsElapsed,
          formatINR(row.closingBalance),
          formatINR(row.cumulativeInterest),
        ]),
        theme: 'striped',
        headStyles: { fillColor: [30, 64, 175] },
        margin: { left: 14, right: 14 },
        styles: { fontSize: 8 },
      });
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text(
        'Advanced FD Calculator & Financial Growth Analysis System | Educational Project',
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    doc.save(`FD_Report_${Date.now()}.pdf`);
    return true;
  } catch (err) {
    console.error('PDF export failed', err);
    alert('PDF library not available. Please ensure jspdf and jspdf-autotable are installed.');
    return false;
  }
}

function downloadBlob(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
