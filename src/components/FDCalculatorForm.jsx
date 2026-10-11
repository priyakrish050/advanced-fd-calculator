import React, { useState, useEffect } from 'react';
import { validateFDInputs, calculateFD, generateGrowthSeries, generateYearWiseTable } from '../utils/fdCalculations';
import { sanitizeNumericInput } from '../utils/validation';

const PRESETS = [
  { label: '₹1 Lakh · 7% · 1Y', principal: '100000', rate: '7', years: '1', months: '0', frequency: 'quarterly' },
  { label: '₹5 Lakh · 7.5% · 3Y', principal: '500000', rate: '7.5', years: '3', months: '0', frequency: 'quarterly' },
  { label: '₹10 Lakh · 8% · 5Y', principal: '1000000', rate: '8', years: '5', months: '0', frequency: 'monthly' },
  { label: '₹50k · 6.5% · 6M', principal: '50000', rate: '6.5', years: '0', months: '6', frequency: 'quarterly' },
];

const FREQUENCIES = [
  { value: 'annually', label: 'Annually (1×)' },
  { value: 'half-yearly', label: 'Half-Yearly (2×)' },
  { value: 'quarterly', label: 'Quarterly (4×)' },
  { value: 'monthly', label: 'Monthly (12×)' },
];

export default function FDCalculatorForm({ onCalculate, initialValues }) {
  const [inputs, setInputs] = useState({
    principal: '100000',
    rate: '7.5',
    years: '5',
    months: '0',
    frequency: 'quarterly',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setInputs((prev) => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  const handleChange = (field, value) => {
    let sanitized = value;
    if (['principal', 'rate', 'years', 'months'].includes(field)) {
      sanitized = sanitizeNumericInput(value, field === 'rate' || field === 'principal');
    }
    setInputs((prev) => ({ ...prev, [field]: sanitized }));
    if (touched) {
      const validation = validateFDInputs({ ...inputs, [field]: sanitized });
      setErrors(validation.errors);
    }
  };

  const applyPreset = (preset) => {
    setInputs({
      principal: preset.principal,
      rate: preset.rate,
      years: preset.years,
      months: preset.months,
      frequency: preset.frequency,
    });
    setErrors({});
    setTouched(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    const validation = validateFDInputs(inputs);
    setErrors(validation.errors);
    if (!validation.isValid) return;

    try {
      const result = calculateFD(inputs);
      const growthSeries = generateGrowthSeries(inputs);
      const yearWise = generateYearWiseTable(inputs);
      onCalculate({ inputs: { ...inputs }, result, growthSeries, yearWise });
    } catch (err) {
      setErrors({ general: err.message || 'Calculation failed' });
    }
  };

  const handleReset = () => {
    setInputs({
      principal: '100000',
      rate: '7.5',
      years: '5',
      months: '0',
      frequency: 'quarterly',
    });
    setErrors({});
    setTouched(false);
    onCalculate(null);
  };

  return (
    <div className="card">
      <h3 className="card-title">FD Calculator Inputs</h3>

      <div className="presets" role="group" aria-label="Quick presets">
        {PRESETS.map((p) => (
          <button key={p.label} type="button" className="preset-chip" onClick={() => applyPreset(p)}>
            {p.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="principal">Principal Amount (₹)</label>
            <input
              id="principal"
              type="text"
              inputMode="decimal"
              className={`form-control ${errors.principal ? 'error' : ''}`}
              value={inputs.principal}
              onChange={(e) => handleChange('principal', e.target.value)}
              placeholder="e.g. 100000"
              aria-describedby={errors.principal ? 'principal-error' : 'principal-hint'}
            />
            <span id="principal-hint" className="hint">Minimum 0 · Indian Rupees</span>
            {errors.principal && <span id="principal-error" className="error-msg" role="alert">{errors.principal}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="rate">Annual Interest Rate (%)</label>
            <input
              id="rate"
              type="text"
              inputMode="decimal"
              className={`form-control ${errors.rate ? 'error' : ''}`}
              value={inputs.rate}
              onChange={(e) => handleChange('rate', e.target.value)}
              placeholder="e.g. 7.5"
            />
            <span className="hint">Nominal annual rate</span>
            {errors.rate && <span className="error-msg" role="alert">{errors.rate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="years">Duration – Years</label>
            <input
              id="years"
              type="text"
              inputMode="numeric"
              className={`form-control ${errors.duration ? 'error' : ''}`}
              value={inputs.years}
              onChange={(e) => handleChange('years', e.target.value)}
              placeholder="0–100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="months">Duration – Months</label>
            <input
              id="months"
              type="text"
              inputMode="numeric"
              className={`form-control ${errors.duration ? 'error' : ''}`}
              value={inputs.months}
              onChange={(e) => handleChange('months', e.target.value)}
              placeholder="0–11 preferred"
            />
            {errors.duration && <span className="error-msg" role="alert">{errors.duration}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="frequency">Compounding Frequency</label>
            <select
              id="frequency"
              className={`form-control ${errors.frequency ? 'error' : ''}`}
              value={inputs.frequency}
              onChange={(e) => handleChange('frequency', e.target.value)}
            >
              {FREQUENCIES.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            {errors.frequency && <span className="error-msg" role="alert">{errors.frequency}</span>}
          </div>
        </div>

        {errors.general && (
          <div className="info-box" style={{ background: 'var(--danger-light)', borderLeftColor: 'var(--danger)' }} role="alert">
            {errors.general}
          </div>
        )}

        <div className="btn-group mt-2">
          <button type="submit" className="btn btn-primary">Calculate Maturity</button>
          <button type="button" className="btn btn-secondary" onClick={handleReset}>Reset</button>
        </div>
      </form>
    </div>
  );
}
