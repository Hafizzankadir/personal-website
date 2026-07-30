import { useEffect, useState } from 'react';
import { getPhilosophy, savePhilosophy } from '../../../lib/content';
import { isFirebaseConfigured } from '../../../lib/firebase';

export default function PhilosophyAdmin() {
  const [loading, setLoading] = useState(true);
  const [docId, setDocId] = useState(null);
  const [guidingPrinciple, setGuidingPrinciple] = useState('');
  const [frameworks, setFrameworks] = useState([]);
  const [applications, setApplications] = useState({ markets: '', building: '', life: '' });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    getPhilosophy().then((result) => {
      setDocId(result.id ?? null);
      setGuidingPrinciple(result.guidingPrinciple ?? '');
      setFrameworks(result.frameworks ?? []);
      setApplications(result.applications ?? { markets: '', building: '', life: '' });
      setLoading(false);
    });
  }, []);

  function updateFramework(index, field, value) {
    setFrameworks((prev) => prev.map((fw, i) => (i === index ? { ...fw, [field]: value } : fw)));
  }

  function addFramework() {
    setFrameworks((prev) => [...prev, { title: '', description: '' }]);
  }

  function removeFramework(index) {
    setFrameworks((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { guidingPrinciple, frameworks, applications };
    try {
      await savePhilosophy(docId, payload);
      setStatus({ type: 'success', message: 'Saved to Firestore.' });
    } catch {
      setStatus({ type: 'demo', message: 'Firebase not connected — changes are not persisted.' });
    }
  }

  if (loading) return <div className="loading-state">Loading…</div>;

  return (
    <div>
      <h1 className="admin-section-title">Philosophy</h1>
      <p className="admin-section-subtitle">Edit the guiding principle, decision frameworks, and applied examples.</p>

      <form onSubmit={handleSubmit}>
        <div className="card admin-form-card">
          <span className="section-label">Guiding Principle</span>
          <div className="field" style={{ marginTop: 14 }}>
            <textarea value={guidingPrinciple} onChange={(e) => setGuidingPrinciple(e.target.value)} />
          </div>
        </div>

        <div className="card admin-form-card">
          <div className="card-header">
            <span className="section-label">Frameworks</span>
            <button type="button" className="btn btn--ghost" onClick={addFramework}>+ Add Entry</button>
          </div>
          {frameworks.map((fw, i) => (
            <div key={i} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid var(--color-border)' }}>
              <div className="field">
                <label>Title {i + 1}</label>
                <input value={fw.title} onChange={(e) => updateFramework(i, 'title', e.target.value)} />
              </div>
              <div className="field">
                <label>Description</label>
                <textarea value={fw.description} onChange={(e) => updateFramework(i, 'description', e.target.value)} />
              </div>
              <button type="button" className="btn btn--outline" onClick={() => removeFramework(i)}>Remove</button>
            </div>
          ))}
          {frameworks.length === 0 && <p className="text-tertiary" style={{ fontSize: 13 }}>No framework entries yet.</p>}
        </div>

        <div className="card admin-form-card">
          <span className="section-label">How This Shapes Decisions</span>
          <div className="field" style={{ marginTop: 14 }}>
            <label>Markets</label>
            <textarea value={applications.markets} onChange={(e) => setApplications({ ...applications, markets: e.target.value })} />
          </div>
          <div className="field">
            <label>Building</label>
            <textarea value={applications.building} onChange={(e) => setApplications({ ...applications, building: e.target.value })} />
          </div>
          <div className="field">
            <label>Life</label>
            <textarea value={applications.life} onChange={(e) => setApplications({ ...applications, life: e.target.value })} />
          </div>
        </div>

        {status && (
          <p className={status.type === 'success' ? 'admin-success-note' : 'admin-demo-note'}>{status.message}</p>
        )}
        <button type="submit" className="btn">Save Changes</button>
      </form>

      {!isFirebaseConfigured && (
        <p className="text-tertiary" style={{ fontSize: 12.5, marginTop: 14 }}>
          Connect Firebase to persist philosophy content to Firestore.
        </p>
      )}
    </div>
  );
}
