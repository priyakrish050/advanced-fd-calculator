import React from 'react';
import { getSampleCalculation, formatINR } from '../utils/fdCalculations';

export default function LearnSection() {
  const sample = getSampleCalculation();

  return (
    <div>
      <div className="section-block">
        <h2>Understanding Fixed Deposits</h2>
        <p>
          A Fixed Deposit (FD) is a financial instrument offered by banks and NBFCs where you deposit a lump sum
          for a fixed tenure at a predetermined interest rate. The interest may be compounded at different frequencies.
        </p>
      </div>

      <div className="section-block">
        <h2>Key Terminology</h2>
        <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
          <li><strong>Principal</strong> – The initial amount you deposit.</li>
          <li><strong>Interest Rate</strong> – The annual nominal rate offered by the institution.</li>
          <li><strong>Tenure / Duration</strong> – How long the money remains locked (years + months).</li>
          <li><strong>Compounding Frequency</strong> – How often interest is added to the principal (monthly, quarterly, etc.).</li>
          <li><strong>Maturity Amount</strong> – The final amount you receive at the end of the tenure.</li>
          <li><strong>Effective Annual Yield (EAY)</strong> – The equivalent annual return after accounting for compounding.</li>
        </ul>
      </div>

      <div className="section-block">
        <h2>The Compound Interest Formula</h2>
        <div className="formula-box">
          A = P × (1 + r/n)<sup>(n × t)</sup>
        </div>
        <p>
          Where <strong>A</strong> = maturity amount, <strong>P</strong> = principal, <strong>r</strong> = annual rate as a decimal,
          <strong>n</strong> = number of compounding periods per year, <strong>t</strong> = time in years.
        </p>
        <div className="info-box">
          <strong>Important:</strong> This is the standard mathematical model used by most educational calculators.
          Actual bank FDs may use different day-count conventions, apply TDS, or offer special senior-citizen rates.
          Always verify with the bank before investing.
        </div>
      </div>

      <div className="section-block">
        <h2>Sample Calculation</h2>
        <p>Principal = ₹1,00,000 · Rate = 7.5% p.a. · Tenure = 5 years · Compounding = Quarterly</p>
        <div className="summary-grid mt-2">
          <div className="summary-card">
            <div className="summary-label">Principal</div>
            <div className="summary-value">{formatINR(sample.principal)}</div>
          </div>
          <div className="summary-card success">
            <div className="summary-label">Interest</div>
            <div className="summary-value">{formatINR(sample.interestEarned)}</div>
          </div>
          <div className="summary-card accent">
            <div className="summary-label">Maturity</div>
            <div className="summary-value">{formatINR(sample.maturityAmount)}</div>
          </div>
        </div>
        <p className="mt-2 text-muted" style={{ fontSize: '0.9rem' }}>
          Formula applied: {sample.formula}
        </p>
      </div>

      <div className="section-block">
        <h2>Why Compounding Frequency Matters</h2>
        <p>
          More frequent compounding produces a slightly higher maturity amount for the same nominal rate.
          For example, 8% compounded monthly yields a higher effective annual rate than 8% compounded annually.
        </p>
      </div>
    </div>
  );
}
