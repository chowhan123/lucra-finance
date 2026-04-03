import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    // start exit animation
    setToasts((prev) => prev.map((t) => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 350);
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, type, exiting: false }]);
    timers.current[id] = setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const ICONS = {
  success: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 8.5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2L14.5 13H1.5L8 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 6v3.5M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

const TYPE_STYLES = {
  success: { color: '#00d4aa', bg: 'rgba(0, 212, 170, 0.12)', border: 'rgba(0, 212, 170, 0.25)' },
  error:   { color: '#f43f5e', bg: 'rgba(244,  63, 94, 0.12)', border: 'rgba(244,  63, 94, 0.25)' },
  info:    { color: '#60a5fa', bg: 'rgba( 96, 165, 250, 0.12)', border: 'rgba( 96, 165, 250, 0.25)' },
  warning: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.25)' },
};

// ─── Toast Container ──────────────────────────────────────────────────────────
function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div style={{
      position: 'fixed',
      bottom: 28,
      right: 28,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      pointerEvents: 'none',
    }}>
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  const s = TYPE_STYLES[toast.type] || TYPE_STYLES.success;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '11px 16px',
        background: 'var(--card-bg)',
        border: `1px solid ${s.border}`,
        borderLeft: `3px solid ${s.color}`,
        borderRadius: 10,
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        minWidth: 240,
        maxWidth: 340,
        pointerEvents: 'all',
        cursor: 'pointer',
        color: s.color,
        animation: toast.exiting
          ? 'toastOut 0.35s ease forwards'
          : 'toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
        backdropFilter: 'blur(12px)',
      }}
      onClick={() => onDismiss(toast.id)}
    >
      <span style={{ flexShrink: 0 }}>{ICONS[toast.type]}</span>
      <span style={{
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--text-primary)',
        lineHeight: 1.4,
        flex: 1,
      }}>
        {toast.message}
      </span>
      <span style={{ fontSize: 16, opacity: 0.4, flexShrink: 0, color: 'var(--text-muted)' }}>×</span>
    </div>
  );
}
