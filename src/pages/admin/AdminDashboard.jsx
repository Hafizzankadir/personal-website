import { NavLink, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TradingJournalSync from './sections/TradingJournalSync';
import MarketOutlookAdmin from './sections/MarketOutlookAdmin';
import TradeIdeasAdmin from './sections/TradeIdeasAdmin';
import PhilosophyAdmin from './sections/PhilosophyAdmin';
import KnowledgeHubAdmin from './sections/KnowledgeHubAdmin';
import HomeAdmin from './sections/HomeAdmin';
import ProjectsAdmin from './sections/ProjectsAdmin';
import './Admin.css';

const SECTIONS = [
  { path: 'home', label: 'Home' },
  { path: 'sync', label: 'Trading Journal Sync' },
  { path: 'market-outlook', label: 'Market Outlook' },
  { path: 'trade-ideas', label: 'Trade Ideas' },
  { path: 'philosophy', label: 'Philosophy' },
  { path: 'knowledge-hub', label: 'Knowledge Hub' },
  { path: 'projects', label: 'Projects' },
];

export default function AdminDashboard() {
  const { user, logout, isDemo } = useAuth();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-head">
          <span className="text-mono admin-sidebar-brand">ADMIN</span>
          {isDemo && <span className="tag tag--accent admin-demo-tag">Demo Mode</span>}
        </div>
        <nav className="admin-sidebar-nav">
          {SECTIONS.map((s) => (
            <NavLink
              key={s.path}
              to={`/admin/dashboard/${s.path}`}
              className={({ isActive }) => 'admin-sidebar-link' + (isActive ? ' is-active' : '')}
            >
              {s.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <span className="text-mono text-tertiary admin-user-email">{user?.email}</span>
          <button className="btn btn--outline admin-logout-btn" onClick={logout}>Sign out</button>
        </div>
      </aside>

      <main className="admin-main">
        <Routes>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<HomeAdmin />} />
          <Route path="sync" element={<TradingJournalSync />} />
          <Route path="market-outlook" element={<MarketOutlookAdmin />} />
          <Route path="trade-ideas" element={<TradeIdeasAdmin />} />
          <Route path="philosophy" element={<PhilosophyAdmin />} />
          <Route path="knowledge-hub" element={<KnowledgeHubAdmin />} />
          <Route path="projects" element={<ProjectsAdmin />} />
        </Routes>
      </main>
    </div>
  );
}
