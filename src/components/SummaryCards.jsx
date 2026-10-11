import React from 'react';
import { formatINR } from '../utils/fdCalculations';

export default function SummaryCards({ result }) {
  if (!result) {
    return (
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-label">Principal</div>
          <div className="summary-value">—</div>
        </div>
        <div className="summary-card success">
          <div className="summary-label">Interest Earned</div>
          <div className="summary-value">—</div>
        </div>
        <div className="summary-card accent">
          <div className="summary-label">Maturity Amount</div>
          <div className="summary-value">—</div>
        </div>
        <div className="summary-card warning">
          <div className="summary-label">Duration</div>
          <div className="summary-value">—</div>
        </div>
      </div>
    );
  }

  return (
    <div className="summary-grid">
      <div className="summary-card">
        <div className="summary-label">Principal Amount</div>
        <div className="summary-value">{formatINR(result.principal)}</div>
        <div className="summary-sub">Initial deposit</div>
      </div>
      <div className="summary-card success">
        <div className="summary-label">Total Interest Earned</div>
        <div className="summary-value">{formatINR(result.interestEarned)}</div>
        <div className="summary-sub">EAY: {result.effectiveAnnualYield}%</div>
      </div>
      <div className="summary-card accent">
        <div className="summary-label">Maturity Amount</div>
        <div className="summary-value">{formatINR(result.maturityAmount)}</div>
        <div className="summary-sub">At end of tenure</div>
      </div>
      <div className="summary-card warning">
        <div className="summary-label">Deposit Duration</div>
        <div className="summary-value">
          {result.years}y {result.months}m
        </div>
        <div className="summary-sub">{result.totalYears} years · {result.frequency}</div>
      </div>
    </div>
  );
}
