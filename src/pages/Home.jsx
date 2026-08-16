import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHomeContent } from '../lib/content';
import headshot from '../assets/Headshot.jpg';
import './Home.css';

const PILLARS = [
  {
    num: '02',
    title: 'Financial Market Journal',
    description: 'Live trading journal, market outlook, and trade ideas — real positions, real numbers.',
    path: '/journal',
  },
  {
    num: '03',
    title: 'Philosophy',
    description: 'The systems-thinking framework behind every market and life decision.',
    path: '/philosophy',
  },
  {
    num: '04',
    title: 'Knowledge Hub',
    description: 'A running log of books, concepts, and ideas being studied and applied.',
    path: '/knowledge',
  },
  {
    num: '05',
    title: 'Projects',
    description: 'Tools and systems built — from backtesting engines to this site itself.',
    path: '/projects',
  },
];

export default function Home() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getHomeContent().then((result) => {
      if (!cancelled) {
        setContent(result);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || !content) return <div className="loading-state">Loading…</div>;

  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-copy">
          <span className="section-label section-label--accent">{content.heroTagline}</span>
          <h1 className="hero-title">{content.heroTitle}</h1>
          <p className="hero-lede">{content.heroLede}</p>
          <div className="hero-actions">
            <a href={content.resumeUrl || '#'} target="_blank" rel="noreferrer" className="btn">View Resume</a>
            <Link to="/projects" className="btn btn--outline">See Projects</Link>
          </div>
        </div>
        <div className="hero-portrait">
          <img src={headshot} alt={content.heroTitle} />
        </div>
      </section>

      <section className="home-section">
        <span className="section-label">Target Roles</span>
        <div className="roles-row">
          {content.targetRoles.map((role) => (
            <span key={role.title} className={role.primary ? 'tag tag--accent' : 'tag'}>
              {role.title}
            </span>
          ))}
        </div>
        <p className="text-secondary roles-note">{content.rolesNote}</p>
      </section>

      <section className="home-section">
        <span className="section-label">Skill Categories</span>
        <div className="grid grid-5 skills-grid">
          {content.skills.map((skill) => (
            <div key={skill.category} className="card skill-card">
              <h3 className="skill-card-title">{skill.category}</h3>
              <ul className="skill-card-list">
                {skill.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section">
        <span className="section-label">Explore</span>
        <div className="grid grid-4 pillars-grid">
          {PILLARS.map((pillar) => (
            <Link key={pillar.path} to={pillar.path} className="card pillar-card">
              <span className="pillar-num text-mono">{pillar.num}</span>
              <h3 className="pillar-title">{pillar.title}</h3>
              <p className="text-secondary pillar-desc">{pillar.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
