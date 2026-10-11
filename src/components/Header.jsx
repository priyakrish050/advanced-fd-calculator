import React from 'react';

const NAV_ITEMS = [
  { id: 'calculator', label: 'Calculator' },
  { id: 'comparison', label: 'Compare FDs' },
  { id: 'history', label: 'History' },
  { id: 'learn', label: 'Learn' },
  { id: 'about', label: 'About' },
];

export default function Header({ activeSection, onNavigate, theme, onToggleTheme }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="logo">
          <div className="logo-icon" aria-hidden="true">FD</div>
          <div>
            <div>Advanced FD Calculator</div>
            <div style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--text-muted)' }}>
              Financial Growth Analysis System
            </div>
          </div>
        </div>

        <nav className="nav-menu" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-btn ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
              aria-current={activeSection === item.id ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
}
