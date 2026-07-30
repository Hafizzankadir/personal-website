import { Link } from 'react-router-dom';
import './Home.css';

const TARGET_ROLES = [
  { title: 'Equity Research', primary: true },
  { title: 'Investment Analyst', primary: true },
  { title: 'Portfolio / Risk Analytics', primary: true },
  { title: 'Quantitative / Data Roles', primary: false },
  { title: 'Product & Data-Adjacent Tech', primary: false },
];

const SKILLS = [
  {
    category: 'Financial Modeling',
    items: ['Three-statement modeling', 'DCF & comps valuation', 'Scenario / sensitivity analysis'],
  },
  {
    category: 'Excel',
    items: ['Advanced formulas & VBA', 'Dashboard design', 'Data automation'],
  },
  {
    category: 'Power BI',
    items: ['DAX measures', 'Live-connected dashboards', 'Data modeling'],
  },
  {
    category: 'Python',
    items: ['pandas / NumPy', 'Backtesting & quant research', 'API data pipelines'],
  },
  {
    category: 'Web Development',
    items: ['React / JavaScript', 'Firebase', 'Full-stack product builds'],
  },
];

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
  return (
    <div className="page home-page">
      <section className="hero">
        <span className="section-label section-label--accent">Trader / Analyst / Builder</span>
        <h1 className="hero-title">Hafizzan Kadir</h1>
        <p className="hero-lede">
          I trade markets systematically, publish the results in full, and build the tools I use
          to do it. This site is a transparent, public record — real name, real data, real track
          record — built for the trading community and for recruiters evaluating investment and
          analytics-focused roles.
        </p>
        <div className="hero-actions">
          <Link to="/journal" className="btn">View Trading Journal</Link>
          <Link to="/projects" className="btn btn--outline">See Projects</Link>
        </div>
      </section>

      <section className="home-section">
        <span className="section-label">Target Roles</span>
        <div className="roles-row">
          {TARGET_ROLES.map((role) => (
            <span key={role.title} className={role.primary ? 'tag tag--accent' : 'tag'}>
              {role.title}
            </span>
          ))}
        </div>
        <p className="text-secondary roles-note">
          Primarily seeking investment-focused roles — open to adjacent analytics, data, and
          technical positions where the same skill set applies.
        </p>
      </section>

      <section className="home-section">
        <span className="section-label">Skill Categories</span>
        <div className="grid grid-5 skills-grid">
          {SKILLS.map((skill) => (
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
