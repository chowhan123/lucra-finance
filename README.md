<div align="center">

<br />

<img src="https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/Recharts-2.10-FF6B6B?style=for-the-badge" />
<img src="https://img.shields.io/badge/Groq_AI-Llama_3.3_70B-F55036?style=for-the-badge" />
<img src="https://img.shields.io/badge/CSS-Custom_Properties-1572B6?style=for-the-badge&logo=css3&logoColor=white" />

<br /><br />

# 💹 Lucra — Finance Intelligence Dashboard

### *A modern, AI-powered personal finance dashboard with real-time insights, role-based access control, and a built-in financial AI assistant.*

<br />

[🚀 Live Demo](https://finance-dashboard-self-rho.vercel.app/) · [📸 Screenshots](#-screenshots) · [✨ Features](#-features) · [⚡ Quick Start](#-quick-start) · [🤖 AI Setup](#-ai-assistant-setup) · [🏗️ Architecture](#️-architecture)

<br />

</div>

---

## 📸 Screenshots

<div align="center">

<img width="1919" height="946" alt="Image" src="https://github.com/user-attachments/assets/bcb42e32-4964-4bb8-a855-10b9aed43a3a" />
<br /><br />
<b>📊 Dashboard Overview</b> — Animated stat cards, balance trend chart, spending breakdown
<br /><br /><br />

<img width="1916" height="950" alt="Image" src="https://github.com/user-attachments/assets/d199094d-18e7-4289-8ba0-4c36b963089c" />
<br /><br />
<b>💳 Transactions</b> — Search, filter, sort · Add / Edit / Delete (Admin only)
<br /><br /><br />

<img width="1908" height="947" alt="Image" src="https://github.com/user-attachments/assets/65e5b918-94a4-49c8-80ca-7ec556af8ab5" />
<br /><br />
<b>💡 Financial Insights</b> — Top category, best saving month, monthly income vs expenses

</div>

---

## ✨ Features

| | Feature | Description |
|---|---|---|
| 📊 | **Dashboard** | Animated stat cards (Balance, Income, Expenses, Savings Rate) · Balance trend area chart · Spending donut chart · Monthly bar chart |
| 💳 | **Transactions** | Searchable, filterable, sortable table · Add, edit, delete (Admin only) · Long descriptions truncate cleanly — action buttons always visible |
| 🔐 | **Role-Based UI** | Admin has full CRUD access · Viewer is read-only · Switch instantly from the sidebar — no reload |
| 💡 | **Insights** | Top spending category · Best saving month · Category progress bars · 5 auto-generated observation cards |
| 🤖 | **AI Assistant** | Chat widget powered by Groq + Llama 3.3 70B · Reads your live transaction data · Reflects new transactions immediately |
| 🔔 | **Toasts** | Success, error, info, warning notifications on every action · Auto-dismiss · Click to close |
| 🌙 | **Dark / Light Mode** | Full theme system via CSS custom properties · Persists across sessions |
| 💾 | **Persistence** | All transactions and settings saved to localStorage automatically |
| 📥 | **CSV Export** | One-click export of all transactions |
| 📱 | **Responsive** | Mobile-first · Sidebar collapses to drawer on small screens |

---

## ⚡ Quick Start

**Requires:** Node.js ≥ 18
 
```bash
# 1. Clone the repository
git clone https://github.com/YOUR_GITHUB_USERNAME/lucra-finance.git
cd lucra-finance
 
# 2. Install dependencies
npm install
 
# 3. Start the dev server
npm run dev
```
 
Open **[http://localhost:5173](http://localhost:5173)**
 
> ✅ Everything works immediately — only the AI Assistant needs an API key (free, 2-minute setup below).
 
---
 
## 🤖 AI Assistant Setup
 
**Free — no credit card required.**
 
**Step 1 — Get your API key**
 
Go to [console.groq.com](https://console.groq.com) → Sign up with Google → **API Keys → Create API Key**
 
**Step 2 — Configure**
 
```bash
cp .env.example .env
```
 
Open `.env` and add your key:
 
```env
VITE_GROQ_API_KEY=gsk_your_key_here
```
 
**Step 3 — Restart**
 
```bash
npm run dev
```
 
> 🔒 `.env` is gitignored — your key is never pushed to GitHub.


### Example Prompts

```
"What's my highest spending category?"
"Give me 3 tips based on my spending habits"
"Which month had the best savings rate?"
"How much did I spend on food last month?"
"Am I saving enough each month?"
"Compare my income vs expenses over the last 3 months"
```

## 🏗️ Architecture

### Project Structure

```
lucra-finance/
│
├── 📄 index.html                  # HTML entry point — loads Google Fonts
├── ⚙️  vite.config.js              # Vite config
├── 📦 package.json
├── 🔐 .env.example                # API key template (safe to commit)
├── 🚫 .gitignore                  # Excludes .env, node_modules, dist
│
└── 📁 src/
    │
    ├── 🚀 main.jsx                # React root — mounts <App /> into #root
    ├── 🏠 App.jsx                 # Layout shell: providers + sidebar + routing
    │
    ├── 📁 data/
    │   └── mockData.js            # 48 transactions across 8 categories (Nov 2025–Mar 2026)
    │
    ├── 📁 utils/
    │   └── helpers.js             # formatCurrency, getMonthlyData, exportToCSV, etc.
    │
    ├── 📁 context/
    │   ├── AppContext.jsx          # Global state — useReducer + localStorage sync
    │   └── ToastContext.jsx        # Toast provider + animated toast UI
    │
    ├── 📁 components/
    │   ├── Sidebar.jsx             # SVG logo, nav icons, role switcher, theme toggle
    │   ├── Header.jsx              # Page title, date, CSV export button
    │   ├── Dashboard.jsx           # Animated stat cards + 3 Recharts charts
    │   ├── Transactions.jsx        # Filter bar + sortable/searchable table
    │   ├── TransactionModal.jsx    # Add / Edit modal with form validation
    │   ├── Insights.jsx            # KPI cards · bar chart · progress bars · observations
    │   └── AIAssistant.jsx         # Floating chat widget — Groq API integration
    │
    └── 📁 styles/
        └── index.css               # Full design system — dark/light themes, animations
```

### State Management Deep Dive

All application state lives in a single `AppContext` powered by `useReducer`:

```js
 {
  transactions: Transaction[],       // persisted to localStorage
  role:         'admin' | 'viewer',  // persisted
  darkMode:     boolean,             // persisted
  activeTab:    string,
  sidebarOpen:  boolean,
  filters:      { search, category, type, sortBy, sortOrder }
}
```

## 🎨 Design System

**Brand:** Lucra *(from Latin* lucrum *— profit, gain)*

## 🧰 Tech Stack

| Technology | Version | Purpose | Why Chosen |
|---|---|---|---|
| **React** | 18.2 | UI framework | Component model, hooks, Context API |
| **Vite** | 5.0 | Build tooling | Instant HMR, fast cold starts, ESM-native |
| **Recharts** | 2.10 | Data visualization | Composable React charts, custom tooltip support |
| **Groq API** | — | AI inference | Free tier, fastest Llama 3.3 70B inference available |
| **Google Fonts** | — | Typography | Syne + IBM Plex Mono + DM Sans |
| **CSS Custom Properties** | — | Theming | Native browser support, no runtime overhead |

---

## 📊 Mock Data

**48 realistic transactions** spanning November 2025 → March 2026

| Category | Type | Range | Color |
|---|---|---|---|
| 💼 Salary | Income | ₹80,000–₹95,000/mo | `#7c5cfc` |
| 💻 Freelance | Income | ₹15,000–₹40,000 | `#a78bfa` |
| 🍽️ Food | Expense | ₹200–₹2,500 | `#f5a623` |
| 🚗 Transport | Expense | ₹150–₹3,000 | `#4a9eff` |
| 🛍️ Shopping | Expense | ₹500–₹8,000 | `#f472b6` |
| 🎬 Entertainment | Expense | ₹300–₹2,000 | `#c084fc` |
| ❤️ Health | Expense | ₹500–₹5,000 | `#23d18b` |
| ⚡ Utilities | Expense | ₹800–₹3,500 | `#22d3ee` |

The data is realistic enough that the Insights page surfaces genuine patterns — Food consistently ranks as the top expense category, savings rate varies meaningfully month to month, making the AI assistant responses actually useful.

---

## 🧪 Manual Testing Guide

### Role-Based Access Control

```
1. Sidebar → Role dropdown → switch to "Viewer"
2. Transactions tab → "Add Transaction" button disappears
3. All edit (✏️) and delete (🗑️) icons are hidden
4. Switch back to "Admin" → full access restored instantly
```

### AI Assistant (requires API key)

```
1. Click ✦ button (bottom-right corner)
2. Try a suggestion chip or type your own question
3. Add a new transaction via Transactions tab
4. Return to AI chat → ask about the new data
   → The response reflects your new transaction immediately
```

### Dark / Light Mode

```
1. Sidebar → "Light Mode" button
2. Check: all charts readable ✓ tooltips visible ✓ text contrast ✓
3. Hover chart bars/segments → tooltip always dark background, white text
4. Refresh page → theme preference is remembered
```

### LocalStorage Persistence

```
1. Add a custom transaction with a unique description
2. Close the browser tab completely
3. Reopen http://localhost:5173
4. Custom transaction is still there ✓
```

### Text Truncation

```
1. Add Transaction → enter a very long description (50+ chars)
2. Save → find the row in the table
3. Description truncates with "..." at the end ✓
4. Edit (✏️) and delete (🗑️) buttons still fully visible ✓
5. Hover the truncated text → full description shown in browser tooltip ✓
```

### CSV Export

```
1. Header → "↓ Export CSV" button
2. File downloads automatically
3. Toast notification: "Exported 48 transactions as CSV" ✓
4. Open the file in Excel/Sheets → all columns present ✓
```

---

## 🔑 Key Design Decisions

| Decision | Reasoning |
|---|---|
| **Currency: INR** | `en-IN` locale formatting (₹1,20,000 style) — relevant to Indian market context |
| **Balance = all-time net** | Total income minus total expenses, not a running bank balance — more meaningful with the dataset |
| **Insights across all data** | Computing trends across 5 months gives more useful patterns than restricting to current month |
| **useRef for AI transactions** | Prevents stale closure bug in async `sendMessage` — `transactionsRef.current` always points to latest state |
| **Dark tooltips in light mode** | Hardcoded dark tooltip background regardless of theme — this is the correct UX pattern (Figma, Linear, Notion all do this) |
| **No routing library** | Three tabs don't need URL routing — adds unnecessary complexity |
| **Groq over OpenAI** | Free tier, faster inference, no credit card — removes friction for evaluators testing the feature |

---

## 📜 License

Built for the **Zorvyn Frontend Developer Intern Assessment**.

---

<div align="center">

**Made with React, Recharts, Groq AI, and hand-crafted CSS**

<br />

⭐ If you found this useful, consider starring the repository

</div>
