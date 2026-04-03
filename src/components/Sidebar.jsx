import { useApp, ACTIONS } from '../context/AppContext';

// SVG Icons
const Icons = {
  dashboard: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9"/>
      <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.75"/>
    </svg>
  ),
  transactions: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 5h10M3 8h7M3 11h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M11 9l2 2 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 11V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  insights: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 12l4-4 3 2.5 4-5 3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="13" cy="4" r="1.5" fill="currentColor"/>
    </svg>
  ),
  sun: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="2.5" fill="currentColor"/>
      <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.93 2.93l1.06 1.06M10.01 10.01l1.06 1.06M2.93 11.07l1.06-1.06M10.01 3.99l1.06-1.06" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  moon: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M12 8.5A5.5 5.5 0 015.5 2a5.5 5.5 0 100 10A5.5 5.5 0 0012 8.5z" fill="currentColor" opacity="0.9"/>
    </svg>
  ),
  admin: (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M6.5 1l1.2 3.7H11L8.4 6.9l1 3.1-2.9-2-2.9 2 1-3.1L2 4.7h3.3L6.5 1z" fill="currentColor"/>
    </svg>
  ),
  viewer: (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <ellipse cx="6.5" cy="6.5" rx="5.5" ry="3.5" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="6.5" cy="6.5" r="1.8" fill="currentColor"/>
    </svg>
  ),
};

// ─── Logo SVG ─────────────────────────────────────────────────────────────────
function LogoMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Rising bars — ascending 3-bar chart mark */}
      <rect x="1"  y="12" width="4" height="7" rx="1.2" fill="white" opacity="0.6"/>
      <rect x="7"  y="7"  width="4" height="12" rx="1.2" fill="white" opacity="0.8"/>
      <rect x="13" y="2"  width="4" height="17" rx="1.2" fill="white"/>
      {/* Trend line over top */}
      <path d="M3 13 L9 8 L15 3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="1.5 1.5" opacity="0.5"/>
    </svg>
  );
}

const NAV_ITEMS = [
  { id: 'dashboard',    icon: Icons.dashboard,    label: 'Dashboard'   },
  { id: 'transactions', icon: Icons.transactions, label: 'Transactions' },
  { id: 'insights',     icon: Icons.insights,     label: 'Insights'    },
];

export default function Sidebar() {
  const { state, dispatch } = useApp();
  const { activeTab, role, darkMode, sidebarOpen } = state;

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => dispatch({ type: ACTIONS.CLOSE_SIDEBAR })}
      />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>

        {/* ── Logo ── */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <LogoMark />
          </div>
          <div>
            <div className="sidebar-logo-text">Lucra</div>
            <div className="sidebar-logo-sub">Finance Intelligence</div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-label">Menu</div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => dispatch({ type: ACTIONS.SET_ACTIVE_TAB, payload: item.id })}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* ── Bottom ── */}
        <div className="sidebar-bottom">
          <div style={{
            fontSize: 10.5,
            fontWeight: 700,
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}>
            Role
          </div>

          <select
            className="input"
            value={role}
            onChange={(e) => dispatch({ type: ACTIONS.SET_ROLE, payload: e.target.value })}
            style={{ fontSize: 13, padding: '8px 12px', cursor: 'pointer' }}
          >
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>

          <div
            className="role-badge"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: role === 'admin' ? 'var(--warning-dim)' : 'var(--accent-dim)',
              borderColor: role === 'admin' ? 'rgba(245,166,35,0.25)' : 'rgba(124,92,252,0.2)',
              color: role === 'admin' ? 'var(--warning)' : 'var(--accent)',
            }}
          >
            <span style={{ flexShrink: 0 }}>
              {role === 'admin' ? Icons.admin : Icons.viewer}
            </span>
            {role === 'admin' ? 'Can add, edit & delete' : 'Read-only access'}
          </div>

          {/* Dark / Light toggle */}
          <button
            className="btn btn-ghost"
            onClick={() => dispatch({ type: ACTIONS.TOGGLE_DARK_MODE })}
            style={{ width: '100%', marginTop: 8, justifyContent: 'center', fontSize: 12.5, gap: 7 }}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>
              {darkMode ? Icons.sun : Icons.moon}
            </span>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

      </aside>
    </>
  );
}
