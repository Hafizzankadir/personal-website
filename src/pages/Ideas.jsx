import { useSearchParams } from 'react-router-dom';
import PhilosophyTab from './ideas/PhilosophyTab';
import KnowledgeHubTab from './ideas/KnowledgeHubTab';
import './FinancialMarketJournal.css';

const TABS = [
  { id: 'philosophy', label: 'Philosophy' },
  { id: 'knowledge', label: 'Knowledge Hub' },
];

export default function Ideas() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') === 'knowledge' ? 'knowledge' : 'philosophy';

  function setTab(nextTab) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', nextTab);
      next.delete('id');
      return next;
    });
  }

  return (
    <div className="page">
      <div className="page-header">
        <span className="section-label section-label--accent">Pillar 03</span>
        <h1 className="page-title">Ideas</h1>
        <p className="page-subtitle">
          The philosophy behind how I trade and build, and a running log of what I'm studying.
        </p>
      </div>

      <div className="pillar-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={'pillar-tab' + (tab === t.id ? ' is-active' : '')}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'philosophy' && <PhilosophyTab />}
      {tab === 'knowledge' && <KnowledgeHubTab />}
    </div>
  );
}
