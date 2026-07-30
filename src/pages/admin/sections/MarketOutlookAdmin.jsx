import { useEffect, useState } from 'react';
import { getAllMarketOutlookEntries, publishMarketOutlook } from '../../../lib/content';
import { isFirebaseConfigured } from '../../../lib/firebase';

const PERIODS = ['weekly', 'monthly', 'quarterly', 'yearly'];

export default function MarketOutlookAdmin() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('weekly');
  const [narrative, setNarrative] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    getAllMarketOutlookEntries().then((result) => {
      setEntries(result);
      setLoading(false);
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!narrative.trim()) return;

    const draft = {
      id: `local-${Date.now()}`,
      period,
      narrative,
      sectors: [],
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    try {
      await publishMarketOutlook(draft);
      setStatus({ type: 'success', message: 'Published to Firestore.' });
    } catch {
      setStatus({ type: 'demo', message: 'Firebase not connected — entry added locally for preview only.' });
    }

    setEntries((prev) => [draft, ...prev.filter((e2) => e2.period !== period)]);
    setNarrative('');
  }

  return (
    <div>
      <h1 className="admin-section-title">Market Outlook</h1>
      <p className="admin-section-subtitle">Publish a new periodic outlook, or review past entries below.</p>

      <div className="card admin-form-card">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="period">Timeframe</label>
            <select id="period" value={period} onChange={(e) => setPeriod(e.target.value)}>
              {PERIODS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="narrative">Narrative</label>
            <textarea
              id="narrative"
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              placeholder="Write the outlook narrative…"
              required
            />
          </div>
          {status && (
            <p className={status.type === 'success' ? 'admin-success-note' : 'admin-demo-note'}>
              {status.message}
            </p>
          )}
          <button type="submit" className="btn">Publish</button>
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
                <span className="admin-entry-title">{entry.period.toUpperCase()} — {entry.updatedAt}</span>
                <span className="admin-entry-meta">{entry.narrative.slice(0, 120)}{entry.narrative.length > 120 ? '…' : ''}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isFirebaseConfigured && (
        <p className="text-tertiary" style={{ fontSize: 12.5, marginTop: 14 }}>
          Connect Firebase to persist published entries to Firestore.
        </p>
      )}
    </div>
  );
}
