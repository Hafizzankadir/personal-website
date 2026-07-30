import { useEffect, useState } from 'react';
import { getPhilosophy } from '../lib/content';
import './Philosophy.css';

export default function Philosophy() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getPhilosophy().then((result) => {
      if (!cancelled) {
        setData(result);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <span className="section-label section-label--accent">Pillar 03</span>
        <h1 className="page-title">Philosophy</h1>
        <p className="page-subtitle">
          The guiding principle and decision-making frameworks behind how I trade, build, and live.
        </p>
      </div>

      {loading && <div className="loading-state">Loading…</div>}

      {!loading && data && (
        <>
          <div className="card guiding-principle-card">
            <span className="section-label">Guiding Principle</span>
            <p className="guiding-principle-text">{data.guidingPrinciple}</p>
          </div>

          <div className="philosophy-section">
            <span className="section-label">Framework</span>
            <ol className="framework-list">
              {data.frameworks.map((fw, i) => (
                <li className="framework-item" key={fw.title}>
                  <span className="framework-num text-mono">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="framework-title">{fw.title}</h3>
                    <p className="text-secondary framework-desc">{fw.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="philosophy-section">
            <span className="section-label">How This Shapes Decisions</span>
            <div className="grid grid-3 applications-grid">
              <div className="card application-card">
                <span className="tag tag--accent">Markets</span>
                <p className="application-text">{data.applications.markets}</p>
              </div>
              <div className="card application-card">
                <span className="tag tag--accent">Building</span>
                <p className="application-text">{data.applications.building}</p>
              </div>
              <div className="card application-card">
                <span className="tag tag--accent">Life</span>
                <p className="application-text">{data.applications.life}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
