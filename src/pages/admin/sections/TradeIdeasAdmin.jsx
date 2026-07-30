import { useEffect, useState } from 'react';
import { getTradeIdeas, addTradeIdea, updateTradeIdea } from '../../../lib/content';
import { isFirebaseConfigured } from '../../../lib/firebase';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'closed-profit', label: 'Closed — Profit' },
  { value: 'closed-loss', label: 'Closed — Loss' },
];

const EMPTY_FORM = { ticker: '', date: '', thesis: '', detail: '', status: 'active' };

export default function TradeIdeasAdmin() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    getTradeIdeas().then((result) => {
      setIdeas(result);
      setLoading(false);
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.ticker.trim() || !form.date || !form.thesis.trim()) return;

    const draft = { id: `local-${Date.now()}`, ...form, ticker: form.ticker.toUpperCase() };

    try {
      await addTradeIdea(draft);
      setStatus({ type: 'success', message: 'Trade idea saved to Firestore.' });
    } catch {
      setStatus({ type: 'demo', message: 'Firebase not connected — added locally for preview only.' });
    }

    setIdeas((prev) => [draft, ...prev]);
    setForm(EMPTY_FORM);
  }

  async function handleStatusChange(id, newStatus) {
    setIdeas((prev) => prev.map((idea) => (idea.id === id ? { ...idea, status: newStatus } : idea)));
    try {
      await updateTradeIdea(id, { status: newStatus });
    } catch {
      // demo mode — local update only
    }
  }

  return (
    <div>
      <h1 className="admin-section-title">Trade Ideas</h1>
      <p className="admin-section-subtitle">Publish a new trade or investment idea, or update the status of an existing one.</p>

      <div className="card admin-form-card">
        <form onSubmit={handleSubmit}>
          <div className="admin-form-row">
            <div className="field">
              <label htmlFor="ticker">Ticker</label>
              <input id="ticker" value={form.ticker} onChange={(e) => setForm({ ...form, ticker: e.target.value })} required />
            </div>
            <div className="field">
              <label htmlFor="date">Date</label>
              <input id="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="thesis">Thesis (short)</label>
            <input id="thesis" value={form.thesis} onChange={(e) => setForm({ ...form, thesis: e.target.value })} required />
          </div>
          <div className="field">
            <label htmlFor="detail">Detail</label>
            <textarea id="detail" value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          {status && (
            <p className={status.type === 'success' ? 'admin-success-note' : 'admin-demo-note'}>{status.message}</p>
          )}
          <button type="submit" className="btn">Save Trade Idea</button>
        </form>
      </div>

      <h2 className="admin-list-title section-label">Past Entries</h2>
      {loading ? (
        <div className="loading-state">Loading…</div>
      ) : (
        <div className="admin-entry-list">
          {ideas.map((idea) => (
            <div className="admin-entry-row" key={idea.id}>
              <div className="admin-entry-main">
                <span className="admin-entry-title">{idea.ticker} — {idea.thesis}</span>
                <span className="admin-entry-meta">{idea.date}</span>
              </div>
              <div className="admin-entry-actions">
                <select
                  className="admin-status-select"
                  value={idea.status}
                  onChange={(e) => handleStatusChange(idea.id, e.target.value)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isFirebaseConfigured && (
        <p className="text-tertiary" style={{ fontSize: 12.5, marginTop: 14 }}>
          Connect Firebase to persist trade ideas to Firestore.
        </p>
      )}
    </div>
  );
}
