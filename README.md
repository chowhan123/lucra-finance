<div align="center">

# Lucra — Finance Intelligence Dashboard

**A modern, AI-powered personal finance dashboard built for the Zorvyn Frontend Developer Intern Assessment.**

[Features](#-features) · [Quick Start](#-quick-start) · [AI Setup](#-ai-assistant-setup) · [Architecture](#-architecture) · [Design](#-design-system) · [Tech Stack](#-tech-stack)

</div>

---

## Overview

Lucra is a fully interactive finance tracking dashboard that lets users visualize their financial activity, manage transactions, understand spending patterns, and get AI-powered insights — all in a clean, responsive interface with dark and light mode support.

The project covers every core requirement of the assignment plus several meaningful enhancements: an AI financial assistant (powered by Groq + Llama 3.3 70B), toast notifications, animated stat counters, CSV export, and full localStorage persistence.

---

## Features

### Core Requirements

| Feature | Implementation |
|---|---|
| **Dashboard Overview** | 4 animated summary cards (Balance, Income, Expenses, Savings Rate), Balance Trend area chart, Spending Breakdown donut chart, Monthly Income vs Expenses bar chart |
| **Transactions** | Full table with date, description, category, amount, type — real-time search, category filter, type filter, multi-column sort (date, amount, category) |
| **Role-Based UI** | Admin role can add, edit, and delete transactions. Viewer role is fully read-only. Switch roles via the sidebar dropdown — no page reload needed |
| **Insights** | Top spending category card, best saving month card, monthly averages, net savings bar chart, category breakdown with progress bars, 5 auto-generated observation cards |
| **State Management** | React Context + `useReducer` — all state (transactions, filters, role, theme, sidebar) in a single predictable store |
| **Responsiveness** | Fully responsive across all screen sizes. Sidebar collapses to a slide-in drawer on mobile. Grid layouts adapt from 4-column to 1-column |

### Optional Enhancements

| Enhancement | Details |
|---|---|
| **AI Financial Assistant** | Chat widget (✦ button, bottom-right) powered by Groq API (Llama 3.3 70B). Reads your actual transaction data on every message — adding a new transaction and asking the AI immediately reflects the updated data |
| **Dark / Light Mode** | Full theme system using CSS custom properties. Toggle from the sidebar. Preference persists across sessions |
| **LocalStorage Persistence** | Transactions and settings (theme, role) are saved automatically. Data survives page refreshes and browser restarts |
| **Toast Notifications** | Contextual feedback for every user action — transaction added, edited, deleted, CSV exported. Auto-dismiss after 3 seconds, click to dismiss early |
| **Animated Stat Counters** | Dashboard stat cards count up from zero on load using `requestAnimationFrame` with ease-out cubic easing. Re-animates when data changes |
| **CSV Export** | One-click export of all transactions as a properly formatted CSV file |
| **Empty State Handling** | Friendly empty states when filters return no results or all transactions are deleted |

---

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

```bash
# 1. Extract the project folder
cd lucra-finance

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

> The app works fully without an API key — only the AI Assistant feature requires one. All other features are available immediately after `npm install && npm run dev`.

---

## AI Assistant Setup

The AI Assistant uses the **Groq API** which is completely free — no credit card required.

### Step 1 — Get a free API key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up with Google or email (free)
3. Navigate to **API Keys** → **Create API Key**
4. Copy the key (starts with `gsk_...`)

### Step 2 — Create your `.env` file

In the project root folder, create a file named `.env`:

```bash
# Option A: Using the terminal
cp .env.example .env
```

Then open `.env` and replace the placeholder:

```env
VITE_GROQ_API_KEY=gsk_paste_your_actual_key_here
```

### Step 3 — Restart the dev server

```bash
# Stop the running server (Ctrl+C), then:
npm run dev
```

> **Important:** Vite only reads `.env` files on startup. You must restart the server after creating or editing `.env`.

### Using the AI Assistant

- Click the **✦** button in the bottom-right corner
- Use the suggested prompt chips for quick questions
- Or type any question about your finances
- The AI reads your full transaction history on every message — adding new transactions is reflected immediately
- Click **Clear** to reset the conversation
- Press **Enter** to send, **Shift+Enter** for a new line

**Example questions:**
- *"What's my highest spending category this month?"*
- *"Give me 3 tips based on my spending habits"*
- *"Compare my income vs expenses over the last 3 months"*
- *"Which month had the best savings rate?"*

> The `.env` file is listed in `.gitignore` and will never be committed to version control.

---

## Architecture

### Project Structure

```
lucra-finance/
├── index.html                   # HTML entry point, loads Google Fonts
├── vite.config.js               # Vite configuration
├── package.json
├── .env.example                 # API key template
├── .gitignore
└── src/
    ├── main.jsx                 # React root — mounts App into #root
    ├── App.jsx                  # Layout shell: providers + sidebar + header + tab routing
    ├── data/
    │   └── mockData.js          # 48 realistic transactions (Nov 2025–Mar 2026)
    │                            # + CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS
    ├── utils/
    │   └── helpers.js           # Pure utility functions:
    │                            #   formatCurrency, formatShort, formatDate
    │                            #   getMonthlyData, getBalanceTrend
    │                            #   getCategorySpending, getInsights
    │                            #   exportToCSV, generateId
    ├── context/
    │   ├── AppContext.jsx        # Global state: useReducer + localStorage sync
    │   └── ToastContext.jsx      # Toast notification system: provider + UI
    ├── components/
    │   ├── Sidebar.jsx           # Logo, navigation, role switcher, theme toggle
    │   ├── Header.jsx            # Page title, current date, CSV export button
    │   ├── Dashboard.jsx         # Animated stat cards + 3 Recharts visualizations
    │   ├── Transactions.jsx      # Filter bar + sortable transaction table
    │   ├── TransactionModal.jsx  # Add / Edit modal with form validation
    │   ├── Insights.jsx          # KPI cards, bar chart, progress bars, observations
    │   └── AIAssistant.jsx       # Floating chat widget — Groq API integration
    └── styles/
        └── index.css             # All styles: CSS custom properties, components,
                                  # dark/light themes, animations, responsive breakpoints
```

### State Management

All application state is managed in a single `AppContext` using React's `useReducer` hook:

```js
// State shape
{
  transactions: Transaction[],   // Full transaction list
  role: 'admin' | 'viewer',      // Active user role
  darkMode: boolean,             // Theme preference
  activeTab: string,             // Current page (dashboard | transactions | insights)
  sidebarOpen: boolean,          // Mobile sidebar visibility
  filters: {
    search: string,              // Description/category search query
    category: string,            // Category filter ('all' or specific)
    type: string,                // Type filter ('all' | 'income' | 'expense')
    sortBy: string,              // Sort field (date | amount | category)
    sortOrder: string,           // Sort direction (asc | desc)
  }
}
```

**Why `useReducer` over multiple `useState` calls?**

The state has 6+ interdependent fields with multiple discrete action types (12 actions total). A reducer makes every state transition explicit and traceable. It also makes it straightforward to add new actions in the future without hunting through multiple state setters.

**Persistence strategy:**

Two `useEffect` hooks sync state to `localStorage` — one for transactions, one for settings (theme + role). They fire only when their specific slice changes, avoiding unnecessary writes.

```js
useEffect(() => {
  localStorage.setItem('lucra_transactions', JSON.stringify(state.transactions));
}, [state.transactions]);
```

### Data Flow

```
User Action
    │
    ▼
Component (dispatch)
    │
    ▼
AppReducer (pure function — returns new state)
    │
    ▼
AppContext (new state distributed to all subscribers)
    │
    ├──▶ Components re-render with new data
    └──▶ useEffect persists to localStorage
```

---

## Design System

**Brand:** Lucra (from Latin *lucrum* — profit, gain)

### Color Palette

| Token | Dark Mode | Light Mode | Usage |
|---|---|---|---|
| `--bg-base` | `#09090d` | `#f0f0f7` | Page background |
| `--bg-card` | `#13131a` | `#ffffff` | Card surfaces |
| `--bg-surface` | `#1c1c25` | `#f0f0f7` | Table headers, inputs |
| `--accent` | `#7c5cfc` | `#6248e8` | Primary actions, active states |
| `--positive` | `#23d18b` | `#16a06a` | Income, positive values |
| `--negative` | `#f25c7e` | `#e02b57` | Expenses, negative values |
| `--warning` | `#f5a623` | `#c97e08` | Savings rate, warnings |

**Why violet instead of the typical teal/blue?** Teal is the single most overused color in finance dashboard templates. Violet (`#7c5cfc`) is distinctive, premium, and used by modern developer tools like Linear and Raycast — it signals intentional design thinking.

### Typography

| Font | Usage | Why |
|---|---|---|
| **Syne** | Headings, brand name, section titles | Geometric, distinctive, stands out in dashboards |
| **IBM Plex Mono** | All financial numbers, dates | Monospace ensures numbers align vertically in tables |
| **DM Sans** | Body text, labels, UI copy | Clean, highly readable at small sizes |

### CSS Architecture

All styling is hand-written CSS with zero external UI frameworks. The system uses:

- **CSS Custom Properties** for theming — a single class (`html.light`) swaps the entire theme
- **5-level surface system** — base → secondary → card → card-hover → surface — each element sits on the correct depth layer
- **White-on-dark borders** — `rgba(255,255,255,0.07)` instead of solid gray lines — the correct pattern for dark UIs
- **Inset top highlight** — `inset 0 1px 0 rgba(255,255,255,0.04)` on cards — a single line that makes cards appear three-dimensional
- **True frosted glass header** — `backdrop-filter: blur(20px) saturate(1.6)` at 82% opacity

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.2 | UI framework — functional components + hooks throughout |
| **Vite** | 5.0 | Build tool — instant HMR, fast cold starts |
| **Recharts** | 2.10 | Charts — AreaChart, BarChart, PieChart with custom tooltips |
| **Groq API** | — | AI inference — Llama 3.3 70B Versatile (free tier) |
| **Google Fonts** | — | Syne, IBM Plex Mono, DM Sans |

No CSS frameworks (Tailwind, MUI, Bootstrap). No state management libraries (Redux, Zustand). No routing libraries. Every dependency is justified — nothing was added without a clear reason.

---

## Mock Data

48 transactions spanning **November 2025 → March 2026** across 8 categories:

| Category | Type | Typical Amount |
|---|---|---|
| Salary | Income | ₹80,000–₹95,000 |
| Freelance | Income | ₹15,000–₹40,000 |
| Food | Expense | ₹200–₹2,500 |
| Transport | Expense | ₹150–₹3,000 |
| Shopping | Expense | ₹500–₹8,000 |
| Entertainment | Expense | ₹300–₹2,000 |
| Health | Expense | ₹500–₹5,000 |
| Utilities | Expense | ₹800–₹3,500 |

The data is realistic enough to make insights meaningful — the Insights page surfaces genuine patterns (e.g. Food consistently being the top expense category, savings rate varying month to month).

---

## Key Design Decisions & Assumptions

- **Currency:** Indian Rupees (INR), formatted with `en-IN` locale (`₹1,20,000` style)
- **Balance definition:** Cumulative net balance (all-time income minus all-time expenses), not a running bank balance
- **Insights computation:** Calculated across all available data, not limited to the current month — this gives more meaningful trends with the available dataset
- **Role switching:** Frontend-only simulation, no authentication — as specified in the assignment
- **AI context:** The full transaction dataset is serialized into the system prompt on every API call, ensuring the AI always has current data including any newly added transactions
- **Chart tooltips:** Hardcoded dark style (`#1a1a26` background) regardless of app theme — dark tooltips on light backgrounds is the correct UX pattern used by Figma, Linear, and Notion

---

## Testing the Features

### Role-Based Access
1. Sidebar → Role dropdown → switch to **Viewer**
2. Go to Transactions → Add Transaction button disappears, edit/delete icons hidden
3. Switch back to **Admin** → full access restored

### AI Assistant
1. Click **✦** button (bottom-right)
2. Try a suggested prompt or ask your own question
3. Add a new transaction via Transactions tab
4. Return to AI chat → ask about your data — the new transaction is reflected immediately

### Dark / Light Mode
1. Sidebar → **Light Mode** button
2. Every chart, tooltip, card, and text element should remain readable
3. Toggle back to Dark Mode — preference is saved automatically

### Persistence
1. Add a custom transaction
2. Close and reopen the browser tab
3. The transaction is still there (stored in localStorage)

---

## Development Notes

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Type check
npm run lint

# Production build
npm run build

# Preview production build
npm run preview
```

The project has no TypeScript — kept to plain JavaScript as the assignment focus is UI/UX and frontend architecture, not type safety.

---

<div align="center">

Built for the **Zorvyn Frontend Developer Intern Assessment**

</div>
