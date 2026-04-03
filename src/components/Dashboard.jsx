import { useMemo, useEffect, useRef, useState } from 'react';

// Animated Counter Hook 
function useCountUp(target, duration = 1000, isPercent = false) {
  const [display, setDisplay] = useState('0');
  const rafRef  = useRef(null);
  const prevRef = useRef(target);

  useEffect(() => {
    const start     = prevRef.current;
    const end       = target;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = start + (end - start) * eased;

      if (isPercent) {
        setDisplay(`${current.toFixed(1)}%`);
      } else {
        // Format as short currency (L / K)
        const abs = Math.abs(current);
        if (abs >= 100000)      setDisplay(`₹${(current / 100000).toFixed(2)}L`);
        else if (abs >= 1000)   setDisplay(`₹${(current / 1000).toFixed(1)}K`);
        else                    setDisplay(`₹${current.toFixed(0)}`);
      }

      if (progress < 1) rafRef.current = requestAnimationFrame(step);
      else prevRef.current = end;
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, isPercent]);

  return display;
}
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { CATEGORY_COLORS } from '../data/mockData';
import {
  formatCurrency, formatShort,
  getMonthlyData, getBalanceTrend, getCategorySpending,
} from '../utils/helpers';

// Custom Recharts Tooltip 
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  // Pie charts don't have an axis label — the category name lives in payload[0].name
  const title = label || payload[0]?.name;

  return (
    <div style={{
      background: '#1a1a26',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 10,
      padding: '10px 14px',
      fontSize: 13,
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      minWidth: 140,
      pointerEvents: 'none',
    }}>
      {title && (
        <p style={{ color: '#eeeef5', fontWeight: 600, marginBottom: 6, fontSize: 12.5 }}>
          {title}
        </p>
      )}
      {payload.map((p, i) => (
        <div key={i} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          marginBottom: i < payload.length - 1 ? 4 : 0,
        }}>
          <span style={{
            width: 8, height: 8,
            borderRadius: 2,
            background: p.color || p.fill,
            display: 'inline-block',
            flexShrink: 0,
          }} />
          <span style={{ color: '#a0a0b8', fontSize: 12 }}>
            {label ? p.name : 'Amount'}:
          </span>
          <span style={{ color: '#eeeef5', fontWeight: 600, marginLeft: 'auto', paddingLeft: 10 }}>
            {formatCurrency(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, rawValue, isPercent, icon, iconBg, iconColor, valueColor, sub, delay }) {
  const animated = useCountUp(rawValue, 1100, isPercent);
  return (
    <div className={`stat-card card-hover anim-card-in anim-delay-${delay}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="stat-icon" style={{ background: iconBg, color: iconColor }}>
          {icon}
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>ALL TIME</span>
      </div>
      <div className="stat-value" style={{ color: valueColor }}>{animated}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-sub">{sub}</div>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h3 className="font-display" style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{title}</h3>
      {sub && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{sub}</p>}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { state } = useApp();
  const { transactions } = state;

  // Compute derived data
  const totalIncome   = useMemo(() => transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalExpenses = useMemo(() => transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalBalance  = totalIncome - totalExpenses;
  const savingsRate   = totalIncome > 0 ? ((totalBalance / totalIncome) * 100).toFixed(1) : '0.0';

  const monthlyData       = useMemo(() => getMonthlyData(transactions), [transactions]);
  const balanceTrend      = useMemo(() => getBalanceTrend(monthlyData), [monthlyData]);
  const categorySpending  = useMemo(() => getCategorySpending(transactions), [transactions]);

  // Pie chart colors
  const pieColors = categorySpending.map(c => CATEGORY_COLORS[c.name] || '#888');

  return (
    <div className="page-content anim-fade-in">

      {/* ── Summary Cards ── */}
      <div className="stats-grid" style={{ marginBottom: 22 }}>
        <StatCard
          delay={0}
          label="Total Balance"
          rawValue={Math.abs(totalBalance)}
          icon="◈"
          iconBg="var(--accent-dim)"
          iconColor="var(--accent)"
          valueColor="var(--accent)"
          sub={`${savingsRate}% overall savings rate`}
        />
        <StatCard
          delay={1}
          label="Total Income"
          rawValue={totalIncome}
          icon="↑"
          iconBg="var(--positive-dim)"
          iconColor="var(--positive)"
          valueColor="var(--positive)"
          sub={`${transactions.filter(t => t.type === 'income').length} transactions`}
        />
        <StatCard
          delay={2}
          label="Total Expenses"
          rawValue={totalExpenses}
          icon="↓"
          iconBg="var(--negative-dim)"
          iconColor="var(--negative)"
          valueColor="var(--negative)"
          sub={`${transactions.filter(t => t.type === 'expense').length} transactions`}
        />
        <StatCard
          delay={3}
          label="Savings Rate"
          rawValue={parseFloat(savingsRate)}
          isPercent={true}
          icon="%"
          iconBg="var(--warning-dim)"
          iconColor="var(--warning)"
          valueColor="var(--warning)"
          sub={`Tracked over ${monthlyData.length} months`}
        />
      </div>

      {/* ── Area Chart + Pie Chart ── */}
      <div className="charts-grid" style={{ marginBottom: 22 }}>

        {/* Balance Trend */}
        <div className="card card-pad">
          <SectionHeader title="Balance Trend" sub="Cumulative net balance over time" />
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={balanceTrend} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7c5cfc" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c5cfc" stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#23d18b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#23d18b" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => formatShort(v)} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={65} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="balance" stroke="#7c5cfc" strokeWidth={2.5} fill="url(#balGrad)" name="Balance" />
              <Area type="monotone" dataKey="income"  stroke="#23d18b" strokeWidth={1.8} fill="url(#incGrad)" name="Income" strokeDasharray="5 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Spending Breakdown */}
        <div className="card card-pad">
          <SectionHeader title="Spending Breakdown" sub="By category (expenses only)" />
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={categorySpending}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
              >
                {categorySpending.map((_, i) => (
                  <Cell key={i} fill={pieColors[i]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 14px', marginTop: 10 }}>
            {categorySpending.slice(0, 6).map((cat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-secondary)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: CATEGORY_COLORS[cat.name] || '#888', display: 'inline-block' }} />
                {cat.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Monthly Comparison Bar Chart ── */}
      <div className="card card-pad">
        <SectionHeader title="Monthly Comparison" sub="Income vs Expenses by month" />
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }} barGap={4} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => formatShort(v)} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={65} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="income"  name="Income"   fill="#23d18b" radius={[5, 5, 0, 0]} />
            <Bar dataKey="expense" name="Expenses" fill="#f25c7e" radius={[5, 5, 0, 0]} opacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
        {/* Custom Legend */}
        <div style={{ display: 'flex', gap: 20, marginTop: 10 }}>
          {[['#23d18b', 'Income'], ['#f25c7e', 'Expenses']].map(([color, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: 'inline-block' }} />
              {label}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
