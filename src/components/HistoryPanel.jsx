import React, { useState, useEffect } from 'react';
import { loadHistory, deleteHistoryEntry, clearHistory } from '../utils/historyStorage';
import { formatINR } from '../utils/fdCalculations';

export default function HistoryPanel({ onReload, refreshKey }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, [refreshKey]);

  const handleDelete = (id) => {
    const updated = deleteHistoryEntry(id);
    setHistory(updated);
  };

  const handleClear = () => {
    if (window.confirm('Clear all saved calculations? This cannot be undone.')) {
      clearHistory();
      setHistory([]);
    }
  };

  const handleReopen = (entry) => {
    if (onReload) {
      onReload(entry);
    }
  };

  if (history.length === 0) {
    return (
      <div className="empty-state">
        <p>No saved calculations yet. Perform a calculation and it will appear here automatically.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex-between mb-2">
        <h2>Calculation History</h2>
        <button type="button" className="btn btn-outline btn-sm" onClick={handleClear}>Clear All</button>
      </div>
      <p className="text-muted mb-2">Stored locally in your browser. No data is sent to any server.</p>

      <div className="history-list">
        {history.map((entry) => (
          <div key={entry.id} className="history-item">
            <div>
              <strong>{formatINR(entry.result?.maturityAmount || 0)}</strong>
              <span className="text-muted"> maturity</span>
              <div className="history-meta">
                P: {formatINR(entry.inputs?.principal)} · {entry.inputs?.rate}% ·{' '}
                {entry.inputs?.years}y {entry.inputs?.months}m · {entry.inputs?.frequency}
              </div>
              <div className="history-meta">
                {new Date(entry.timestamp).toLocaleString('en-IN')}
              </div>
            </div>
            <div className="btn-group">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleReopen(entry)}>
                Reopen
              </button>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => handleDelete(entry.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
