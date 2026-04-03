import { AppProvider, useApp, ACTIONS } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Insights from './components/Insights';
import AIAssistant from './components/AIAssistant';
import './styles/index.css';

// ─── Hamburger visibility via JS (mobile) ─────────────────────────────────────
// The hamburger button is always rendered but shown/hidden via CSS media query in index.css
// We also wire it up here.

function AppContent() {
  const { state } = useApp();
  const { activeTab } = state;

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':    return <Dashboard />;
      case 'transactions': return <Transactions />;
      case 'insights':     return <Insights />;
      default:             return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main style={{ flex: 1 }}>
          {renderPage()}
        </main>
      </div>
      <AIAssistant />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AppProvider>
  );
}
