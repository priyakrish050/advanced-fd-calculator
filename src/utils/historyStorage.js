/**
 * Calculation History using localStorage
 * No sensitive data is stored. Only calculation parameters and results.
 */

const STORAGE_KEY = 'advanced_fd_calculator_history';
const MAX_ENTRIES = 50;

/**
 * @typedef {Object} HistoryEntry
 * @property {string} id
 * @property {string} timestamp
 * @property {Object} inputs
 * @property {Object} result
 * @property {string} [label]
 */

export function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Failed to load history', e);
    return [];
  }
}

export function saveHistory(entries) {
  try {
    const trimmed = entries.slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    return true;
  } catch (e) {
    console.warn('Failed to save history', e);
    return false;
  }
}

export function addToHistory(entry) {
  const history = loadHistory();
  const newEntry = {
    id: crypto.randomUUID ? crypto.randomUUID() : `fd-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };
  const updated = [newEntry, ...history].slice(0, MAX_ENTRIES);
  saveHistory(updated);
  return newEntry;
}

export function deleteHistoryEntry(id) {
  const history = loadHistory();
  const updated = history.filter((e) => e.id !== id);
  saveHistory(updated);
  return updated;
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
  return [];
}

export function exportHistoryAsJSON() {
  const history = loadHistory();
  return JSON.stringify(history, null, 2);
}
