import { useApp, ACTIONS } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { exportToCSV } from '../utils/helpers';

const TAB_TITLES = {
  dashboard:    'Dashboard Overview',
  transactions: 'Transactions',
  insights:     'Financial Insights',
};

export default function Header() {
  const { state, dispatch } = useApp();
  const { showToast } = useToast();
  const { activeTab, transactions } = state;

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const handleExport = () => {
    exportToCSV(transactions);
    showToast(`Exported ${transactions.length} transactions as CSV`, 'info');
  };

  return (
    <header className="header">
      {/* Left: Hamburger + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Hamburger (mobile) */}
        <button
          className="btn btn-ghost btn-icon hamburger-btn"
          onClick={() => dispatch({ type: ACTIONS.TOGGLE_SIDEBAR })}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>

        <div>
          <h1 className="header-title">{TAB_TITLES[activeTab]}</h1>
          <p className="header-date">{today}</p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="header-actions">
        <button
          className="btn btn-accent-ghost"
          onClick={handleExport}
          title="Export all transactions as CSV"
        >
          ↓ Export CSV
        </button>
      </div>
    </header>
  );
}
