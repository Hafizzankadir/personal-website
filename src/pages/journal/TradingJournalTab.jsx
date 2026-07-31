import { useEffect, useState } from 'react';
import { fetchTradingJournalData } from '../../lib/googleSheets';
import { getSiteSettings } from '../../lib/content';
import EquityCurveChart from './EquityCurveChart';

const STAT_LABELS = {
  winRate: 'Win Rate',
  lossRate: 'Loss Rate',
  avgRR: 'Avg R:R',
  sharpe: 'Backtest Sharpe',
  tradesLogged: 'Trades Logged',
};

function formatStat(key, value) {
  if (key === 'winRate' || key === 'lossRate') return `${value}%`;
  if (key === 'avgRR') return `${value}R`;
  if (key === 'sharpe') return value.toFixed(2);
  return value;
}

function HiddenPlaceholder() {
  return (
    <div className="tj-hidden">
      <div className="tj-hidden-backdrop" aria-hidden="true">
        <div className="tj-hidden-bars">
          {[62, 40, 78, 52, 90, 34, 66, 48, 84, 58].map((h, i) => (
            <span key={i} style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="tj-hidden-lines">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="tj-hidden-overlay">
        <span className="tj-hidden-icon" aria-hidden="true">🔒</span>
        <p className="tj-hidden-title">This Page is Hidden by Admin</p>
        <p className="tj-hidden-subtitle">The trading journal is temporarily unavailable while it's being set up.</p>
      </div>
    </div>
  );
}

export default function TradingJournalTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const [asset, setAsset] = useState('Compilation');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getSiteSettings().then((settings) => {
      if (cancelled) return;
      if (settings?.tradingJournalVisible === false) {
        setVisible(false);
        setLoading(false);
        return;
      }
      fetchTradingJournalData().then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div className="loading-state">Loading trading journal…</div>;
  if (!visible) return <HiddenPlaceholder />;
  if (!data) return <div className="empty-state">No trading journal data available.</div>;

  const stats = data.stats[asset] ?? data.stats.Compilation;
  const curve = data.equityCurves[asset] ?? [];

  return (
    <div className="journal-tab">
      <div className="journal-tab-header">
        <div className="toggle-group">
          {data.assetClasses.map((a) => (
            <button
              key={a}
              className={a === asset ? 'is-active' : ''}
              onClick={() => setAsset(a)}
            >
              {a}
            </button>
          ))}
        </div>
        <span className="text-mono text-tertiary sync-note">
          {data.source === 'mock' ? 'Showing placeholder data · ' : ''}
          Last sync: {new Date(data.lastSync).toLocaleString()}
        </span>
      </div>

      <div className="grid grid-2 journal-main-grid">
        <div className="card">
          <div className="card-header">
            <span className="section-label">Equity Curve — {asset}</span>
          </div>
          <EquityCurveChart data={curve} />
        </div>

        <div className="card">
          <div className="card-header">
            <span className="section-label">Performance Stats</span>
          </div>
          <div className="stats-grid">
            {Object.entries(STAT_LABELS).map(([key, label]) => (
              <div className="stat-cell" key={key}>
                <span className="stat-value text-mono">{formatStat(key, stats[key])}</span>
                <span className="stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {asset === 'Compilation' && (
        <div className="card journal-section">
          <div className="card-header">
            <span className="section-label">Asset Class P&amp;L</span>
          </div>
          <div className="grid grid-4 pnl-grid">
            {data.pnlByAssetClass.map((row) => (
              <div className="pnl-cell" key={row.asset}>
                <span className="pnl-asset">{row.asset}</span>
                <span className={`pnl-value text-mono ${row.pnl >= 0 ? 'text-positive' : 'text-negative'}`}>
                  {row.pnl >= 0 ? '+' : ''}
                  {row.pnl.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card journal-section">
        <div className="card-header">
          <span className="section-label">Strategy Version History</span>
        </div>
        <ul className="strategy-list">
          {data.strategyVersions.map((v) => (
            <li key={v.version} className="strategy-item">
              <span className="tag tag--accent strategy-version">{v.version}</span>
              <div className="strategy-item-body">
                <span className="text-mono text-tertiary strategy-date">{v.date}</span>
                <p className="strategy-notes">{v.notes}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
