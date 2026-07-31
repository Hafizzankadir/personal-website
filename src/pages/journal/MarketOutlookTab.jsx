import { useEffect, useState } from 'react';
import { marked } from 'marked';
import { getMarketOutlook } from '../../lib/content';

const PERIODS = ['weekly', 'monthly', 'quarterly', 'yearly'];

const VIEW_LABELS = {
  overweight: 'Overweight',
  neutral: 'Neutral',
  underweight: 'Underweight',
};

function viewTagClass(view) {
  if (view === 'overweight') return 'tag tag--positive';
  if (view === 'underweight') return 'tag tag--negative';
  return 'tag tag--neutral';
}

export default function MarketOutlookTab() {
  const [period, setPeriod] = useState('weekly');
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getMarketOutlook(period).then((result) => {
      if (!cancelled) {
        setEntry(result);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [period]);

  return (
    <div className="journal-tab">
      <div className="journal-tab-header">
        <div className="toggle-group">
          {PERIODS.map((p) => (
            <button key={p} className={p === period ? 'is-active' : ''} onClick={() => setPeriod(p)}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="loading-state">Loading outlook…</div>}

      {!loading && !entry && <div className="empty-state">No {period} outlook published yet.</div>}

      {!loading && entry && (
        <>
          <div className="card journal-section">
            <div className="card-header">
              <span className="section-label">Narrative</span>
              <span className="text-mono text-tertiary">Updated {entry.updatedAt}</span>
            </div>
            <div
              className="outlook-narrative"
              dangerouslySetInnerHTML={{ __html: marked.parse(entry.narrative) }}
            />
          </div>

          <div className="card journal-section">
            <div className="card-header">
              <span className="section-label">Sector View</span>
            </div>
            <div className="grid grid-3 sector-grid">
              {entry.sectors.map((sector) => (
                <div className="sector-cell" key={sector.name}>
                  <span className="sector-name">{sector.name}</span>
                  <span className={viewTagClass(sector.view)}>{VIEW_LABELS[sector.view]}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
