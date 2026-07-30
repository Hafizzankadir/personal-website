import { useEffect, useState } from 'react';
import { getKnowledgeHub, addKnowledgeHubEntry } from '../../../lib/content';
import { isFirebaseConfigured } from '../../../lib/firebase';

const TAG_OPTIONS = ['Finance', 'Mindset', 'General Learning'];
const EMPTY_FORM = { title: '', summary: '', date: '', tags: [] };

export default function KnowledgeHubAdmin() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    getKnowledgeHub().then((result) => {
      setEntries(result);
      setLoading(false);
    });
  }, []);

  function toggleTag(tag) {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.date || form.tags.length === 0) return;

    const draft = { id: `local-${Date.now()}`, ...form };

    try {
      await addKnowledgeHubEntry(draft);
      setStatus({ type: 'success', message: 'Entry saved to Firestore.' });
    } catch {
      setStatus({ type: 'demo', message: 'Firebase not connected — added locally for preview only.' });
    }

    setEntries((prev) => [draft, ...prev]);
    setForm(EMPTY_FORM);
  }

  return (
    <div>
      <h1 className="admin-section-title">Knowledge Hub</h1>
      <p className="admin-section-subtitle">Log a new entry — book notes, podcast takeaways, or concepts being explored.</p>

      <div className="card admin-form-card">
        <form onSubmit={handleSubmit}>
          <div className="admin-form-row">
            <div className="field">
              <label htmlFor="kh-title">Title</label>
              <input id="kh-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="field">
              <label htmlFor="kh-date">Date</label>
              <input id="kh-date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="kh-summary">Summary</label>
            <textarea id="kh-summary" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
          </div>
          <div className="field">
            <label>Tags</label>
            <div className="checkbox-row">
              {TAG_OPTIONS.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  className={'checkbox-chip' + (form.tags.includes(tag) ? ' is-checked' : '')}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          {status && (
            <p className={status.type === 'success' ? 'admin-success-note' : 'admin-demo-note'}>{status.message}</p>
          )}
          <button type="submit" className="btn">Save Entry</button>
        </form>
      </div>

      <h2 className="admin-list-title section-label">Past Entries</h2>
      {loading ? (
        <div className="loading-state">Loading…</div>
      ) : (
        <div className="admin-entry-list">
          {entries.map((entry) => (
            <div className="admin-entry-row" key={entry.id}>
              <div className="admin-entry-main">
                <span className="admin-entry-title">{entry.title}</span>
                <span className="admin-entry-meta">{entry.date} · {entry.tags.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isFirebaseConfigured && (
        <p className="text-tertiary" style={{ fontSize: 12.5, marginTop: 14 }}>
          Connect Firebase to persist knowledge hub entries to Firestore.
        </p>
      )}
    </div>
  );
}
