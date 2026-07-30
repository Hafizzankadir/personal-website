import { mockTradingJournal } from './mockData';

const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEETS_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;

export const isSheetsConfigured = Boolean(SHEET_ID && API_KEY);

// Expected sheet layout (read-only, one range per tab):
//   'Stats'         -> per-asset-class summary rows: asset, winRate, lossRate, avgRR, sharpe, tradesLogged
//   'EquityCurve'   -> columns: label, Compilation, Futures, Stocks, CFDs, Crypto
//   'PnLByAsset'    -> asset, pnl
//   'StrategyLog'   -> version, date, notes
//
// Until VITE_GOOGLE_SHEETS_ID / VITE_GOOGLE_SHEETS_API_KEY are provided,
// every function below resolves to the mock dataset so the Trading Journal
// tab is fully interactive with placeholder data.

async function fetchRange(range) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(
    range
  )}?key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sheets API error ${res.status} for range "${range}"`);
  const data = await res.json();
  return data.values ?? [];
}

function rowsToObjects(rows) {
  const [header, ...body] = rows;
  return body.map((row) => Object.fromEntries(header.map((key, i) => [key, row[i]])));
}

export async function fetchTradingJournalData() {
  if (!isSheetsConfigured) {
    return { ...mockTradingJournal, source: 'mock' };
  }

  try {
    const [statsRows, curveRows, pnlRows, logRows] = await Promise.all([
      fetchRange('Stats'),
      fetchRange('EquityCurve'),
      fetchRange('PnLByAsset'),
      fetchRange('StrategyLog'),
    ]);

    const statsList = rowsToObjects(statsRows);
    const stats = Object.fromEntries(
      statsList.map((row) => [
        row.asset,
        {
          winRate: Number(row.winRate),
          lossRate: Number(row.lossRate),
          avgRR: Number(row.avgRR),
          sharpe: Number(row.sharpe),
          tradesLogged: Number(row.tradesLogged),
        },
      ])
    );

    const [curveHeader, ...curveBody] = curveRows;
    const assetClasses = curveHeader.slice(1);
    const equityCurves = Object.fromEntries(
      assetClasses.map((asset, colIndex) => [
        asset,
        curveBody.map((row) => ({ label: row[0], value: Number(row[colIndex + 1]) })),
      ])
    );

    const pnlByAssetClass = rowsToObjects(pnlRows).map((row) => ({
      asset: row.asset,
      pnl: Number(row.pnl),
    }));

    const strategyVersions = rowsToObjects(logRows);

    return {
      assetClasses,
      equityCurves,
      stats,
      pnlByAssetClass,
      strategyVersions,
      lastSync: new Date().toISOString(),
      source: 'sheets',
    };
  } catch (err) {
    console.warn('[googleSheets] falling back to mock trading journal data:', err.message);
    return { ...mockTradingJournal, source: 'mock' };
  }
}
