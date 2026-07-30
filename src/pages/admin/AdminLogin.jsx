import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

export default function AdminLogin() {
  const { user, login, isDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/admin/dashboard" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-login-page">
      <div className="card admin-login-card">
        <Link to="/" className="text-mono text-tertiary admin-back-link">← Back to site</Link>
        <span className="section-label section-label--accent">Admin</span>
        <h1 className="admin-login-title">Sign in</h1>

        {isDemo && (
          <p className="admin-demo-note">
            Firebase isn't connected yet, so this is running in demo mode — any email/password
            combination will unlock the panel with mock data.
          </p>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="admin-error">{error}</p>}
          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
