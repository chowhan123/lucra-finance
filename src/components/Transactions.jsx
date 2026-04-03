import { useMemo, useState } from 'react';
import { useApp, ACTIONS } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from '../data/mockData';
import { formatCurrency, formatDate } from '../utils/helpers';
import TransactionModal from './TransactionModal';

// ─── Filter Bar ───────────────────────────────────────────────────────────────
function FilterBar({ filters, role, onFilter, onAdd }) {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>

      {/* Search */}
      <div className="input-with-icon" style={{ flex: '1 1 200px', minWidth: 180 }}>
        <span className="input-icon">🔍</span>
        <input
          type="text"
          className="input"
          placeholder="Search by description or category…"
          value={filters.search}
          onChange={(e) => onFilter({ search: e.target.value })}
        />
      </div>

      {/* Category filter */}
      <select
        className="input"
        value={filters.category}
        onChange={(e) => onFilter({ category: e.target.value })}
        style={{ flex: '0 1 160px', cursor: 'pointer' }}
      >
        <option value="all">All Categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
        ))}
      </select>

      {/* Type filter */}
      <select
        className="input"
        value={filters.type}
        onChange={(e) => onFilter({ type: e.target.value })}
        style={{ flex: '0 1 140px', cursor: 'pointer' }}
      >
        <option value="all">All Types</option>
        <option value="income">↑ Income</option>
        <option value="expense">↓ Expense</option>
      </select>

      {/* Sort */}
      <select
        className="input"
        value={`${filters.sortBy}-${filters.sortOrder}`}
        onChange={(e) => {
          const [by, order] = e.target.value.split('-');
          onFilter({ sortBy: by, sortOrder: order });
        }}
        style={{ flex: '0 1 180px', cursor: 'pointer' }}
      >
        <option value="date-desc">Date (Newest first)</option>
        <option value="date-asc">Date (Oldest first)</option>
        <option value="amount-desc">Amount (High → Low)</option>
        <option value="amount-asc">Amount (Low → High)</option>
        <option value="category-asc">Category (A → Z)</option>
      </select>

      {/* Add button (admin only) */}
      {role === 'admin' && (
        <button className="btn btn-primary" onClick={onAdd} style={{ flex: '0 0 auto' }}>
          + Add Transaction
        </button>
      )}
    </div>
  );
}

// ─── Transactions ─────────────────────────────────────────────────────────────
export default function Transactions() {
  const { state, dispatch } = useApp();
  const { transactions, filters, role } = state;
  const { showToast } = useToast();

  const [showModal, setShowModal]   = useState(false);
  const [editingTx, setEditingTx]   = useState(null);

  // Apply filters + sort
  const filtered = useMemo(() => {
    let result = [...transactions];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      );
    }
    if (filters.category !== 'all') result = result.filter((t) => t.category === filters.category);
    if (filters.type !== 'all')     result = result.filter((t) => t.type     === filters.type);

    result.sort((a, b) => {
      let cmp = 0;
      if (filters.sortBy === 'date')     cmp = new Date(a.date) - new Date(b.date);
      if (filters.sortBy === 'amount')   cmp = a.amount - b.amount;
      if (filters.sortBy === 'category') cmp = a.category.localeCompare(b.category);
      return filters.sortOrder === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [transactions, filters]);

  const openAdd  = () => { setEditingTx(null); setShowModal(true); };
  const openEdit = (tx) => { setEditingTx(tx); setShowModal(true); };

  const handleSave = (data) => {
    if (data.id) {
      dispatch({ type: ACTIONS.EDIT_TRANSACTION, payload: data });
      showToast('Transaction updated successfully', 'success');
    } else {
      dispatch({ type: ACTIONS.ADD_TRANSACTION, payload: data });
      showToast('Transaction added successfully', 'success');
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this transaction?')) {
      dispatch({ type: ACTIONS.DELETE_TRANSACTION, payload: id });
      showToast('Transaction deleted', 'error');
    }
  };

  const onFilter = (patch) => dispatch({ type: ACTIONS.SET_FILTER, payload: patch });

  return (
    <div className="page-content anim-fade-in">

      <FilterBar
        filters={filters}
        role={role}
        onFilter={onFilter}
        onAdd={openAdd}
      />

      {/* Result count */}
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>
        Showing{' '}
        <span className="font-mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
          {filtered.length}
        </span>{' '}
        of {transactions.length} transactions
        {filters.search || filters.category !== 'all' || filters.type !== 'all' ? (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => dispatch({ type: ACTIONS.RESET_FILTERS })}
            style={{ marginLeft: 8 }}
          >
            ✕ Clear filters
          </button>
        ) : null}
      </div>

      {/* Table */}
      <div className="tx-table">
        {/* Header */}
        <div className="tx-header">
          <span>Date</span>
          <span>Description</span>
          <span className="tx-col-category">Category</span>
          <span>Amount</span>
          <span className="tx-col-type">Type</span>
          {role === 'admin' && <span className="tx-col-actions" style={{ textAlign: 'right' }}>Actions</span>}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-title">No transactions found</div>
            <div className="empty-state-sub">Try adjusting your search or filters</div>
          </div>
        ) : (
          filtered.map((tx) => {
            const color     = CATEGORY_COLORS[tx.category] || '#888';
            const isIncome  = tx.type === 'income';
            return (
              <div key={tx.id} className="tx-row">
                {/* Date */}
                <span className="font-mono" style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                  {formatDate(tx.date)}
                </span>

                {/* Description */}
                <div className="tx-desc" style={{ minWidth: 0 }}>
                  <div
                    className="tx-desc-icon"
                    style={{ background: `${color}18`, flexShrink: 0 }}
                  >
                    {CATEGORY_ICONS[tx.category]}
                  </div>
                  <span style={{
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    minWidth: 0,
                  }}
                    title={tx.description}
                  >
                    {tx.description}
                  </span>
                </div>

                {/* Category badge */}
                <span className="tx-col-category">
                  <span
                    className="badge"
                    style={{ background: `${color}15`, color }}
                  >
                    {tx.category}
                  </span>
                </span>

                {/* Amount */}
                <span
                  className="font-mono"
                  style={{
                    fontWeight: 600,
                    fontSize: 13.5,
                    color: isIncome ? 'var(--positive)' : 'var(--negative)',
                  }}
                >
                  {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>

                {/* Type badge */}
                <span className="tx-col-type">
                  <span
                    className="badge"
                    style={{
                      background: isIncome ? 'var(--positive-dim)' : 'var(--negative-dim)',
                      color:      isIncome ? 'var(--positive)'     : 'var(--negative)',
                    }}
                  >
                    {isIncome ? '↑ Income' : '↓ Expense'}
                  </span>
                </span>

                {/* Actions (admin only) */}
                {role === 'admin' && (
                  <div className="tx-col-actions" style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <button
                      className="btn btn-accent-ghost btn-sm btn-icon"
                      onClick={() => openEdit(tx)}
                      title="Edit"
                    >
                      ✎
                    </button>
                    <button
                      className="btn btn-danger-ghost btn-sm btn-icon"
                      onClick={() => handleDelete(tx.id)}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <TransactionModal
          editing={editingTx}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}