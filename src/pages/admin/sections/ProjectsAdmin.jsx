import { useEffect, useState } from 'react';
import { getProjects, addProject, updateProject, deleteProject } from '../../../lib/content';
import { isFirebaseConfigured } from '../../../lib/firebase';

const EMPTY_FORM = {
  title: '',
  category: '',
  description: '',
  techStackText: '',
  viewUrl: '',
  sourceUrl: '',
  screenshot: '',
};

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    getProjects().then((result) => {
      setProjects(result);
      setLoading(false);
    });
  }, []);

  function startEdit(project) {
    setEditingId(project.id);
    setForm({
      title: project.title,
      category: project.category,
      description: project.description,
      techStackText: (project.techStack ?? []).join(', '),
      viewUrl: project.viewUrl ?? '',
      sourceUrl: project.sourceUrl ?? '',
      screenshot: project.screenshot ?? '',
    });
    setStatus(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.category.trim()) return;

    const payload = {
      title: form.title,
      category: form.category,
      description: form.description,
      techStack: form.techStackText.split(',').map((v) => v.trim()).filter(Boolean),
      viewUrl: form.viewUrl || null,
      sourceUrl: form.sourceUrl || null,
      screenshot: form.screenshot || null,
    };

    if (editingId) {
      try {
        await updateProject(editingId, payload);
        setStatus({ type: 'success', message: 'Updated in Firestore.' });
      } catch {
        setStatus({ type: 'demo', message: 'Firebase not connected — updated locally for preview only.' });
      }
      setProjects((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...payload } : p)));
      cancelEdit();
    } else {
      const draft = { id: `local-${Date.now()}`, ...payload };
      try {
        const id = await addProject(payload);
        draft.id = id;
        setStatus({ type: 'success', message: 'Added to Firestore.' });
      } catch {
        setStatus({ type: 'demo', message: 'Firebase not connected — added locally for preview only.' });
      }
      setProjects((prev) => [draft, ...prev]);
      setForm(EMPTY_FORM);
    }
  }

  async function handleDelete(id) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) cancelEdit();
    try {
      await deleteProject(id);
    } catch {
      // demo mode — local removal only
    }
  }

  return (
    <div>
      <h1 className="admin-section-title">Projects</h1>
      <p className="admin-section-subtitle">Add a new project to the showcase, or edit/remove an existing one.</p>

      <div className="card admin-form-card">
        <form onSubmit={handleSubmit}>
          <div className="admin-form-row">
            <div className="field">
              <label htmlFor="proj-title">Title</label>
              <input id="proj-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="field">
              <label htmlFor="proj-category">Category</label>
              <input id="proj-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="proj-description">Description</label>
            <textarea id="proj-description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="proj-tech">Tech stack (comma-separated)</label>
            <input id="proj-tech" value={form.techStackText} onChange={(e) => setForm({ ...form, techStackText: e.target.value })} placeholder="React, Firebase, Python" />
          </div>
          <div className="admin-form-row">
            <div className="field">
              <label htmlFor="proj-view">View URL</label>
              <input id="proj-view" value={form.viewUrl} onChange={(e) => setForm({ ...form, viewUrl: e.target.value })} placeholder="https://…" />
            </div>
            <div className="field">
              <label htmlFor="proj-source">Source URL</label>
              <input id="proj-source" value={form.sourceUrl} onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })} placeholder="https://github.com/…" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="proj-screenshot">Screenshot URL (optional)</label>
            <input id="proj-screenshot" value={form.screenshot} onChange={(e) => setForm({ ...form, screenshot: e.target.value })} placeholder="https://…" />
          </div>

          {status && (
            <p className={status.type === 'success' ? 'admin-success-note' : 'admin-demo-note'}>{status.message}</p>
          )}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn">{editingId ? 'Update Project' : 'Add Project'}</button>
            {editingId && <button type="button" className="btn btn--outline" onClick={cancelEdit}>Cancel</button>}
          </div>
        </form>
      </div>

      <h2 className="admin-list-title section-label">Existing Projects</h2>
      {loading ? (
        <div className="loading-state">Loading…</div>
      ) : (
        <div className="admin-entry-list">
          {projects.map((project) => (
            <div className="admin-entry-row" key={project.id}>
              <div className="admin-entry-main">
                <span className="admin-entry-title">{project.title}</span>
                <span className="admin-entry-meta">{project.category}</span>
              </div>
              <div className="admin-entry-actions">
                <button type="button" className="btn btn--outline" onClick={() => startEdit(project)}>Edit</button>
                <button type="button" className="btn btn--outline" onClick={() => handleDelete(project.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isFirebaseConfigured && (
        <p className="text-tertiary" style={{ fontSize: 12.5, marginTop: 14 }}>
          Connect Firebase to persist project changes to Firestore.
        </p>
      )}
    </div>
  );
}
