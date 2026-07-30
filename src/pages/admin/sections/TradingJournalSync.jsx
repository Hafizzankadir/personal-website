import { useEffect, useState } from 'react';
import { fetchTradingJournalData, isSheetsConfigured } from '../../../lib/googleSheets';

export default function TradingJournalSync() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    setLoading(true);
    const result = await fetchTradingJournalData();
    setData(result);
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

  return (
    <div>
      <h1 className="admin-section-title">Trading Journal Sync</h1>
      <p className="admin-section-subtitle">
        Read-only status for the Google Sheets-backed trading journal. Data entry happens in the
        sheet itself — this panel only reflects sync state.
      </p>

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
