import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../data/mockData';
import {
  formatCurrency, formatShort,
  getMonthlyData, getCategorySpending, getInsights,
} from '../utils/helpers';

// ─── Chart Tooltip ────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1a1a26',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 10,
      padding: '10px 14px',
      fontSize: 13,
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      minWidth: 150,
      pointerEvents: 'none',
    }}>
      {label && (
        <p style={{ color: '#eeeef5', fontWeight: 600, marginBottom: 6, fontSize: 12.5 }}>{label}</p>
      )}
      {payload.map((p, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 7,
          marginBottom: i < payload.length - 1 ? 4 : 0,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color || p.fill, display: 'inline-block', flexShrink: 0 }} />
          <span style={{ color: '#a0a0b8', fontSize: 12 }}>{p.name}:</span>
          <span style={{ color: '#eeeef5', fontWeight: 600, marginLeft: 'auto', paddingLeft: 10 }}>
            {formatCurrency(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Insight KPI Card ─────────────────────────────────────────────────────────
function KpiCard({ title, children }) {
  return (
    <div className="card card-pad card-hover" style={{ opacity: 0, animation: 'cardIn 0.4s ease forwards' }}>
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--text-muted)',
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        marginBottom: 14,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

// ─── Insights ──────────────────────────────────────────────────────────────────
export default function Insights() {
  const { state } = useApp();
  const { transactions } = state;

  const monthlyData      = useMemo(() => getMonthlyData(transactions), [transactions]);
  const categorySpending = useMemo(() => getCategorySpending(transactions), [transactions]);
  const insights         = useMemo(
    () => getInsights(transactions, monthlyData, categorySpending),
    [transactions, monthlyData, categorySpending]
  );

  const {
    topCategory, bestMonth, worstMonth,
    avgMonthlyIncome, avgMonthlyExpense,
    savingsRate, totalExpenses,
  } = insights;

  return (
    <div className="page-content anim-fade-in">

      {/* ── KPI Cards ── */}
      <div className="insights-grid" style={{ marginBottom: 22 }}>

        {/* Top Spending Category */}
        <KpiCard title="Top Spending Category">
          {topCategory ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 14,
                  background: `${CATEGORY_COLORS[topCategory.name]}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                }}>
                  {CATEGORY_ICONS[topCategory.name]}
                </div>
                <div>
                  <div className="font-display" style={{ fontWeight: 700, fontSize: 17, color: 'var(--text-primary)' }}>
                    {topCategory.name}
                  </div>
                  <div className="font-mono" style={{ fontSize: 20, fontWeight: 600, color: CATEGORY_COLORS[topCategory.name] }}>
                    {formatShort(topCategory.value)}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                {((topCategory.value / totalExpenses) * 100).toFixed(1)}% of total expenses
              </div>
            </>
          ) : (
            <div style={{ color: 'var(--text-muted)' }}>No data available</div>
          )}
        </KpiCard>

        {/* Best Saving Month */}
        <KpiCard title="Best Saving Month">
          {bestMonth ? (
            <>
              <div className="font-display" style={{ fontWeight: 700, fontSize: 22, color: 'var(--text-primary)', marginBottom: 6 }}>
                {bestMonth.label}
              </div>
              <div className="font-mono" style={{ fontSize: 24, fontWeight: 600, color: 'var(--positive)', marginBottom: 8 }}>
                +{formatShort(bestMonth.net)}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Net savings for the month</div>
            </>
          ) : <div style={{ color: 'var(--text-muted)' }}>No data</div>}
        </KpiCard>

        {/* Monthly Averages */}
        <KpiCard title="Monthly Averages">
          {[
            { label: 'Avg Income',   value: avgMonthlyIncome,               color: 'var(--positive)' },
            { label: 'Avg Expenses', value: avgMonthlyExpense,              color: 'var(--negative)' },
            { label: 'Avg Savings',  value: avgMonthlyIncome - avgMonthlyExpense, color: 'var(--accent)' },
          ].map(({ label, value, color }, i) => (
            <div key={i}>
              {i > 0 && <div className="divider" />}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
                <span className="font-mono" style={{ fontSize: 14, fontWeight: 600, color }}>
                  {formatShort(value)}
                </span>
              </div>
            </div>
          ))}
        </KpiCard>

      </div>

      {/* ── Monthly Income vs Expenses vs Net ── */}
      <div className="card card-pad" style={{ marginBottom: 22 }}>
        <div style={{ marginBottom: 18 }}>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
            Monthly Income vs Expenses
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
            Detailed month-by-month comparison
          </p>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }} barGap={4} barCategoryGap="28%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => formatShort(v)} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={65} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="income"  name="Income"      fill="#23d18b" radius={[5, 5, 0, 0]} />
            <Bar dataKey="expense" name="Expenses"    fill="#f25c7e" radius={[5, 5, 0, 0]} opacity={0.85} />
            <Bar dataKey="net"     name="Net Savings" fill="#7c5cfc" radius={[5, 5, 0, 0]} opacity={0.75} />
          </BarChart>
        </ResponsiveContainer>
        {/* Legend */}
        <div style={{ display: 'flex', gap: 20, marginTop: 10 }}>
          {[
            ['#23d18b', 'Income'],
            ['#f25c7e', 'Expenses'],
            ['#7c5cfc', 'Net Savings'],
          ].map(([color, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: 'inline-block' }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Category Breakdown ── */}
      <div className="card card-pad" style={{ marginBottom: 22 }}>
        <h3 className="font-display" style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 18 }}>
          Category Breakdown
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {categorySpending.map((cat, i) => {
            const pct   = totalExpenses > 0 ? (cat.value / totalExpenses) * 100 : 0;
            const color = CATEGORY_COLORS[cat.name] || 'var(--accent)';
            return (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{CATEGORY_ICONS[cat.name]}</span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{cat.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pct.toFixed(1)}%</span>
                    <span className="font-mono" style={{ fontSize: 13.5, fontWeight: 600, color }}>{formatCurrency(cat.value)}</span>
                  </div>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Key Observations ── */}
      <div>
        <h3 className="font-display" style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 14 }}>
          Key Observations
        </h3>
        <div className="obs-grid">
          {[
            {
              icon: '📊',
              title: 'Spending Pattern',
              body: topCategory
                ? `${topCategory.name} is your top expense category at ${((topCategory.value / totalExpenses) * 100).toFixed(0)}% of total spending (${formatShort(topCategory.value)}). Review this area for potential savings.`
                : 'No spending data available yet.',
              color: 'var(--warning)',
              bg:   'var(--warning-dim)',
              border: 'rgba(245,158,11,0.2)',
            },
            {
              icon: '💰',
              title: 'Savings Health',
              body: `You save ${savingsRate.toFixed(1)}% of your income overall. ${
                savingsRate >= 20
                  ? '🎉 Great — you exceed the recommended 20% savings benchmark!'
                  : `⚠️ Aim to save at least 20% of income. You're currently ${(20 - savingsRate).toFixed(1)}% below target.`
              }`,
              color: savingsRate >= 20 ? 'var(--positive)' : 'var(--negative)',
              bg:    savingsRate >= 20 ? 'var(--positive-dim)' : 'var(--negative-dim)',
              border: savingsRate >= 20 ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)',
            },
            {
              icon: '📅',
              title: 'Best Month',
              body: bestMonth
                ? `${bestMonth.label} was your strongest month with net savings of ${formatShort(bestMonth.net)} (income ${formatShort(bestMonth.income)}, expenses ${formatShort(bestMonth.expense)}). Use it as your benchmark.`
                : 'Not enough data to determine best month.',
              color: 'var(--accent)',
              bg:   'var(--accent-dim)',
              border: 'rgba(0,212,170,0.2)',
            },
            ...(worstMonth ? [{
              icon: '⚠️',
              title: 'Highest Expense Month',
              body: `${worstMonth.label} had the highest expenses at ${formatShort(worstMonth.expense)}. Identifying one-off costs in this period can help you plan better next time.`,
              color: 'var(--negative)',
              bg:   'var(--negative-dim)',
              border: 'rgba(244,63,94,0.2)',
            }] : []),
            {
              icon: '📈',
              title: 'Income vs Expense Ratio',
              body: `On average you earn ${formatShort(avgMonthlyIncome)} and spend ${formatShort(avgMonthlyExpense)} per month. That leaves a monthly average of ${formatShort(avgMonthlyIncome - avgMonthlyExpense)} to save or invest.`,
              color: 'var(--accent)',
              bg:   'var(--accent-dim)',
              border: 'rgba(0,212,170,0.2)',
            },
          ].map((obs, i) => (
            <div
              key={i}
              className="card card-pad card-hover"
              style={{ background: obs.bg, borderColor: obs.border }}
            >
              <div style={{ fontSize: 24, marginBottom: 10 }}>{obs.icon}</div>
              <div className="font-display" style={{ fontWeight: 700, fontSize: 14, color: obs.color, marginBottom: 7 }}>
                {obs.title}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                {obs.body}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
