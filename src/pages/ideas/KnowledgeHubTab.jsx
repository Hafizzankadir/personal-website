import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getKnowledgeHub } from '../../lib/content';
import CopyLinkButton from '../../components/CopyLinkButton';
import '../KnowledgeHub.css';

const TAGS = ['All', 'Finance', 'Mindset', 'General Learning'];

export default function KnowledgeHubTab() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState('All');
  const [searchParams] = useSearchParams();
  const sharedId = searchParams.get('id');

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

  useEffect(() => {
    if (!sharedId || loading) return;
    const el = document.getElementById(`knowledge-${sharedId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [sharedId, loading]);

  const filtered = useMemo(() => {
    if (activeTag === 'All') return entries;
    return entries.filter((e) => e.tags.includes(activeTag));
  }, [entries, activeTag]);

  return (
    <div className="journal-tab">
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
          {filtered.map((entry) => {
            const shareUrl = `${window.location.origin}${window.location.pathname}?tab=knowledge&id=${entry.id}`;
            return (
              <div
                className={'card knowledge-card' + (sharedId === entry.id ? ' shared-highlight' : '')}
                key={entry.id}
                id={`knowledge-${entry.id}`}
              >
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
                <div className="knowledge-card-footer">
                  <CopyLinkButton url={shareUrl} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
