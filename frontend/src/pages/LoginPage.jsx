import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, FolderGit2, AlertCircle, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const user = await login(username.trim(), password);
      if (user.role === 'ROLE_PROJECT_HEAD') {
        navigate('/head/dashboard');
      } else if (user.role === 'ROLE_GUIDE') {
        navigate('/guide/dashboard');
      } else if (user.role === 'ROLE_STUDENT') {
        navigate('/student/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (u, p) => {
    setUsername(u);
    setPassword(p);
    setError('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        padding: '1.5rem',
        backgroundImage: 'radial-gradient(circle at 50% 20%, #1e3a8a 0%, #0f172a 70%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
          padding: '2.5rem',
        }}
      >
        {/* Portal Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
            }}
          >
            <FolderGit2 size={32} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            PROJECT MONITORING SYSTEM
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
            Academic Capstone & Lifecycle Monitoring Platform
          </p>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
              padding: '0.875rem 1rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Enter assigned username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
              <input
                type="password"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Enter account password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.9375rem', fontWeight: 600, marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Demo Credentials Section */}
        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid #e2e8f0',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>
            Predefined Demo Accounts (Click to Fill)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem' }}
              onClick={() => handleQuickFill('projecthead', 'Project@123')}
            >
              <span><strong>Project Head:</strong> projecthead</span>
              <span style={{ color: '#2563eb' }}>Project@123</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem' }}
              onClick={() => handleQuickFill('guide_jawandhiya', 'Guide@123')}
            >
              <span><strong>Guide:</strong> guide_jawandhiya (Dr. P. M. Jawandhiya)</span>
              <span style={{ color: '#2563eb' }}>Guide@123</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem' }}
              onClick={() => handleQuickFill('student01', 'Student@123')}
            >
              <span><strong>Student (GL):</strong> student01 (Govind Panajkar - Grp 1)</span>
              <span style={{ color: '#2563eb' }}>Student@123</span>
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', fontSize: '0.8125rem', color: '#94a3b8', textAlign: 'center' }}>
        Institutional Project Monitoring & Evaluation System &bull; Academic Year 2026-27
      </div>
    </div>
  );
};
