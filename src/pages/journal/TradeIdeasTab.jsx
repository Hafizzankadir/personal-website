import { useEffect, useState } from 'react';
import { getTradeIdeas } from '../../lib/content';

const STATUS_META = {
  active: { label: 'Active', className: 'tag tag--accent' },
  'closed-profit': { label: 'Closed — Profit', className: 'tag tag--positive' },
  'closed-loss': { label: 'Closed — Loss', className: 'tag tag--negative' },
};

export default function TradeIdeasTab() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getTradeIdeas().then((result) => {
      if (!cancelled) {
        setIdeas(result);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div className="loading-state">Loading trade ideas…</div>;
  if (ideas.length === 0) return <div className="empty-state">No trade ideas published yet.</div>;

  return (
    <div className="journal-tab">
      <div className="trade-ideas-list">
        {ideas.map((idea) => {
          const status = STATUS_META[idea.status] ?? STATUS_META.active;
          return (
            <div className="card trade-idea-card" key={idea.id}>
              <div className="trade-idea-head">
                <span className="trade-idea-ticker text-mono">{idea.ticker}</span>
                <span className={status.className}>{status.label}</span>
                <span className="text-mono text-tertiary trade-idea-date">{idea.date}</span>
              </div>
              <p className="trade-idea-thesis">{idea.thesis}</p>
              <p className="text-secondary trade-idea-detail">{idea.detail}</p>
              {idea.chartUrl && (
                <a href={idea.chartUrl} target="_blank" rel="noreferrer" className="trade-idea-chart-link">
                  View Chart →
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
