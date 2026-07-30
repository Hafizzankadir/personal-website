// Placeholder content used until Firestore / Google Sheets are wired up with
// real credentials. Shapes here mirror the Firestore documents exactly so
// swapping the data source later is a no-op for consuming components.

export const mockMarketOutlook = {
  weekly: {
    id: 'weekly-2026-07-27',
    period: 'weekly',
    narrative:
      'Risk sentiment stayed constructive into month-end, with breadth improving across cyclicals. Watching whether the move in rates holds through next week\'s data prints before adding exposure.',
    sectors: [
      { name: 'Technology', view: 'overweight' },
      { name: 'Financials', view: 'overweight' },
      { name: 'Energy', view: 'neutral' },
      { name: 'Healthcare', view: 'neutral' },
      { name: 'Consumer Discretionary', view: 'neutral' },
      { name: 'Utilities', view: 'underweight' },
      { name: 'Real Estate', view: 'underweight' },
    ],
    updatedAt: '2026-07-27',
  },
  monthly: {
    id: 'monthly-2026-07',
    period: 'monthly',
    narrative:
      'July favored quality growth over deep value. Positioning stays tilted toward secular winners while trimming rate-sensitive laggards into strength.',
    sectors: [
      { name: 'Technology', view: 'overweight' },
      { name: 'Industrials', view: 'overweight' },
      { name: 'Financials', view: 'neutral' },
      { name: 'Materials', view: 'neutral' },
      { name: 'Consumer Staples', view: 'underweight' },
      { name: 'Utilities', view: 'underweight' },
    ],
    updatedAt: '2026-07-01',
  },
  quarterly: {
    id: 'quarterly-2026-q3',
    period: 'quarterly',
    narrative:
      'Q3 base case is a soft landing with sticky-but-declining inflation. Barbell of quality compounders and select cyclical beta, funded from defensives.',
    sectors: [
      { name: 'Technology', view: 'overweight' },
      { name: 'Financials', view: 'overweight' },
      { name: 'Energy', view: 'neutral' },
      { name: 'Healthcare', view: 'neutral' },
      { name: 'Consumer Staples', view: 'underweight' },
    ],
    updatedAt: '2026-07-01',
  },
  yearly: {
    id: 'yearly-2026',
    period: 'yearly',
    narrative:
      '2026 thesis: rate-cutting cycle broadens market leadership beyond mega-cap tech. Staying long-biased with active hedging around macro catalysts.',
    sectors: [
      { name: 'Technology', view: 'overweight' },
      { name: 'Industrials', view: 'neutral' },
      { name: 'Financials', view: 'neutral' },
      { name: 'Energy', view: 'underweight' },
    ],
    updatedAt: '2026-01-05',
  },
};

export const mockTradeIdeas = [
  {
    id: 'ti-1',
    ticker: 'NVDA',
    date: '2026-07-22',
    thesis: 'Data center demand re-acceleration into next-gen chip cycle.',
    detail:
      'Channel checks point to supply constraints easing in H2, with hyperscaler capex guidance trending up across the last three earnings calls. Entry scaled on pullbacks toward the 50-day.',
    status: 'active',
  },
  {
    id: 'ti-2',
    ticker: 'XOM',
    date: '2026-06-30',
    thesis: 'Refining margins bottoming alongside disciplined capital return.',
    detail:
      'Took profit after a 14% move as crack spreads normalized faster than expected. Thesis played out within the projected 6-8 week window.',
    status: 'closed-profit',
  },
  {
    id: 'ti-3',
    ticker: 'SNAP',
    date: '2026-06-10',
    thesis: 'Ad-load recovery stalling against a weakening engagement trend.',
    detail:
      'Cut the short after guidance came in ahead of the Street; covered near breakeven-to-small-loss rather than let a broken thesis run.',
    status: 'closed-loss',
  },
  {
    id: 'ti-4',
    ticker: 'MELI',
    date: '2026-05-18',
    thesis: 'LatAm e-commerce penetration + fintech attach rate compounding.',
    detail:
      'Long-duration core position. Adding on macro-driven weakness unrelated to the underlying business trajectory.',
    status: 'active',
  },
];

export const mockPhilosophy = {
  guidingPrinciple:
    'Systems thinking: markets, businesses, and personal decisions are all networks of feedback loops. Find the loop before you take the position.',
  frameworks: [
    {
      title: 'Process over outcome',
      description:
        'Grade decisions by the quality of the process at the time they were made, not by the result the market happened to deliver.',
    },
    {
      title: 'Asymmetry first',
      description:
        'Every position is sized and structured around its risk/reward skew before its narrative — a good story with poor asymmetry is not a trade.',
    },
    {
      title: 'Falsifiability',
      description:
        'A thesis is only useful if there is a clear, pre-defined condition that proves it wrong. If nothing can disprove it, it is not a thesis.',
    },
    {
      title: 'Compounding edges',
      description:
        'Small, repeatable edges compounded over hundreds of decisions beat swinging for singular high-conviction outcomes.',
    },
  ],
  applications: {
    markets:
      'Position sizing and stop placement are mechanical, not emotional — the framework decides before the trade, not during it.',
    building:
      'Ship small, measure the feedback loop, iterate. Every project (including this site) is treated as a live experiment with a hypothesis attached.',
    life:
      'Default to reversible decisions when uncertain, and treat irreversible ones with proportionally more research and patience.',
  },
};

export const mockKnowledgeHub = [
  {
    id: 'kh-1',
    title: 'Thinking in Bets — calibrating confidence, not certainty',
    date: '2026-07-20',
    summary:
      'Annie Duke\'s framing of decisions as bets under uncertainty maps directly onto position sizing: separate the quality of the decision from the quality of the outcome.',
    tags: ['Mindset', 'Finance'],
  },
  {
    id: 'kh-2',
    title: 'Notes on vectorized backtesting with pandas',
    date: '2026-07-12',
    summary:
      'Moved the strategy backtester from a loop-based implementation to fully vectorized pandas operations — ~40x speedup on a 10-year tick dataset.',
    tags: ['General Learning', 'Finance'],
  },
  {
    id: 'kh-3',
    title: 'Antifragile — barbell strategy applied to career decisions',
    date: '2026-06-28',
    summary:
      'Taleb\'s barbell (extreme safety + extreme risk, nothing in the middle) is a useful lens for career bets: a stable base with high-optionality side projects.',
    tags: ['Mindset'],
  },
  {
    id: 'kh-4',
    title: 'Power BI: building a live equity curve dashboard',
    date: '2026-06-15',
    summary:
      'Connected Power BI directly to the trading journal Google Sheet via the web connector — DAX measures for rolling Sharpe and drawdown.',
    tags: ['General Learning'],
  },
];

export const mockProjects = [
  {
    id: 'proj-1',
    title: 'Personal Brand Website',
    category: 'Web Development',
    description:
      'This site — a React/Firebase personal brand platform combining a live trading dashboard, market commentary, and a headless CMS-style admin panel.',
    techStack: ['React', 'Vite', 'Firebase', 'Google Sheets API'],
    viewUrl: '#',
    sourceUrl: 'https://github.com/',
    screenshot: null,
  },
  {
    id: 'proj-2',
    title: 'Systematic Backtesting Engine',
    category: 'Quant / Python',
    description:
      'Vectorized Python backtester supporting multi-asset strategies with walk-forward optimization and Monte Carlo drawdown simulation.',
    techStack: ['Python', 'pandas', 'NumPy', 'Matplotlib'],
    viewUrl: '#',
    sourceUrl: 'https://github.com/',
    screenshot: null,
  },
  {
    id: 'proj-3',
    title: 'Trading Journal Power BI Dashboard',
    category: 'Analytics',
    description:
      'Live-connected Power BI report surfacing win rate, R-multiple distribution, and rolling Sharpe pulled directly from the trading journal sheet.',
    techStack: ['Power BI', 'DAX', 'Google Sheets'],
    viewUrl: '#',
    sourceUrl: null,
    screenshot: null,
  },
  {
    id: 'proj-4',
    title: 'Three-Statement Model Automator',
    category: 'Financial Modeling',
    description:
      'Excel/VBA toolkit that ingests raw 10-K XBRL data and auto-populates a linked three-statement model with formatting and audit checks.',
    techStack: ['Excel', 'VBA', 'XBRL'],
    viewUrl: '#',
    sourceUrl: 'https://github.com/',
    screenshot: null,
  },
];

const ASSET_CLASSES = ['Compilation', 'Futures', 'Stocks', 'CFDs', 'Crypto'];

function buildEquityCurve(seed, points = 24) {
  let equity = 10000;
  const curve = [];
  for (let i = 0; i < points; i++) {
    const drift = Math.sin(i / 3 + seed) * 180 + (i - points / 2) * 22;
    equity += drift;
    curve.push({ label: `W${i + 1}`, value: Math.round(equity) });
  }
  return curve;
}

const statsByAsset = {
  Compilation: { winRate: 58, lossRate: 42, avgRR: 1.9, sharpe: 1.42, tradesLogged: 214 },
  Futures: { winRate: 55, lossRate: 45, avgRR: 2.1, sharpe: 1.35, tradesLogged: 88 },
  Stocks: { winRate: 61, lossRate: 39, avgRR: 1.7, sharpe: 1.51, tradesLogged: 76 },
  CFDs: { winRate: 52, lossRate: 48, avgRR: 2.3, sharpe: 1.11, tradesLogged: 34 },
  Crypto: { winRate: 57, lossRate: 43, avgRR: 1.6, sharpe: 1.28, tradesLogged: 16 },
};

const pnlByAssetClass = [
  { asset: 'Futures', pnl: 8420 },
  { asset: 'Stocks', pnl: 5110 },
  { asset: 'CFDs', pnl: -1240 },
  { asset: 'Crypto', pnl: 2380 },
];

const strategyVersions = [
  { version: 'v3', date: '2026-05-01', notes: 'Tightened stop placement on futures scalps; added session-time filter.' },
  { version: 'v2', date: '2026-01-15', notes: 'Introduced R-multiple-based position sizing across all asset classes.' },
  { version: 'v1', date: '2025-08-01', notes: 'Initial systematic ruleset — discretionary entries, fixed lot sizing.' },
];

export const mockTradingJournal = {
  assetClasses: ASSET_CLASSES,
  equityCurves: ASSET_CLASSES.reduce((acc, asset, i) => {
    acc[asset] = buildEquityCurve(i);
    return acc;
  }, {}),
  stats: statsByAsset,
  pnlByAssetClass,
  strategyVersions,
  lastSync: '2026-07-29T14:32:00Z',
};
