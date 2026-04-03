import { useState, useEffect } from 'react';
import { CATEGORIES, CATEGORY_ICONS } from '../data/mockData';

const EMPTY_FORM = {
  date:        new Date().toISOString().split('T')[0],
  description: '',
  category:    'Food',
  amount:      '',
  type:        'expense',
};

export default function TransactionModal({ editing, onSave, onClose }) {
  const [form, setForm]       = useState(EMPTY_FORM);
  const [errors, setErrors]   = useState({});

  // Populate form when editing
  useEffect(() => {
    if (editing) {
      setForm({
        date:        editing.date,
        description: editing.description,
        category:    editing.category,
        amount:      String(editing.amount),
        type:        editing.type,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [editing]);

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.description.trim())        errs.description = 'Description is required';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      errs.amount = 'Enter a valid positive amount';
    if (!form.date)                       errs.date = 'Date is required';
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({
      ...(editing ? { id: editing.id } : {}),
      date:        form.date,
      description: form.description.trim(),
      category:    form.category,
      amount:      Number(form.amount),
      type:        form.type,
    });
  };

  // Close on backdrop click
  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div className="modal-overlay" onClick={handleBackdrop}>
      <div className="modal">

        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">{editing ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            aria-label="Close modal"
            style={{ fontSize: 16 }}
          >
            ✕
          </button>
        </div>

        {/* Type Toggle */}
        <div className="form-group">
          <label className="form-label">Type</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['income', 'expense'].map((t) => {
              const isActive = form.type === t;
              const color = t === 'income' ? 'var(--positive)' : 'var(--negative)';
              const bg    = t === 'income' ? 'var(--positive-dim)' : 'var(--negative-dim)';
              return (
                <button
                  key={t}
                  className="btn"
                  onClick={() => set('type', t)}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    background:   isActive ? bg : 'var(--bg-input)',
                    color:        isActive ? color : 'var(--text-muted)',
                    border:       `1.5px solid ${isActive ? color : 'var(--border)'}`,
                    fontWeight:   isActive ? 600 : 400,
                  }}
                >
                  {t === 'income' ? '↑ Income' : '↓ Expense'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Date + Category */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="input"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
              style={{ borderColor: errors.date ? 'var(--negative)' : undefined }}
            />
            {errors.date && <span style={{ fontSize: 12, color: 'var(--negative)', marginTop: 4, display: 'block' }}>{errors.date}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="input"
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            type="text"
            className="input"
            placeholder="e.g. Grocery Store, Monthly Salary…"
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            style={{ borderColor: errors.description ? 'var(--negative)' : undefined }}
          />
          {errors.description && <span style={{ fontSize: 12, color: 'var(--negative)', marginTop: 4, display: 'block' }}>{errors.description}</span>}
        </div>

        {/* Amount */}
        <div className="form-group">
          <label className="form-label">Amount (₹)</label>
          <input
            type="number"
            className="input"
            placeholder="0"
            min="1"
            value={form.amount}
            onChange={(e) => set('amount', e.target.value)}
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              borderColor: errors.amount ? 'var(--negative)' : undefined,
            }}
          />
          {errors.amount && <span style={{ fontSize: 12, color: 'var(--negative)', marginTop: 4, display: 'block' }}>{errors.amount}</span>}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          <button className="btn btn-ghost" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave} style={{ flex: 1, justifyContent: 'center' }}>
            {editing ? 'Save Changes' : '+ Add Transaction'}
          </button>
        </div>

      </div>
    </div>
  );
}
