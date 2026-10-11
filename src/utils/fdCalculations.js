/**
 * Advanced Fixed Deposit Calculation Utilities
 * Standard Compound Interest Formula: A = P (1 + r/n)^(n*t)
 * 
 * Assumptions:
 * - Interest is compounded at the selected frequency.
 * - No premature withdrawal penalties modeled.
 * - Rates are nominal annual rates.
 * - Duration is converted to fractional years (years + months/12).
 * - Rounding to 2 decimal places for currency (Indian Rupee standard).
 * - Does not match every bank's exact day-count convention or TDS rules.
 */

/**
 * Get number of compounding periods per year
 * @param {string} frequency - 'annually' | 'half-yearly' | 'quarterly' | 'monthly'
 * @returns {number}
 */
export function getCompoundingFrequency(frequency) {
  const map = {
    annually: 1,
    'half-yearly': 2,
    quarterly: 4,
    monthly: 12,
  };
  return map[frequency] || 1;
}

/**
 * Convert years and months to total years (fractional)
 * @param {number} years
 * @param {number} months
 * @returns {number}
 */
export function toTotalYears(years, months) {
  const y = Number(years) || 0;
  const m = Number(months) || 0;
  return y + m / 12;
}

/**
 * Core maturity calculation
 * @param {Object} params
 * @param {number} params.principal - Principal amount in INR
 * @param {number} params.rate - Annual interest rate in percent (e.g. 7.5)
 * @param {number} params.years - Whole years
 * @param {number} params.months - Additional months (0-11 preferred)
 * @param {string} params.frequency - Compounding frequency
 * @returns {Object} Calculation result
 */
export function calculateFD({ principal, rate, years, months, frequency }) {
  const P = Number(principal);
  const r = Number(rate) / 100; // decimal
  const n = getCompoundingFrequency(frequency);
  const t = toTotalYears(years, months);

  // Validation guards (caller should also validate)
  if (!isFinite(P) || P < 0) {
    throw new Error('Principal must be a non-negative number');
  }
  if (!isFinite(r) || r < 0) {
    throw new Error('Interest rate must be a non-negative number');
  }
  if (!isFinite(t) || t < 0) {
    throw new Error('Duration must be non-negative');
  }
  if (n <= 0) {
    throw new Error('Invalid compounding frequency');
  }

  // A = P * (1 + r/n)^(n*t)
  const base = 1 + r / n;
  const exponent = n * t;
  const maturityAmount = P * Math.pow(base, exponent);
  const interestEarned = maturityAmount - P;

  // Effective Annual Yield (EAY) = (1 + r/n)^n - 1
  const eay = Math.pow(1 + r / n, n) - 1;

  return {
    principal: roundCurrency(P),
    ratePercent: Number(rate),
    years: Number(years) || 0,
    months: Number(months) || 0,
    totalYears: roundTo(t, 4),
    frequency,
    compoundingPerYear: n,
    maturityAmount: roundCurrency(maturityAmount),
    interestEarned: roundCurrency(interestEarned),
    effectiveAnnualYield: roundTo(eay * 100, 4), // as percent
    formula: `A = ${P} × (1 + ${Number(rate)}/100/${n})^(${n} × ${t.toFixed(4)})`,
  };
}

/**
 * Generate period-wise growth data for charts and tables
 * @param {Object} params - same as calculateFD
 * @param {number} [stepsPerYear=4] - resolution for intermediate points
 * @returns {Array<{period: number, yearLabel: string, principal: number, interest: number, total: number}>}
 */
export function generateGrowthSeries({ principal, rate, years, months, frequency }, stepsPerYear = 4) {
  const P = Number(principal);
  const r = Number(rate) / 100;
  const n = getCompoundingFrequency(frequency);
  const t = toTotalYears(years, months);
  const totalSteps = Math.max(1, Math.ceil(t * stepsPerYear));
  const series = [];

  for (let i = 0; i <= totalSteps; i++) {
    const currentT = (i / totalSteps) * t;
    const amount = P * Math.pow(1 + r / n, n * currentT);
    const interest = amount - P;
    series.push({
      period: i,
      yearLabel: currentT.toFixed(2),
      yearsElapsed: roundTo(currentT, 4),
      principal: roundCurrency(P),
      interest: roundCurrency(interest),
      total: roundCurrency(amount),
    });
  }
  return series;
}

/**
 * Year-wise summary table (integer years + final)
 */
export function generateYearWiseTable({ principal, rate, years, months, frequency }) {
  const P = Number(principal);
  const r = Number(rate) / 100;
  const n = getCompoundingFrequency(frequency);
  const t = toTotalYears(years, months);
  const maxYear = Math.ceil(t);
  const rows = [];

  for (let y = 1; y <= maxYear; y++) {
    const currentT = Math.min(y, t);
    const amount = P * Math.pow(1 + r / n, n * currentT);
    rows.push({
      year: y,
      yearsElapsed: roundTo(currentT, 4),
      openingBalance: y === 1 ? roundCurrency(P) : rows[y - 2].closingBalance,
      interestForPeriod: roundCurrency(amount - (y === 1 ? P : rows[y - 2].closingBalance)),
      closingBalance: roundCurrency(amount),
      cumulativeInterest: roundCurrency(amount - P),
    });
  }
  return rows;
}

/**
 * Compare multiple FD options
 * @param {Array<Object>} options - array of calculateFD params
 * @returns {Array<Object>} results with comparison metrics
 */
export function compareFDs(options) {
  const results = options.map((opt, idx) => {
    const calc = calculateFD(opt);
    return {
      id: idx + 1,
      label: opt.label || `Option ${idx + 1}`,
      ...calc,
    };
  });

  // Sort by maturity descending for ranking
  const sorted = [...results].sort((a, b) => b.maturityAmount - a.maturityAmount);
  const best = sorted[0];

  return results.map((r) => ({
    ...r,
    differenceFromBest: roundCurrency(best.maturityAmount - r.maturityAmount),
    isBest: r.maturityAmount === best.maturityAmount,
  }));
}

/**
 * Currency formatting for Indian numbering system
 * @param {number} amount
 * @returns {string}
 */
export function formatINR(amount) {
  if (amount == null || !isFinite(amount)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format number with Indian commas (no currency symbol)
 */
export function formatIndianNumber(num) {
  if (num == null || !isFinite(num)) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
}

function roundCurrency(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function roundTo(value, decimals) {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Validate inputs and return errors object
 */
export function validateFDInputs({ principal, rate, years, months, frequency }) {
  const errors = {};

  const p = Number(principal);
  if (principal === '' || principal == null) {
    errors.principal = 'Principal amount is required';
  } else if (!isFinite(p) || p < 0) {
    errors.principal = 'Principal must be a non-negative number';
  } else if (p > 1e12) {
    errors.principal = 'Principal amount is unrealistically large (max 1 trillion)';
  } else if (p === 0) {
    // allow zero for educational zero-interest demos
  }

  const rt = Number(rate);
  if (rate === '' || rate == null) {
    errors.rate = 'Interest rate is required';
  } else if (!isFinite(rt) || rt < 0) {
    errors.rate = 'Interest rate must be a non-negative number';
  } else if (rt > 50) {
    errors.rate = 'Interest rate above 50% is unusually high; please verify';
  }

  const y = Number(years);
  const m = Number(months);
  if ((years === '' || years == null) && (months === '' || months == null)) {
    errors.duration = 'Please enter deposit duration (years and/or months)';
  } else if ((!isFinite(y) || y < 0) || (!isFinite(m) || m < 0)) {
    errors.duration = 'Years and months must be non-negative numbers';
  } else if (y > 100) {
    errors.duration = 'Duration above 100 years is not supported';
  } else if (m >= 12 && y === 0) {
    // allow months > 12, we convert
  }

  const validFreq = ['annually', 'half-yearly', 'quarterly', 'monthly'];
  if (!validFreq.includes(frequency)) {
    errors.frequency = 'Please select a valid compounding frequency';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Sample calculation for documentation / educational section
 */
export function getSampleCalculation() {
  return calculateFD({
    principal: 100000,
    rate: 7.5,
    years: 5,
    months: 0,
    frequency: 'quarterly',
  });
}
