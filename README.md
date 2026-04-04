<div align="center">

<img src="https://img.shields.io/badge/version-1.0.0-7c5cfc?style=for-the-badge" />
<img src="https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/Groq-Llama_3.3_70B-F55036?style=for-the-badge" />
<img src="https://img.shields.io/badge/License-MIT-23d18b?style=for-the-badge" />

<br /><br />

<img width="60" src="https://img.shields.io/badge/💹-Lucra-7c5cfc?style=for-the-badge" />

# Lucra

### Finance Intelligence Dashboard

> *A modern, AI-powered personal finance dashboard — built with React, powered by Groq AI, and designed to feel like a real fintech product.*

<br />

[🔴 Live Demo](https://finance-dashboard-self-rho.vercel.app) &nbsp;·&nbsp; [📸 Screenshots](#-screenshots) &nbsp;·&nbsp; [⚡ Quick Start](#-quick-start) &nbsp;·&nbsp; [🤖 AI Setup](#-ai-assistant-setup) &nbsp;·&nbsp; [🏗️ Architecture](#️-architecture)

<br />

</div>

---

## 📋 Table of Contents

- [📸 Screenshots](#-screenshots)
- [✨ Features](#-features)
- [⚡ Quick Start](#-quick-start)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [🤖 AI Assistant Setup](#-ai-assistant-setup)
- [🏗️ Architecture](#️-architecture)
  - [Repository Structure](#repository-structure)
  - [State Management](#state-management)
- [🔐 Role-Based Access](#-role-based-access)
- [🌍 Environment Variables](#-environment-variables)
- [🚀 Deployment](#-deployment)
- [📌 Developer Notes](#-developer-notes)

---

## 📸 Screenshots

<div align="center">

<img width="1919" height="946" alt="Image" src="https://github.com/user-attachments/assets/bcb42e32-4964-4bb8-a855-10b9aed43a3a" />
<br />
<sub><b>📊 Dashboard Overview</b> — Animated stat cards, balance trend, spending breakdown donut chart</sub>

<br /><br />

<img width="1916" height="950" alt="Image" src="https://github.com/user-attachments/assets/d199094d-18e7-4289-8ba0-4c36b963089c" />
<br />
<sub><b>💳 Transactions</b> — Searchable, filterable, sortable table with role-based CRUD actions</sub>

<br /><br />

<img width="1908" height="947" alt="Image" src="https://github.com/user-attachments/assets/65e5b918-94a4-49c8-80ca-7ec556af8ab5" />
<br />
<sub><b>💡 Financial Insights</b> — KPI cards, monthly income vs expenses chart, category breakdown</sub>

</div>

---

## ✨ Features

### Core

| Feature | Details |
|---|---|
| 📊 **Dashboard** | 4 animated stat cards (Balance, Income, Expenses, Savings Rate) with count-up animation · Balance trend area chart · Spending breakdown donut · Monthly comparison bar chart |
| 💳 **Transactions** | Full table with search, category filter, type filter, multi-column sort · Add / Edit / Delete (Admin only) · Long descriptions truncate with ellipsis — action buttons always visible |
| 🔐 **Role-Based UI** | Admin → full CRUD · Viewer → read-only · Switch instantly from sidebar — no page reload required |
| 💡 **Insights** | Top spending category · Best saving month · Monthly averages · Category progress bars · 5 auto-generated financial observation cards |
| 📱 **Responsive** | Mobile-first layout · Sidebar collapses to a slide-in drawer · Grid adapts from 4-col → 2-col → 1-col |

### Enhancements

| Feature | Details |
|---|---|
| 🤖 **AI Assistant** | Floating chat widget (✦ bottom-right) · Groq + Llama 3.3 70B · Serializes live transaction data into every prompt · New transactions reflect immediately via `useRef` live pointer |
| 🔔 **Toast Notifications** | 4-type system (success · error · info · warning) · Spring-physics entry animation · Auto-dismiss 3s · Click to close |
| 🌙 **Dark / Light Mode** | Full theme swap via CSS custom properties · Single `html.light` class · Preference persists to localStorage |
| 💾 **Persistence** | Transactions + settings auto-saved to localStorage · Survives page refresh and browser restart |
| 📥 **CSV Export** | One-click download of all transactions as a formatted CSV file |

---

## ⚡ Quick Start

### Prerequisites

```
Node.js  ≥ 18.0.0
npm      ≥ 9.0.0
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/lucra-finance.git
cd lucra-finance

# 2. Install dependencies
npm install

# 3. (Optional) Set up AI Assistant — see section below
cp .env.example .env

# 4. Start the development server
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

```bash
npm run build      # Production build → /dist
npm run preview    # Preview production build locally
```

> ✅ The app runs fully without an API key — only the AI Assistant feature requires one.

---

## 🤖 AI Assistant Setup

The AI Assistant is powered by **Groq** — free, no credit card required, fastest Llama 3.3 70B inference available.

### Get Your Free Key

```
1. Visit   → https://console.groq.com
2. Sign up → Continue with Google
3. Go to   → API Keys → Create API Key
4. Copy    → starts with gsk_...
```

### Configure

```bash
# .env (already gitignored)
VITE_GROQ_API_KEY=gsk_your_key_here
```

Restart the dev server — Vite reads `.env` only at startup:

```bash
npm run dev
```

> 🔒 Your `.env` file is in `.gitignore` — the key is never pushed to GitHub or Vercel.

### How It Works

Every time you send a message, the app:
1. Reads `transactionsRef.current` — a `useRef` that always holds the **latest** transaction data (prevents stale closure bugs in async functions)
2. Builds a system prompt with your totals, top categories, recent transactions, and full JSON data
3. Sends the conversation + system prompt to Groq API
4. Streams the response back to the chat UI

**Try asking:**

```
"What's my highest spending category?"
"Give me 3 tips based on my spending habits"
"Which month had the best savings rate?"
"How much did I spend on food vs entertainment?"
```

---

## 🏗️ Architecture

**Stack:** React 18 · Vite 5 · Recharts 2.10 · Groq API · Vanilla CSS

> No Tailwind. No Redux. No component libraries. Every dependency is deliberate.

### Repository Structure

```
lucra-finance/
│
├── 📄 index.html                   # Entry point — Google Fonts loaded here
├── ⚙️  vite.config.js               # Vite configuration
├── 📦 package.json
├── 🔐 .env.example                 # API key template — safe to commit
├── 🚫 .gitignore
├── 📁 screenshots/                 # README screenshots
│
└── 📁 src/
    ├── 🚀 main.jsx                 # React root
    ├── 🏠 App.jsx                  # Layout shell — providers + tab routing
    │
    ├── 📁 context/
    │   ├── AppContext.jsx           # Global state — useReducer + 12 actions
    │   └── ToastContext.jsx         # Toast system — provider + animated UI
    │
    ├── 📁 components/
    │   ├── Sidebar.jsx              # SVG logo · nav · role switcher · theme toggle
    │   ├── Header.jsx               # Page title · date · CSV export
    │   ├── Dashboard.jsx            # Animated stat cards + 3 charts
    │   ├── Transactions.jsx         # Filter bar + sortable table
    │   ├── TransactionModal.jsx     # Add / Edit modal with validation
    │   ├── Insights.jsx             # KPIs · bar chart · progress bars · observations
    │   └── AIAssistant.jsx          # Floating chat widget — Groq API
    │
    ├── 📁 data/
    │   └── mockData.js              # 48 transactions · 8 categories · Nov 2025–Mar 2026
    │
    ├── 📁 utils/
    │   └── helpers.js               # formatCurrency · getMonthlyData · exportToCSV · generateId
    │
    └── 📁 styles/
        └── index.css                # Full design system — CSS vars · dark/light · animations
```

### State Management

All state lives in a single `AppContext` using `useReducer` — no external library needed.

```js
// Complete state shape
{
  transactions: Transaction[],        // ← persisted to localStorage
  role:         'admin' | 'viewer',   // ← persisted
  darkMode:     boolean,              // ← persisted
  activeTab:    string,
  sidebarOpen:  boolean,
  filters: {
    search, category, type, sortBy, sortOrder
  }
}
```

**Why `useReducer`?**
12 discrete action types across 6 state slices. A reducer keeps every transition in one place — explicit, traceable, easy to extend.

**12 actions:** `SET_ROLE` · `TOGGLE_DARK_MODE` · `SET_ACTIVE_TAB` · `TOGGLE_SIDEBAR` · `CLOSE_SIDEBAR` · `ADD_TRANSACTION` · `EDIT_TRANSACTION` · `DELETE_TRANSACTION` · `RESET_TRANSACTIONS` · `SET_FILTER` · `RESET_FILTERS`

---

## 🔐 Role-Based Access

Role switching is simulated on the frontend — no authentication backend required (as per assignment spec).

| Action | 👑 Admin | 👁️ Viewer |
|---|:---:|:---:|
| View dashboard, transactions, insights | ✅ | ✅ |
| Search and filter transactions | ✅ | ✅ |
| Export CSV | ✅ | ✅ |
| Add new transaction | ✅ | ❌ |
| Edit existing transaction | ✅ | ❌ |
| Delete transaction | ✅ | ❌ |

Switch roles from the **sidebar dropdown** — changes take effect instantly with no reload.

---

## 🌍 Environment Variables

| Variable | Required | Description |
|---|:---:|---|
| `VITE_GROQ_API_KEY` | ⚡ AI only | Free key from [console.groq.com](https://console.groq.com) |

```bash
# .env — never commit this file
VITE_GROQ_API_KEY=gsk_your_key_here
```

---

## 🚀 Deployment

Deployed on **Vercel** via GitHub integration — every `git push` to `main` triggers an automatic redeploy.

**Live:** [https://finance-dashboard-self-rho.vercel.app](https://finance-dashboard-self-rho.vercel.app)

**To enable AI on Vercel:**
```
Vercel Dashboard → Project → Settings → Environment Variables
→ Add: VITE_GROQ_API_KEY = gsk_your_key
→ Redeploy
```

---

## 📌 Developer Notes

| Decision | Reasoning |
|---|---|
| `useReducer` over `useState` | 12 action types — reducer keeps all transitions explicit and in one file |
| `useRef` for AI transactions | Prevents stale closure in async `sendMessage` — ref always points to latest state regardless of when the function runs |
| Groq over OpenAI | Free tier, no credit card, ~300ms response — zero friction for evaluators testing the feature |
| Vanilla CSS only | Hand-crafted CSS with custom properties demonstrates real CSS skills — no framework abstractions |
| Dark tooltips in light mode | Hardcoded `#1a1a26` background regardless of theme — the pattern used by Figma, Linear, and Notion |
| INR currency | `en-IN` locale (₹1,20,000 format) — relevant to Indian market context |
| Balance = all-time net | Total income minus total expenses — more meaningful with a 5-month dataset than a running figure |

---

<div align="center">

<br />

Made with ♥ using **React** · **Recharts** · **Groq AI** · **Hand-crafted CSS**

<br />

**Zorvyn — Frontend Developer Intern Assessment**

<br />

⭐ If this helped you, consider giving the repo a star

<br />

</div>
