/**
 * Input validation helpers for FD Calculator
 */

export const LIMITS = {
  principal: { min: 0, max: 1_000_000_000_000 }, // 1 trillion
  rate: { min: 0, max: 50 },
  years: { min: 0, max: 100 },
  months: { min: 0, max: 1200 }, // allow long months
};

/**
 * Sanitize numeric input string (allow empty, digits, one decimal)
 */
export function sanitizeNumericInput(value, allowDecimal = true) {
  if (value === '' || value == null) return '';
  let cleaned = String(value).replace(/[^0-9.]/g, '');
  if (!allowDecimal) {
    cleaned = cleaned.replace(/\./g, '');
  } else {
    // keep only first decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('');
    }
  }
  return cleaned;
}

/**
 * Check if value is a valid positive number or zero
 */
export function isValidNumber(value) {
  const n = Number(value);
  return value !== '' && value != null && isFinite(n) && n >= 0;
}
