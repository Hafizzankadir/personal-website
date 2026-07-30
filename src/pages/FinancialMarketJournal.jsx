import { useState } from 'react';
import TradingJournalTab from './journal/TradingJournalTab';
import MarketOutlookTab from './journal/MarketOutlookTab';
import TradeIdeasTab from './journal/TradeIdeasTab';
import './FinancialMarketJournal.css';

const TABS = [
  { id: 'trading-journal', label: 'Trading Journal' },
  { id: 'market-outlook', label: 'Market Outlook' },
  { id: 'trade-ideas', label: 'Trade Ideas' },
];

export default function FinancialMarketJournal() {
  const [tab, setTab] = useState('trading-journal');

  return (
    <div className="page">
      <div className="page-header">
        <span className="section-label section-label--accent">Pillar 02</span>
        <h1 className="page-title">Financial Market Journal</h1>
        <p className="page-subtitle">
          Live trading performance, periodic market outlook, and active trade &amp; investment ideas.
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

      {tab === 'trading-journal' && <TradingJournalTab />}
      {tab === 'market-outlook' && <MarketOutlookTab />}
      {tab === 'trade-ideas' && <TradeIdeasTab />}
    </div>
  );
}
