import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { formatINR } from '../utils/fdCalculations';

const COLORS = ['#1e40af', '#059669'];

export default function ChartsSection({ result, growthSeries, yearWise }) {
  if (!result) {
    return (
      <div className="empty-state">
        <p>Enter values and click Calculate to see charts and growth breakdown.</p>
      </div>
    );
  }

  const pieData = [
    { name: 'Principal', value: result.principal },
    { name: 'Interest', value: result.interestEarned },
  ];

  const lineData = (growthSeries || []).map((d) => ({
    name: d.yearLabel,
    total: d.total,
    principal: d.principal,
    interest: d.interest,
  }));

  return (
    <div>
      <div className="charts-grid">
        <div className="card chart-card">
          <h3 className="card-title">Principal vs Interest</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatINR(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chart-card">
          <h3 className="card-title">Growth Over Time</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} label={{ value: 'Years', position: 'insideBottom', offset: -2 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => formatINR(v)} labelFormatter={(l) => `Year ${l}`} />
                <Legend />
                <Line type="monotone" dataKey="total" name="Maturity Value" stroke="#7c3aed" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="principal" name="Principal" stroke="#1e40af" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {yearWise && yearWise.length > 0 && (
        <div className="card mt-2">
          <h3 className="card-title">Year-wise Growth Table</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Years Elapsed</th>
                  <th>Opening Balance</th>
                  <th>Interest (Period)</th>
                  <th>Closing Balance</th>
                  <th>Cumulative Interest</th>
                </tr>
              </thead>
              <tbody>
                {yearWise.map((row) => (
                  <tr key={row.year}>
                    <td>{row.year}</td>
                    <td>{row.yearsElapsed}</td>
                    <td>{formatINR(row.openingBalance)}</td>
                    <td className="text-success">{formatINR(row.interestForPeriod)}</td>
                    <td><strong>{formatINR(row.closingBalance)}</strong></td>
                    <td>{formatINR(row.cumulativeInterest)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card mt-2">
        <h3 className="card-title">Calculation Breakdown</h3>
        <div className="formula-box">{result.formula}</div>
        <p className="text-muted" style={{ fontSize: '0.85rem' }}>
          Effective Annual Yield (EAY) = {(result.effectiveAnnualYield).toFixed(4)}%. 
          This is the equivalent annual rate accounting for compounding frequency.
        </p>
      </div>
    </div>
  );
}
