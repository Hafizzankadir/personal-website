import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { marked } from 'marked';
import { getMarketOutlook, getMarketOutlookEntryById } from '../../lib/content';
import CopyLinkButton from '../../components/CopyLinkButton';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const sharedId = searchParams.get('id');
  const [period, setPeriod] = useState('weekly');
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const load = sharedId ? getMarketOutlookEntryById(sharedId) : getMarketOutlook(period);
    load.then((result) => {
      if (cancelled) return;
      setEntry(result);
      if (result?.period) setPeriod(result.period);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [period, sharedId]);

  function handlePeriodClick(p) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('id');
      return next;
    });
    setPeriod(p);
  }

  const shareUrl = entry
    ? `${window.location.origin}${window.location.pathname}?tab=market-outlook&id=${entry.id}`
    : '';

  return (
    <div className="journal-tab">
      <div className="journal-tab-header">
        <div className="toggle-group">
          {PERIODS.map((p) => (
            <button key={p} className={p === period ? 'is-active' : ''} onClick={() => handlePeriodClick(p)}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="loading-state">Loading outlook…</div>}

      {!loading && !entry && <div className="empty-state">No {period} outlook published yet.</div>}

      {!loading && entry && (
        <>
          <div className={'card journal-section' + (sharedId === entry.id ? ' shared-highlight' : '')}>
            <div className="card-header">
              <span className="section-label">Narrative</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="text-mono text-tertiary">Updated {entry.updatedAt}</span>
                <CopyLinkButton url={shareUrl} />
              </div>
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
