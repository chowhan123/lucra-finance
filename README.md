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

[🚀 Live Demo](https://lucra-finance.vercel.app) · [📸 Screenshots](#-screenshots) · [✨ Features](#-features) · [⚡ Quick Start](#-quick-start) · [🤖 AI Setup](#-ai-assistant-setup) · [🏗️ Architecture](#️-architecture)

<br />

</div>

---

## 📸 Screenshots

> **How to add your screenshots:**
> 1. Run the app locally with `npm run dev`
> 2. Take screenshots using your OS shortcut:
>    - **Windows:** `Win + Shift + S` → snip the window → save as PNG
>    - **Mac:** `Cmd + Shift + 4` → drag to select → saved to Desktop
> 3. Create a folder called `screenshots/` in the project root
> 4. Save your images as: `dashboard.png`, `transactions.png`, `insights.png`, `ai-chat.png`, `light-mode.png`
> 5. The images below will automatically show up on GitHub

<br />

<table>
  <tr>
    <td align="center" width="50%">
      <img src="screenshots/dashboard.png" alt="Dashboard Overview" width="100%" />
      <br /><b>📊 Dashboard Overview</b>
      <br /><sub>Animated stat cards, balance trend, spending breakdown</sub>
    </td>
    <td align="center" width="50%">
      <img src="screenshots/transactions.png" alt="Transactions" width="100%" />
      <br /><b>💳 Transactions</b>
      <br /><sub>Search, filter, sort, add/edit/delete with RBAC</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="screenshots/insights.png" alt="Insights" width="100%" />
      <br /><b>📈 Financial Insights</b>
      <br /><sub>KPI cards, category breakdown, observations</sub>
    </td>
    <td align="center" width="50%">
      <img src="screenshots/ai-chat.png" alt="AI Assistant" width="100%" />
      <br /><b>🤖 Vault AI Assistant</b>
      <br /><sub>Ask anything about your finances in natural language</sub>
    </td>
  </tr>
  <tr>
    <td align="center" colspan="2">
      <img src="screenshots/light-mode.png" alt="Light Mode" width="60%" />
      <br /><b>☀️ Light Mode</b>
      <br /><sub>Full theme support — persists across sessions</sub>
    </td>
  </tr>
</table>

<br />

---

## ✨ Features

### 🎯 Core Requirements — All Implemented

<table>
  <thead>
    <tr>
      <th>Feature</th>
      <th>What's Built</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>📊 Dashboard Overview</b></td>
      <td>4 animated summary cards (Balance, Income, Expenses, Savings Rate) · Balance Trend area chart · Spending Breakdown donut chart · Monthly Income vs Expenses bar chart</td>
      <td>✅</td>
    </tr>
    <tr>
      <td><b>💳 Transactions</b></td>
      <td>Full data table with date, description, category, amount, type · Real-time search · Category & type filters · Multi-column sort (date, amount, category A–Z)</td>
      <td>✅</td>
    </tr>
    <tr>
      <td><b>🔐 Role-Based UI</b></td>
      <td>Admin can add, edit, delete transactions · Viewer is fully read-only · Live role switcher in sidebar — no page reload</td>
      <td>✅</td>
    </tr>
    <tr>
      <td><b>💡 Insights</b></td>
      <td>Top spending category · Best saving month · Monthly averages KPI · Net savings bar chart · Category progress bars · 5 auto-generated observation cards</td>
      <td>✅</td>
    </tr>
    <tr>
      <td><b>🗂️ State Management</b></td>
      <td>React Context + <code>useReducer</code> — 12 action types, single predictable store for transactions, filters, role, theme, sidebar</td>
      <td>✅</td>
    </tr>
    <tr>
      <td><b>📱 Responsiveness</b></td>
      <td>4-col → 2-col → 1-col adaptive grid · Sidebar collapses to slide-in mobile drawer · Transaction table hides non-essential columns on small screens</td>
      <td>✅</td>
    </tr>
    <tr>
      <td><b>🚫 Empty States</b></td>
      <td>Friendly empty state UI when search/filters return no results or all transactions are deleted</td>
      <td>✅</td>
    </tr>
  </tbody>
</table>

<br />

### 🚀 Optional Enhancements — All Implemented

<table>
  <thead>
    <tr>
      <th>Enhancement</th>
      <th>Details</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>🤖 <b>AI Financial Assistant</b></td>
      <td>Floating chat widget (✦ button, bottom-right) powered by <b>Groq API + Llama 3.3 70B</b>. Serializes your full transaction history into every API call. Add a new transaction — ask the AI — it reflects the change immediately. Uses a <code>useRef</code> live pointer to prevent stale closure bugs</td>
    </tr>
    <tr>
      <td>🌙 <b>Dark / Light Mode</b></td>
      <td>Full theme system built on CSS custom properties. A single <code>html.light</code> class swap changes the entire UI. Preference persists to localStorage</td>
    </tr>
    <tr>
      <td>💾 <b>LocalStorage Persistence</b></td>
      <td>Transactions and settings (theme, role) auto-save. Data survives page refreshes and browser restarts. Uses separate keys: <code>lucra_transactions</code> and <code>lucra_settings</code></td>
    </tr>
    <tr>
      <td>🔔 <b>Toast Notifications</b></td>
      <td>4-type toast system (success, error, info, warning) with spring-physics enter animation, slide-out exit. Fires on every CRUD action and CSV export. Click to dismiss early, auto-dismiss after 3s</td>
    </tr>
    <tr>
      <td>🔢 <b>Animated Stat Counters</b></td>
      <td>All 4 dashboard cards count up from zero on load using <code>requestAnimationFrame</code> with ease-out cubic easing. Re-animates whenever transaction data changes</td>
    </tr>
    <tr>
      <td>📥 <b>CSV Export</b></td>
      <td>One-click export of all transactions as a properly formatted, comma-separated CSV file. Triggers a toast notification with the row count</td>
    </tr>
    <tr>
      <td>✂️ <b>Text Truncation</b></td>
      <td>Long transaction descriptions truncate cleanly with ellipsis — edit/delete buttons always visible. Full text shown on native hover tooltip via <code>title</code> attribute</td>
    </tr>
  </tbody>
</table>

<br />

---

## ⚡ Quick Start

### Prerequisites

```
Node.js  ≥ 18.0
npm      ≥ 9.0
```

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/lucra-finance.git
cd lucra-finance

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

> ✅ The app works immediately — only the AI Assistant requires an API key (see below). All other features are fully functional without any setup.

### Other Commands

```bash
npm run build      # Production build → /dist
npm run preview    # Preview production build locally
```

---

## 🤖 AI Assistant Setup

The AI Assistant is powered by **Groq** — completely free, no credit card required.

### Get Your Free API Key (2 minutes)

```
1. Visit    →  https://console.groq.com
2. Sign up  →  Continue with Google (fastest)
3. Navigate →  API Keys → Create API Key
4. Copy     →  key starts with gsk_...
```

### Configure the Project

```bash
# Step 1 — Copy the template
cp .env.example .env

# Step 2 — Open .env and paste your key
VITE_GROQ_API_KEY=gsk_paste_your_key_here

# Step 3 — Restart the dev server (required — Vite reads .env at startup)
npm run dev
```

> 🔒 The `.env` file is in `.gitignore` — your API key is never committed to GitHub

### How It Works

```
User sends message
        │
        ▼
transactionsRef.current  ←── Always the latest data (useRef live pointer)
        │
        ▼
buildSystemPrompt(transactions)
   ├── Total income, expenses, balance, savings rate
   ├── Top spending categories with amounts
   ├── Recent 10 transactions
   └── Full transaction JSON array
        │
        ▼
Groq API → Llama 3.3 70B Versatile
        │
        ▼
Response streamed back to chat UI
```

### Example Prompts

```
"What's my highest spending category?"
"Give me 3 tips based on my spending habits"
"Which month had the best savings rate?"
"How much did I spend on food last month?"
"Am I saving enough each month?"
"Compare my income vs expenses over the last 3 months"
```

### Deploying with AI Enabled (Vercel)

```
Vercel Dashboard
  → Your Project
    → Settings
      → Environment Variables
        → Add: VITE_GROQ_API_KEY = gsk_your_key
          → Redeploy
```

---

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
    │   └── mockData.js            # 48 realistic transactions (Nov 2025–Mar 2026)
    │                              # CATEGORIES · CATEGORY_COLORS · CATEGORY_ICONS
    │
    ├── 📁 utils/
    │   └── helpers.js             # Pure utility functions (no side effects)
    │                              # formatCurrency · formatShort · formatDate
    │                              # getMonthlyData · getBalanceTrend
    │                              # getCategorySpending · getInsights
    │                              # exportToCSV · generateId
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
        └── index.css               # Complete design system:
                                    # CSS custom properties · dark/light themes
                                    # All component styles · animations
                                    # Responsive breakpoints
```

### State Management Deep Dive

All application state lives in a single `AppContext` powered by `useReducer`:

```js
// Complete state shape
{
  transactions: Transaction[],     // Full transaction list (persisted)
  role:         'admin' | 'viewer', // Active user role (persisted)
  darkMode:     boolean,           // Theme preference (persisted)
  activeTab:    string,            // Current page
  sidebarOpen:  boolean,           // Mobile drawer state
  filters: {
    search:    string,             // Real-time search query
    category:  string,             // 'all' or specific category
    type:      string,             // 'all' | 'income' | 'expense'
    sortBy:    string,             // 'date' | 'amount' | 'category'
    sortOrder: string,             // 'asc' | 'desc'
  }
}
```

**12 action types handled by the reducer:**

```js
SET_ROLE            // Switch between admin and viewer
TOGGLE_DARK_MODE    // Flip theme
SET_ACTIVE_TAB      // Navigate between pages
TOGGLE_SIDEBAR      // Mobile drawer open
CLOSE_SIDEBAR       // Mobile drawer close
ADD_TRANSACTION     // Append new transaction with generated ID
EDIT_TRANSACTION    // Replace transaction by ID
DELETE_TRANSACTION  // Remove transaction by ID
RESET_TRANSACTIONS  // Restore original 48 mock transactions
SET_FILTER          // Partial filter update (patch)
RESET_FILTERS       // Restore all filters to defaults
```

**Why `useReducer` over `useState`?**

With 6 state slices and 12 action types, multiple `useState` calls would scatter logic across the component tree. A reducer centralizes every state transition in one pure function — explicit, predictable, and easy to trace during debugging.

### Data Flow

```
User Interaction
      │
      ▼
  dispatch(action)
      │
      ▼
  appReducer(state, action)  ──→  returns new state (pure, no side effects)
      │
      ▼
  AppContext.Provider         ──→  all subscribers re-render
      │
      ├──▶  Components receive new state via useApp()
      │
      └──▶  useEffect watchers
              ├── transactions changed  →  localStorage.setItem('lucra_transactions')
              └── darkMode/role changed →  localStorage.setItem('lucra_settings')
```

---

## 🎨 Design System

**Brand:** Lucra *(from Latin* lucrum *— profit, gain)*

### Color Palette

| Token | Dark | Light | Usage |
|---|---|---|---|
| `--bg-base` | `#09090d` | `#f0f0f7` | Page background |
| `--bg-card` | `#13131a` | `#ffffff` | Card surfaces |
| `--bg-surface` | `#1c1c25` | `#f0f0f7` | Table headers, inputs |
| `--accent` | `#7c5cfc` | `#6248e8` | Primary CTA, active nav, gradients |
| `--accent-light` | `#9b82fd` | `#7c63f0` | Gradient endpoint, hover states |
| `--positive` | `#23d18b` | `#16a06a` | Income values, success states |
| `--negative` | `#f25c7e` | `#e02b57` | Expense values, delete actions |
| `--warning` | `#f5a623` | `#c97e08` | Savings rate, caution states |
| `--border` | `rgba(255,255,255,0.07)` | `rgba(0,0,0,0.08)` | All borders |
| `--text-primary` | `#eeeef5` | `#111118` | Headings, important text |
| `--text-secondary` | `#8a8a9e` | `#52526a` | Labels, descriptions |
| `--text-muted` | `#44445a` | `#9090a8` | Hints, timestamps |

> **Why violet?** Teal (`#00d4aa`) is the single most overused accent in finance dashboard templates. Violet (`#7c5cfc`) is distinctive, premium, and signals intentional design thinking. Used by Linear, Raycast, and other modern dev tools.

### Typography

| Font | Usage | Why |
|---|---|---|
| **Syne** | Brand name, headings, section titles | Geometric, distinctive — stands out without being decorative |
| **IBM Plex Mono** | All financial numbers, dates, code | Monospace ensures numbers align vertically in tables and cards |
| **DM Sans** | Body text, labels, navigation, UI copy | Highly legible at 11–14px — the sweet spot for dashboard interfaces |

### CSS Architecture

Zero CSS frameworks. Zero UI component libraries. Every style is hand-written using:

- **5-level surface depth system** — `base → secondary → card → card-hover → surface`
  Each element sits at exactly the right visual depth instead of everything being the same flat color

- **White-on-dark borders** — `rgba(255,255,255,0.07)` instead of solid grays
  The standard technique used in Vercel, Supabase, PlanetScale dark UIs

- **Inset top highlight** — `inset 0 1px 0 rgba(255,255,255,0.04)` on every card
  A single CSS line that makes cards appear three-dimensional with minimal visual noise

- **True frosted glass header** — `backdrop-filter: blur(20px) saturate(1.6)` at 82% opacity
  Content scrolls beneath the header with a premium blur effect

- **Gradient primary buttons** — `linear-gradient(135deg, accent, accent-light)`
  Paired with a colored `box-shadow` glow — avoids the flat "AI-generated" button look

- **Dark tooltips always** — Recharts tooltips are hardcoded dark (`#1a1a26`)
  Regardless of light/dark mode — dark tooltips on light charts is the correct UX pattern
  used by Figma, Linear, and Notion

---

## 🧰 Tech Stack

| Technology | Version | Purpose | Why Chosen |
|---|---|---|---|
| **React** | 18.2 | UI framework | Component model, hooks, Context API |
| **Vite** | 5.0 | Build tooling | Instant HMR, fast cold starts, ESM-native |
| **Recharts** | 2.10 | Data visualization | Composable React charts, custom tooltip support |
| **Groq API** | — | AI inference | Free tier, fastest Llama 3.3 70B inference available |
| **Google Fonts** | — | Typography | Syne + IBM Plex Mono + DM Sans |
| **CSS Custom Properties** | — | Theming | Native browser support, no runtime overhead |

**Deliberately excluded:**
- ❌ Tailwind CSS — inline utility classes hurt readability in component files
- ❌ Redux / Zustand — `useReducer` + Context is sufficient for this scope
- ❌ React Router — tab-based navigation doesn't need URL routing
- ❌ Axios — native `fetch` is sufficient for two API endpoints

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

## 🚀 Deployment

### Live on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

```bash
# Option A — Vercel CLI
npm i -g vercel
vercel

# Option B — GitHub Integration (recommended)
# 1. Push to GitHub
# 2. Import repo at vercel.com/new
# 3. Add VITE_GROQ_API_KEY in Environment Variables
# 4. Click Deploy
```

> Every `git push` to `main` triggers an automatic redeploy on Vercel

---

## 📁 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_GROQ_API_KEY` | For AI feature only | Free key from [console.groq.com](https://console.groq.com) |

```bash
# .env (never commit this file)
VITE_GROQ_API_KEY=gsk_your_key_here
```

---

## 📜 License

Built for the **Zorvyn Frontend Developer Intern Assessment**.

---

<div align="center">

**Made with React, Recharts, Groq AI, and hand-crafted CSS**

<br />

⭐ If you found this useful, consider starring the repository

</div>
