import { useEffect, useState } from 'react';
import { getProjects } from '../lib/content';
import './Projects.css';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getProjects().then((result) => {
      if (!cancelled) {
        setProjects(result);
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
        <span className="section-label section-label--accent">Pillar 05</span>
        <h1 className="page-title">Projects &amp; Tools</h1>
        <p className="page-subtitle">
          Tools and systems built to support the trading process — including this site.
        </p>
      </div>

      {loading && <div className="loading-state">Loading projects…</div>}

      {!loading && (
        <div className="grid grid-2 projects-grid">
          {projects.map((project) => (
            <div className="card project-card" key={project.id}>
              <div className="project-screenshot">
                {project.screenshot ? (
                  <img src={project.screenshot} alt={`${project.title} screenshot`} />
                ) : (
                  <span className="project-screenshot-placeholder text-mono">No preview</span>
                )}
              </div>
              <div className="project-body">
                <div className="project-head">
                  <h3 className="project-title">{project.title}</h3>
                  <span className="tag tag--accent">{project.category}</span>
                </div>
                <p className="text-secondary project-desc">{project.description}</p>
                <div className="project-tech">
                  {project.techStack.map((t) => (
                    <span className="tag" key={t}>{t}</span>
                  ))}
                </div>
                <div className="project-links">
                  {project.viewUrl && (
                    <a href={project.viewUrl} target="_blank" rel="noreferrer" className="btn btn--outline">View</a>
                  )}
                  {project.sourceUrl && (
                    <a href={project.sourceUrl} target="_blank" rel="noreferrer" className="btn btn--ghost">Source</a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
