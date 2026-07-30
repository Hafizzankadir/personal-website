import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './SiteNav.css';

const NAV_LINKS = [
  { num: 1, label: 'Home', path: '/' },
  { num: 2, label: 'Market Journal', path: '/journal' },
  { num: 3, label: 'Philosophy', path: '/philosophy' },
  { num: 4, label: 'Knowledge Hub', path: '/knowledge' },
  { num: 5, label: 'Projects', path: '/projects' },
];

const TICKER_ITEMS = [
  { symbol: 'ES1!', value: '5,842.25', change: '+0.42%', positive: true },
  { symbol: 'NQ1!', value: '20,914.50', change: '+0.61%', positive: true },
  { symbol: 'DXY', value: '104.18', change: '-0.15%', positive: false },
  { symbol: 'BTC/USD', value: '68,240', change: '+2.34%', positive: true },
  { symbol: 'XAU/USD', value: '2,412.60', change: '+0.28%', positive: true },
  { symbol: 'CL1!', value: '78.92', change: '-0.87%', positive: false },
  { symbol: '10Y', value: '4.28%', change: '-0.03', positive: false },
  { symbol: 'VIX', value: '13.42', change: '-1.20%', positive: false },
];

const EXTERNAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/', icon: 'github' },
  { label: 'YouTube', href: 'https://youtube.com/', icon: 'youtube' },
  { label: 'Google Sheets', href: 'https://sheets.google.com/', icon: 'sheet' },
];

function Icon({ name }) {
  const common = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (name === 'github') {
    return (
      <svg {...common}>
        <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
      </svg>
    );
  }
  if (name === 'youtube') {
    return (
      <svg {...common}>
        <rect x="2" y="5" width="20" height="14" rx="4" />
        <path d="M10 9.5v5l4.5-2.5-4.5-2.5z" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M8 9h8M8 13h8M8 17h5" />
    </svg>
  );
}

export default function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      if (isTyping) return;
      const match = NAV_LINKS.find((l) => String(l.num) === e.key);
      if (match) navigate(match.path);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <header className="site-nav">
      <div className="ticker-bar" aria-hidden="true">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span className="ticker-item" key={i}>
              <span className="ticker-symbol">{item.symbol}</span>
              <span className="ticker-value">{item.value}</span>
              <span className={item.positive ? 'ticker-change positive' : 'ticker-change negative'}>
                {item.change}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="nav-row">
        <div className="nav-row-inner">
          <div className="nav-brand-group">
            <NavLink to="/" className="nav-brand">
              HAFIZZAN<span className="nav-brand-accent">.KADIR</span>
            </NavLink>
            <span className="status-pill">
              <span className="status-dot" />
              OPEN TO WORK
            </span>
          </div>

          <nav className="nav-links" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => 'nav-link' + (isActive ? ' is-active' : '')}
                end={link.path === '/'}
              >
                <span className="nav-link-num">{link.num}</span>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="nav-external">
            {EXTERNAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="nav-external-link"
                aria-label={link.label}
                title={link.label}
              >
                <Icon name={link.icon} />
              </a>
            ))}
          </div>

          <button
            className="nav-hamburger"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="nav-mobile-menu">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => 'nav-mobile-link' + (isActive ? ' is-active' : '')}
              end={link.path === '/'}
              onClick={() => setMobileOpen(false)}
            >
              <span className="nav-link-num">{link.num}</span>
              {link.label}
            </NavLink>
          ))}
          <div className="nav-mobile-external">
            {EXTERNAL_LINKS.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="nav-external-link">
                <Icon name={link.icon} />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
