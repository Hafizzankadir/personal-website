import { useEffect, useMemo, useState } from 'react';
import { getKnowledgeHub } from '../lib/content';
import './KnowledgeHub.css';

const TAGS = ['All', 'Finance', 'Mindset', 'General Learning'];

export default function KnowledgeHub() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState('All');

  useEffect(() => {
    let cancelled = false;
    getKnowledgeHub().then((result) => {
      if (!cancelled) {
        setEntries(result);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (activeTag === 'All') return entries;
    return entries.filter((e) => e.tags.includes(activeTag));
  }, [entries, activeTag]);

  return (
    <div className="page">
      <div className="page-header">
        <span className="section-label section-label--accent">Pillar 04</span>
        <h1 className="page-title">Knowledge Hub</h1>
        <p className="page-subtitle">
          A second brain — short-form notes on books, podcasts, and concepts as they're being studied.
        </p>
      </div>

      <div className="tag-filter-row">
        {TAGS.map((tag) => (
          <button
            key={tag}
            className={'tag-filter' + (tag === activeTag ? ' is-active' : '')}
            onClick={() => setActiveTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {loading && <div className="loading-state">Loading entries…</div>}

      {!loading && filtered.length === 0 && (
        <div className="empty-state">No entries tagged "{activeTag}" yet.</div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="knowledge-list">
          {filtered.map((entry) => (
            <div className="card knowledge-card" key={entry.id}>
              <div className="knowledge-card-head">
                <span className="text-mono text-tertiary knowledge-date">{entry.date}</span>
                <div className="knowledge-tags">
                  {entry.tags.map((t) => (
                    <span className="tag" key={t}>{t}</span>
                  ))}
                </div>
              </div>
              <h3 className="knowledge-title">{entry.title}</h3>
              <p className="text-secondary knowledge-summary">{entry.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
