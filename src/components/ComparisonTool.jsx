import React, { useState } from 'react';
import { compareFDs, formatINR, validateFDInputs } from '../utils/fdCalculations';
import { sanitizeNumericInput } from '../utils/validation';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const emptyOption = () => ({
  label: '',
  principal: '100000',
  rate: '7',
  years: '3',
  months: '0',
  frequency: 'quarterly',
});

export default function ComparisonTool() {
  const [options, setOptions] = useState([
    { ...emptyOption(), label: 'Option A', rate: '7.0' },
    { ...emptyOption(), label: 'Option B', rate: '7.5', years: '5' },
    { ...emptyOption(), label: 'Option C', rate: '8.0', frequency: 'monthly' },
  ]);
  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState([]);

  const updateOption = (idx, field, value) => {
    const sanitized = ['principal', 'rate', 'years', 'months'].includes(field)
      ? sanitizeNumericInput(value, field === 'rate' || field === 'principal')
      : value;
    setOptions((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: sanitized };
      return next;
    });
  };

  const handleCompare = () => {
    const newErrors = options.map((opt) => validateFDInputs(opt).errors);
    setErrors(newErrors);
    if (newErrors.some((e) => Object.keys(e).length > 0)) return;

    try {
      const compared = compareFDs(options);
      setResults(compared);
    } catch (err) {
      alert(err.message);
    }
  };

  const chartData = results
    ? results.map((r) => ({
        name: r.label || `Option ${r.id}`,
        maturity: r.maturityAmount,
        interest: r.interestEarned,
      }))
    : [];

  return (
    <div>
      <div className="section-block">
        <h2>FD Comparison Tool</h2>
        <p>
          Compare up to three hypothetical Fixed Deposit options. Rates shown are illustrative only and do not represent any bank&apos;s current offers.
        </p>
      </div>

      <div className="comparison-grid mb-2">
        {options.map((opt, idx) => (
          <div key={idx} className="card">
            <h4 className="card-title">{opt.label || `Option ${idx + 1}`}</h4>
            <div className="form-group mb-1">
              <label>Label</label>
              <input className="form-control" value={opt.label} onChange={(e) => updateOption(idx, 'label', e.target.value)} />
            </div>
            <div className="form-group mb-1">
              <label>Principal (₹)</label>
              <input className="form-control" value={opt.principal} onChange={(e) => updateOption(idx, 'principal', e.target.value)} />
              {errors[idx]?.principal && <span className="error-msg">{errors[idx].principal}</span>}
            </div>
            <div className="form-group mb-1">
              <label>Rate (%)</label>
              <input className="form-control" value={opt.rate} onChange={(e) => updateOption(idx, 'rate', e.target.value)} />
            </div>
            <div className="form-group mb-1">
              <label>Years / Months</label>
              <div className="flex gap-1">
                <input className="form-control" value={opt.years} onChange={(e) => updateOption(idx, 'years', e.target.value)} placeholder="Years" />
                <input className="form-control" value={opt.months} onChange={(e) => updateOption(idx, 'months', e.target.value)} placeholder="Months" />
              </div>
            </div>
            <div className="form-group">
              <label>Compounding</label>
              <select className="form-control" value={opt.frequency} onChange={(e) => updateOption(idx, 'frequency', e.target.value)}>
                <option value="annually">Annually</option>
                <option value="half-yearly">Half-Yearly</option>
                <option value="quarterly">Quarterly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      <div className="btn-group mb-3">
        <button type="button" className="btn btn-primary" onClick={handleCompare}>Compare Options</button>
      </div>

      {results && (
        <>
          <div className="comparison-grid mb-2">
            {results.map((r) => (
              <div key={r.id} className={`option-card ${r.isBest ? 'best' : ''}`}>
                {r.isBest && <span className="badge-best">Best Maturity</span>}
                <h4>{r.label}</h4>
                <p className="summary-sub">{r.years}y {r.months}m · {r.frequency} · {r.ratePercent}%</p>
                <div className="mt-1">
                  <div className="summary-label">Maturity</div>
                  <div className="summary-value" style={{ fontSize: '1.25rem' }}>{formatINR(r.maturityAmount)}</div>
                </div>
                <div className="mt-1">
                  <div className="summary-label">Interest</div>
                  <div className="text-success" style={{ fontWeight: 600 }}>{formatINR(r.interestEarned)}</div>
                </div>
                {!r.isBest && (
                  <div className="mt-1 text-muted" style={{ fontSize: '0.85rem' }}>
                    Diff from best: −{formatINR(r.differenceFromBest)}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="card chart-card">
            <h3 className="card-title">Maturity Comparison Chart</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => formatINR(v)} />
                  <Legend />
                  <Bar dataKey="maturity" name="Maturity Amount" fill="#1e40af" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="interest" name="Interest Earned" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="info-box mt-2">
            <strong>Assumptions:</strong> Same standard compound-interest formula for all options.
            No bank-specific rules, TDS, or special schemes applied. Values are for illustration only.
          </div>
        </>
      )}
    </div>
  );
}
