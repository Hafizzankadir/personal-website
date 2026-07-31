import { useEffect, useState } from 'react';
import { fetchTradingJournalData, isSheetsConfigured } from '../../../lib/googleSheets';
import { getSiteSettings, saveSiteSettings } from '../../../lib/content';
import { isFirebaseConfigured } from '../../../lib/firebase';

export default function TradingJournalSync() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(true);
  const [visibilityStatus, setVisibilityStatus] = useState(null);

  async function load() {
    setLoading(true);
    const [journal, settings] = await Promise.all([fetchTradingJournalData(), getSiteSettings()]);
    setData(journal);
    setVisible(settings?.tradingJournalVisible !== false);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  async function handleToggleVisibility() {
    const next = !visible;
    setVisible(next);
    try {
      await saveSiteSettings({ tradingJournalVisible: next });
      setVisibilityStatus({ type: 'success', message: 'Saved.' });
    } catch {
      setVisibilityStatus({ type: 'demo', message: 'Firebase not connected — change won\'t persist on reload.' });
    }
  }

  return (
    <div>
      <h1 className="admin-section-title">Trading Journal Sync</h1>
      <p className="admin-section-subtitle">
        Read-only status for the Google Sheets-backed trading journal. Data entry happens in the
        sheet itself — this panel only reflects sync state.
      </p>

      <div className="card admin-form-card">
        <div className="card-header">
          <span className="section-label">Public Visibility</span>
        </div>
        <div className="visibility-toggle-row">
          <div>
            <p className="visibility-toggle-label">Show Trading Journal tab on the public site</p>
            <p className="text-tertiary" style={{ fontSize: 12.5 }}>
              When off, visitors see a blurred "This Page is Hidden by Admin" placeholder instead of the tab content.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={visible}
            className={'toggle-switch' + (visible ? ' is-on' : '')}
            onClick={handleToggleVisibility}
          >
            <span className="toggle-switch-knob" />
          </button>
        </div>
        {visibilityStatus && (
          <p className={visibilityStatus.type === 'success' ? 'admin-success-note' : 'admin-demo-note'} style={{ marginTop: 12 }}>
            {visibilityStatus.message}
          </p>
        )}
        {!isFirebaseConfigured && (
          <p className="text-tertiary" style={{ fontSize: 12.5, marginTop: 12 }}>
            Connect Firebase to persist this setting across page reloads.
          </p>
        )}
      </div>

      <div className="card admin-form-card">
        <div className="card-header">
          <span className="section-label">Sync Status</span>
          <span className={isSheetsConfigured ? 'tag tag--positive' : 'tag tag--neutral'}>
            {isSheetsConfigured ? 'Connected' : 'Not Connected — Mock Data'}
          </span>
        </div>

        {loading ? (
          <div className="loading-state">Checking sync status…</div>
        ) : (
          <div className="stats-grid">
            <div className="stat-cell">
              <span className="stat-value text-mono">
                {data?.lastSync ? new Date(data.lastSync).toLocaleString() : '—'}
              </span>
              <span className="stat-label">Last Sync</span>
            </div>
            <div className="stat-cell">
              <span className="stat-value text-mono">{data?.source === 'sheets' ? 'Google Sheets' : 'Mock'}</span>
              <span className="stat-label">Data Source</span>
            </div>
            <div className="stat-cell">
              <span className="stat-value text-mono">{data?.stats?.Compilation?.tradesLogged ?? '—'}</span>
              <span className="stat-label">Trades Logged</span>
            </div>
            <div className="stat-cell">
              <span className="stat-value text-mono">{data?.assetClasses?.length ?? '—'}</span>
              <span className="stat-label">Asset Classes</span>
            </div>
          </div>
        )}

        <button className="btn" style={{ marginTop: 20 }} onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? 'Refreshing…' : 'Refresh Now'}
        </button>

        {!isSheetsConfigured && (
          <p className="text-tertiary" style={{ fontSize: 12.5, marginTop: 14 }}>
            Set VITE_GOOGLE_SHEETS_ID and VITE_GOOGLE_SHEETS_API_KEY to connect the live sheet.
          </p>
        )}
      </div>
    </div>
  );
}
