import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import FDCalculatorForm from './components/FDCalculatorForm';
import ChartsSection from './components/ChartsSection';
import ComparisonTool from './components/ComparisonTool';
import HistoryPanel from './components/HistoryPanel';
import LearnSection from './components/LearnSection';
import AboutSection from './components/AboutSection';
import { addToHistory } from './utils/historyStorage';
import { exportToCSV, exportToPDF } from './utils/exportUtils';
import { generateYearWiseTable } from './utils/fdCalculations';
import './styles/index.css';

export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('fd_theme') || 'light';
    } catch {
      return 'light';
    }
  });
  const [activeSection, setActiveSection] = useState('calculator');
  const [calcData, setCalcData] = useState(null);
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const [reloadValues, setReloadValues] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('fd_theme', theme);
    } catch { /* ignore */ }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const handleCalculate = useCallback((data) => {
    setCalcData(data);
    if (data && data.result) {
      addToHistory({
        inputs: data.inputs,
        result: data.result,
      });
      setHistoryRefresh((k) => k + 1);
    }
  }, []);

  const handleReloadFromHistory = (entry) => {
    setReloadValues(entry.inputs);
    setActiveSection('calculator');
    setTimeout(() => {
      setCalcData({
        inputs: entry.inputs,
        result: entry.result,
        growthSeries: null,
        yearWise: generateYearWiseTable(entry.inputs),
      });
    }, 50);
  };

  const handleExportCSV = () => {
    if (!calcData?.result) return;
    exportToCSV(calcData.result, calcData.inputs);
  };

  const handleExportPDF = async () => {
    if (!calcData?.result) return;
    const yearWise = calcData.yearWise || generateYearWiseTable(calcData.inputs);
    await exportToPDF(calcData.result, calcData.inputs, yearWise);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Header
        activeSection={activeSection}
        onNavigate={setActiveSection}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="app-container" style={{ paddingTop: '1.5rem' }}>
        {activeSection === 'calculator' && (
          <>
            <div className="mb-2">
              <h1>FD Calculator Dashboard</h1>
              <p className="text-muted">
                Calculate maturity value, interest earned and visualise growth using the standard compound-interest model.
              </p>
            </div>

            <SummaryCards result={calcData?.result} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              <FDCalculatorForm onCalculate={handleCalculate} initialValues={reloadValues} />
              <div>
                {calcData?.result && (
                  <div className="card mb-2">
                    <h3 className="card-title">Export & Share</h3>
                    <div className="btn-group">
                      <button type="button" className="btn btn-success btn-sm" onClick={handleExportPDF}>
                        Download PDF
                      </button>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
                        Export CSV
                      </button>
                      <button type="button" className="btn btn-outline btn-sm" onClick={handlePrint}>
                        Print
                      </button>
                    </div>
                  </div>
                )}
                <ChartsSection
                  result={calcData?.result}
                  growthSeries={calcData?.growthSeries}
                  yearWise={calcData?.yearWise}
                />
              </div>
            </div>
          </>
        )}

        {activeSection === 'comparison' && <ComparisonTool />}
        {activeSection === 'history' && (
          <HistoryPanel onReload={handleReloadFromHistory} refreshKey={historyRefresh} />
        )}
        {activeSection === 'learn' && <LearnSection />}
        {activeSection === 'about' && <AboutSection />}
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '1.5rem 1rem',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        borderTop: '1px solid var(--border)',
        marginTop: 'auto',
      }}>
        Advanced FD Calculator & Financial Growth Analysis System · Educational Project · {new Date().getFullYear()}
      </footer>
    </>
  );
}
