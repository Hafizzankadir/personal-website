import { useEffect, useState } from 'react';
import { getHomeContent, saveHomeContent } from '../../../lib/content';
import { isFirebaseConfigured } from '../../../lib/firebase';

export default function HomeAdmin() {
  const [loading, setLoading] = useState(true);
  const [heroTagline, setHeroTagline] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroLede, setHeroLede] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [targetRoles, setTargetRoles] = useState([]);
  const [rolesNote, setRolesNote] = useState('');
  const [skills, setSkills] = useState([]);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    getHomeContent().then((result) => {
      setHeroTagline(result.heroTagline ?? '');
      setHeroTitle(result.heroTitle ?? '');
      setHeroLede(result.heroLede ?? '');
      setResumeUrl(result.resumeUrl ?? '');
      setTargetRoles(result.targetRoles ?? []);
      setRolesNote(result.rolesNote ?? '');
      setSkills((result.skills ?? []).map((s) => ({ ...s, itemsText: s.items.join('\n') })));
      setLoading(false);
    });
  }, []);

  function updateRole(index, field, value) {
    setTargetRoles((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  }

  function addRole() {
    setTargetRoles((prev) => [...prev, { title: '', primary: false }]);
  }

  function removeRole(index) {
    setTargetRoles((prev) => prev.filter((_, i) => i !== index));
  }

  function updateSkill(index, field, value) {
    setSkills((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  function addSkill() {
    setSkills((prev) => [...prev, { category: '', itemsText: '' }]);
  }

  function removeSkill(index) {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      heroTagline,
      heroTitle,
      heroLede,
      resumeUrl,
      targetRoles,
      rolesNote,
      skills: skills.map((s) => ({
        category: s.category,
        items: s.itemsText.split('\n').map((v) => v.trim()).filter(Boolean),
      })),
    };
    try {
      await saveHomeContent(payload);
      setStatus({ type: 'success', message: 'Saved to Firestore.' });
    } catch {
      setStatus({ type: 'demo', message: 'Firebase not connected — changes are not persisted.' });
    }
  }

  if (loading) return <div className="loading-state">Loading…</div>;

  return (
    <div>
      <h1 className="admin-section-title">Home</h1>
      <p className="admin-section-subtitle">Edit the hero intro, target roles, and skill categories shown on the home page.</p>

      <form onSubmit={handleSubmit}>
        <div className="card admin-form-card">
          <span className="section-label">Hero</span>
          <div className="field" style={{ marginTop: 14 }}>
            <label>Tagline</label>
            <input value={heroTagline} onChange={(e) => setHeroTagline(e.target.value)} />
          </div>
          <div className="field">
            <label>Title</label>
            <input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
          </div>
          <div className="field">
            <label>Lede</label>
            <textarea value={heroLede} onChange={(e) => setHeroLede(e.target.value)} />
          </div>
          <div className="field">
            <label>Resume URL</label>
            <input
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="https://…"
            />
            <p className="text-tertiary" style={{ fontSize: 12, marginTop: 2 }}>
              Powers the "View Resume" button on the home page — link to a hosted PDF (Google Drive, Dropbox, etc.).
            </p>
          </div>
        </div>

        <div className="card admin-form-card">
          <div className="card-header">
            <span className="section-label">Target Roles</span>
            <button type="button" className="btn btn--ghost" onClick={addRole}>+ Add Role</button>
          </div>
          {targetRoles.map((role, i) => (
            <div key={i} className="admin-inline-row">
              <input
                value={role.title}
                onChange={(e) => updateRole(i, 'title', e.target.value)}
                placeholder="Role title"
                style={{ flex: 1 }}
              />
              <label className={'checkbox-chip' + (role.primary ? ' is-checked' : '')}>
                <input
                  type="checkbox"
                  checked={role.primary}
                  onChange={(e) => updateRole(i, 'primary', e.target.checked)}
                  style={{ display: 'none' }}
                />
                Primary
              </label>
              <button type="button" className="btn btn--outline" onClick={() => removeRole(i)}>Remove</button>
            </div>
          ))}
          {targetRoles.length === 0 && <p className="text-tertiary" style={{ fontSize: 13 }}>No roles yet.</p>}
          <div className="field" style={{ marginTop: 16 }}>
            <label>Roles note</label>
            <textarea value={rolesNote} onChange={(e) => setRolesNote(e.target.value)} />
          </div>
        </div>

        <div className="card admin-form-card">
          <div className="card-header">
            <span className="section-label">Skill Categories</span>
            <button type="button" className="btn btn--ghost" onClick={addSkill}>+ Add Category</button>
          </div>
          {skills.map((skill, i) => (
            <div key={i} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid var(--color-border)' }}>
              <div className="field">
                <label>Category {i + 1}</label>
                <input value={skill.category} onChange={(e) => updateSkill(i, 'category', e.target.value)} />
              </div>
              <div className="field">
                <label>Items (one per line)</label>
                <textarea value={skill.itemsText} onChange={(e) => updateSkill(i, 'itemsText', e.target.value)} />
              </div>
              <button type="button" className="btn btn--outline" onClick={() => removeSkill(i)}>Remove</button>
            </div>
          ))}
          {skills.length === 0 && <p className="text-tertiary" style={{ fontSize: 13 }}>No skill categories yet.</p>}
        </div>

        {status && (
          <p className={status.type === 'success' ? 'admin-success-note' : 'admin-demo-note'}>{status.message}</p>
        )}
        <button type="submit" className="btn">Save Changes</button>
      </form>

      {!isFirebaseConfigured && (
        <p className="text-tertiary" style={{ fontSize: 12.5, marginTop: 14 }}>
          Connect Firebase to persist home page content to Firestore.
        </p>
      )}
    </div>
  );
}
