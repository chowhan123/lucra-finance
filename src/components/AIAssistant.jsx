import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildSystemPrompt(transactions) {
  const income   = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance  = income - expenses;

  // Group by category
  const catMap = {};
  transactions.forEach(t => {
    if (t.type === 'expense') catMap[t.category] = (catMap[t.category] || 0) + t.amount;
  });
  const topCategories = Object.entries(catMap)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amt]) => `${cat}: ₹${amt.toLocaleString('en-IN')}`)
    .join(', ');

  // Recent 10 transactions summary
  const recent = transactions
    .slice(0, 10)
    .map(t => `${t.date} | ${t.type === 'income' ? '+' : '-'}₹${t.amount.toLocaleString('en-IN')} | ${t.category} | ${t.description}`)
    .join('\n');

  return `You are Vault AI, a sharp and concise personal finance assistant embedded in the Vault finance dashboard. You have access to the user's transaction data and answer questions about their finances.

FINANCIAL SUMMARY:
- Total Income: ₹${income.toLocaleString('en-IN')}
- Total Expenses: ₹${expenses.toLocaleString('en-IN')}
- Net Balance: ₹${balance.toLocaleString('en-IN')}
- Savings Rate: ${income > 0 ? ((balance / income) * 100).toFixed(1) : 0}%
- Top Spending Categories: ${topCategories}
- Total Transactions: ${transactions.length}

RECENT TRANSACTIONS (most recent 10):
${recent}

FULL TRANSACTION DATA (${transactions.length} total):
${JSON.stringify(transactions.map(t => ({ date: t.date, type: t.type, amount: t.amount, category: t.category, description: t.description })))}

RULES:
- Be concise and direct. Use bullet points for lists.
- Always format amounts in Indian Rupees (₹) with en-IN formatting.
- If asked for tips, give 2-3 specific, actionable insights based on the actual data.
- Never make up transactions not in the data.
- Keep responses under 150 words unless a detailed breakdown is explicitly requested.
- Use a confident, helpful tone — like a knowledgeable friend, not a corporate bot.`;
}

const SUGGESTED_PROMPTS = [
  "What's my highest spending category?",
  "Am I saving enough each month?",
  "Give me 3 tips based on my spending",
  "Which month had best savings?",
];

// ─── Message Bubble ───────────────────────────────────────────────────────────
function Bubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 12,
      animation: 'toastIn 0.25s ease',
    }}>
      {!isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'var(--accent-dim)',
          color: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, flexShrink: 0,
          marginRight: 8, marginTop: 2,
        }}>V</div>
      )}
      <div style={{
        maxWidth: '78%',
        padding: '9px 13px',
        borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
        background: isUser ? 'var(--accent)' : 'var(--surface)',
        color: isUser ? '#07091a' : 'var(--text-primary)',
        fontSize: 13,
        lineHeight: 1.55,
        fontWeight: isUser ? 600 : 400,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        boxShadow: isUser ? '0 2px 12px rgba(0,212,170,0.25)' : 'none',
      }}>
        {msg.content}
      </div>
    </div>
  );
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '12px 16px', alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--accent)',
          display: 'inline-block',
          animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

// ─── AI Assistant Panel ───────────────────────────────────────────────────────
export default function AIAssistant() {
  const { state } = useApp();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey! I'm Vault AI 👋 Ask me anything about your finances — spending patterns, savings tips, monthly comparisons, you name it.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // Always keep a ref to the latest transactions so sendMessage
  // never reads a stale closure — even if called mid async-await
  const transactionsRef = useRef(state.transactions);
  useEffect(() => {
    transactionsRef.current = state.transactions;
  }, [state.transactions]);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: userText };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setLoading(true);

    if (!import.meta.env.VITE_GROQ_API_KEY) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "⚠️ API key missing. Create a `.env` file in the project root with:\n\nVITE_GROQ_API_KEY=gsk_your-key-here\n\nGet a free key at console.groq.com — no credit card needed.",
      }]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 1000,
          messages: [
            { role: 'system', content: buildSystemPrompt(transactionsRef.current) },
            ...nextMessages.map(m => ({ role: m.role, content: m.content })),
          ],
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content
        || "Sorry, I couldn't process that. Try again?";

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Something went wrong: ${err.message}`,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* ── Floating Button ── */}
      <button
        onClick={() => setOpen(v => !v)}
        title="Vault AI Assistant"
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: open ? 'var(--surface)' : 'var(--accent)',
          border: open ? '1px solid var(--border)' : 'none',
          color: open ? 'var(--text-primary)' : '#07091a',
          fontSize: 22,
          cursor: 'pointer',
          boxShadow: '0 4px 24px rgba(0,212,170,0.35)',
          zIndex: 9000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
          transform: open ? 'rotate(45deg) scale(0.9)' : 'scale(1)',
        }}
      >
        {open ? '✕' : '✦'}
      </button>

      {/* ── Chat Panel ── */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: 92,
          right: 28,
          width: 360,
          maxWidth: 'calc(100vw - 56px)',
          height: 480,
          maxHeight: 'calc(100vh - 120px)',
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          borderRadius: 18,
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          zIndex: 8999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          backdropFilter: 'blur(20px)',
        }}>

          {/* Header */}
          <div style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexShrink: 0,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'var(--accent-dim)',
              color: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 800,
            }}>V</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Vault AI</div>
              <div style={{ fontSize: 11, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
                Live on your data
              </div>
            </div>
            <button
              onClick={() => setMessages([messages[0]])}
              style={{
                marginLeft: 'auto',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: 11,
                padding: '4px 8px',
                borderRadius: 6,
                transition: 'color 0.2s',
              }}
              title="Clear chat"
            >
              Clear
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '14px 14px 4px',
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--border) transparent',
          }}>
            {messages.map((msg, i) => <Bubble key={i} msg={msg} />)}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: 'var(--accent-dim)',
                  color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, flexShrink: 0, marginRight: 8,
                }}>V</div>
                <TypingDots />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested prompts (show only if 1 message = fresh chat) */}
          {messages.length === 1 && (
            <div style={{
              padding: '6px 12px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              borderTop: '1px solid var(--border)',
              flexShrink: 0,
            }}>
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    borderRadius: 20,
                    padding: '5px 10px',
                    fontSize: 11,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent)'; }}
                  onMouseOut={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-secondary)'; }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '10px 12px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: 8,
            flexShrink: 0,
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about your finances…"
              disabled={loading}
              style={{
                flex: 1,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '9px 13px',
                fontSize: 13,
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{
                width: 38, height: 38,
                borderRadius: 10,
                background: input.trim() && !loading ? 'var(--accent)' : 'var(--surface)',
                border: `1px solid ${input.trim() && !loading ? 'transparent' : 'var(--border)'}`,
                color: input.trim() && !loading ? '#07091a' : 'var(--text-muted)',
                cursor: input.trim() && !loading ? 'pointer' : 'default',
                fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
}