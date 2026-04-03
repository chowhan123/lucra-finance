const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ─── Currency Formatters ──────────────────────────────────────────────────────
export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(amount);

export const formatShort = (amount) => {
  if (amount >= 10_00_000) return `₹${(amount / 10_00_000).toFixed(1)}Cr`;
  if (amount >= 1_00_000)  return `₹${(amount / 1_00_000).toFixed(1)}L`;
  if (amount >= 1_000)     return `₹${(amount / 1_000).toFixed(1)}K`;
  return `₹${amount}`;
};

// ─── Date Formatter ───────────────────────────────────────────────────────────
export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

// ─── Monthly Aggregation ──────────────────────────────────────────────────────
export const getMonthlyData = (transactions) => {
  const map = {};

  transactions.forEach((t) => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!map[key]) map[key] = { key, income: 0, expense: 0 };
    if (t.type === 'income') map[key].income += t.amount;
    else map[key].expense += t.amount;
  });

  return Object.values(map)
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((m) => {
      const [year, month] = m.key.split('-');
      return {
        ...m,
        net: m.income - m.expense,
        label: `${MONTH_LABELS[parseInt(month) - 1]} '${year.slice(2)}`,
      };
    });
};

// ─── Cumulative Balance Trend ─────────────────────────────────────────────────
export const getBalanceTrend = (monthlyData) => {
  let cumulative = 0;
  return monthlyData.map((m) => {
    cumulative += m.net;
    return { ...m, balance: cumulative };
  });
};

// ─── Category Spending (expenses only) ───────────────────────────────────────
export const getCategorySpending = (transactions) => {
  const map = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => { map[t.category] = (map[t.category] || 0) + t.amount; });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

// ─── Derived Insights ─────────────────────────────────────────────────────────
export const getInsights = (transactions, monthlyData, categorySpending) => {
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalIncome   = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);

  const topCategory = categorySpending[0] || null;
  const bestMonth   = monthlyData.reduce((best, m) => (!best || m.net > best.net ? m : best), null);
  const worstMonth  = monthlyData.reduce((worst, m) => (!worst || m.expense > worst.expense ? m : worst), null);

  const avgMonthlyIncome  = monthlyData.length ? monthlyData.reduce((s, m) => s + m.income, 0) / monthlyData.length : 0;
  const avgMonthlyExpense = monthlyData.length ? monthlyData.reduce((s, m) => s + m.expense, 0) / monthlyData.length : 0;

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  return { topCategory, bestMonth, worstMonth, avgMonthlyIncome, avgMonthlyExpense, savingsRate, totalIncome, totalExpenses };
};

// ─── CSV Export ───────────────────────────────────────────────────────────────
export const exportToCSV = (transactions) => {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount (INR)'];
  const rows = transactions.map((t) => [
    t.date,
    `"${t.description}"`,
    t.category,
    t.type,
    t.amount,
  ]);
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `vault_transactions_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

// ─── Generate Unique ID ───────────────────────────────────────────────────────
export const generateId = () => Date.now() + Math.floor(Math.random() * 1000);
