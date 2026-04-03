import { createContext, useContext, useReducer, useEffect } from 'react';
import { INITIAL_TRANSACTIONS } from '../data/mockData';
import { generateId } from '../utils/helpers';

// ─── Initial State ────────────────────────────────────────────────────────────
const loadTransactions = () => {
  try {
    const saved = localStorage.getItem('vault_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  } catch {
    return INITIAL_TRANSACTIONS;
  }
};

const loadSettings = () => {
  try {
    const saved = localStorage.getItem('vault_settings');
    return saved ? JSON.parse(saved) : { darkMode: true, role: 'admin' };
  } catch {
    return { darkMode: true, role: 'admin' };
  }
};

const initialSettings = loadSettings();

const INITIAL_STATE = {
  transactions: loadTransactions(),
  role: initialSettings.role,
  darkMode: initialSettings.darkMode,
  activeTab: 'dashboard',
  sidebarOpen: false,
  filters: {
    search: '',
    category: 'all',
    type: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  },
};

// ─── Actions ──────────────────────────────────────────────────────────────────
export const ACTIONS = {
  SET_ROLE:            'SET_ROLE',
  TOGGLE_DARK_MODE:    'TOGGLE_DARK_MODE',
  SET_ACTIVE_TAB:      'SET_ACTIVE_TAB',
  TOGGLE_SIDEBAR:      'TOGGLE_SIDEBAR',
  CLOSE_SIDEBAR:       'CLOSE_SIDEBAR',
  ADD_TRANSACTION:     'ADD_TRANSACTION',
  EDIT_TRANSACTION:    'EDIT_TRANSACTION',
  DELETE_TRANSACTION:  'DELETE_TRANSACTION',
  RESET_TRANSACTIONS:  'RESET_TRANSACTIONS',
  SET_FILTER:          'SET_FILTER',
  RESET_FILTERS:       'RESET_FILTERS',
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_ROLE:
      return { ...state, role: action.payload };

    case ACTIONS.TOGGLE_DARK_MODE:
      return { ...state, darkMode: !state.darkMode };

    case ACTIONS.SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload, sidebarOpen: false };

    case ACTIONS.TOGGLE_SIDEBAR:
      return { ...state, sidebarOpen: !state.sidebarOpen };

    case ACTIONS.CLOSE_SIDEBAR:
      return { ...state, sidebarOpen: false };

    case ACTIONS.ADD_TRANSACTION:
      return {
        ...state,
        transactions: [
          ...state.transactions,
          { ...action.payload, id: generateId() },
        ],
      };

    case ACTIONS.EDIT_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case ACTIONS.DELETE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };

    case ACTIONS.RESET_TRANSACTIONS:
      return { ...state, transactions: INITIAL_TRANSACTIONS };

    case ACTIONS.SET_FILTER:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case ACTIONS.RESET_FILTERS:
      return {
        ...state,
        filters: INITIAL_STATE.filters,
      };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, INITIAL_STATE);

  // Persist transactions to localStorage
  useEffect(() => {
    localStorage.setItem('vault_transactions', JSON.stringify(state.transactions));
  }, [state.transactions]);

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem('vault_settings', JSON.stringify({
      darkMode: state.darkMode,
      role: state.role,
    }));
  }, [state.darkMode, state.role]);

  // Apply dark/light class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('light', !state.darkMode);
  }, [state.darkMode]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
