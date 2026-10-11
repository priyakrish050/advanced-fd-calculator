import React from 'react';

export default function AboutSection() {
  return (
    <div>
      <div className="section-block">
        <h2>About This Project</h2>
        <p>
          <strong>Advanced Fixed Deposit Calculator and Financial Growth Analysis System</strong> is a complete
          educational web application built as a college-level project. It demonstrates modern frontend development,
          accurate financial calculations, interactive data visualisation, and professional UI/UX design.
        </p>
      </div>

      <div className="section-block">
        <h2>Features Implemented</h2>
        <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
          <li>Standard compound-interest FD calculator with four compounding frequencies</li>
          <li>Interactive pie and line charts (Recharts)</li>
          <li>Year-wise growth table</li>
          <li>Side-by-side comparison of up to three FD options</li>
          <li>Calculation history stored in browser localStorage</li>
          <li>PDF report generation and CSV export</li>
          <li>Light / Dark theme</li>
          <li>Responsive design for mobile, tablet and desktop</li>
          <li>Input validation and friendly error messages</li>
          <li>Educational content explaining FD concepts</li>
          <li>Indian Rupee (₹) formatting with en-IN locale</li>
        </ul>
      </div>

      <div className="section-block">
        <h2>Technology Stack</h2>
        <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
          <li>React 19 + Vite</li>
          <li>Recharts for visualisations</li>
          <li>jsPDF + jspdf-autotable for PDF reports</li>
          <li>Pure CSS with CSS custom properties (themes)</li>
          <li>localStorage for persistence</li>
        </ul>
      </div>

      <div className="section-block">
        <h2>Assumptions & Limitations</h2>
        <div className="info-box">
          <ul style={{ paddingLeft: '1.1rem', margin: 0 }}>
            <li>Uses the mathematical compound-interest formula; does not replicate every bank&apos;s day-count or TDS rules.</li>
            <li>No real-time bank interest rates are fetched or displayed.</li>
            <li>History is stored only in the current browser; clearing site data will erase it.</li>
            <li>This tool is for educational purposes and does not constitute financial advice.</li>
          </ul>
        </div>
      </div>

      <div className="section-block">
        <h2>Project Information</h2>
        <p>
          Developed as a complete, self-contained demonstration project. All calculations are performed client-side.
          No user credentials or sensitive banking data are collected or transmitted.
        </p>
      </div>
    </div>
  );
}
