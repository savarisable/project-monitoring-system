import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CollegeEmblem } from '../assets/branding.jsx';
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
      const cleanUsername = username.trim().replace(/^@+/, '');
      const user = await login(cleanUsername, password);
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
        backgroundColor: '#090d16',
        padding: '1.5rem',
        backgroundImage: 'radial-gradient(circle at 50% 15%, rgba(56, 189, 248, 0.15) 0%, rgba(15, 23, 42, 0.98) 60%, #030712 100%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.15)',
          padding: '2.5rem',
        }}
      >
        {/* Portal Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: '#fff7ed',
              border: '2px solid #ea580c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
              boxShadow: '0 10px 25px -5px rgba(234, 88, 12, 0.4)',
              overflow: 'hidden',
            }}
          >
            <CollegeEmblem size={64} />
          </div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>
            P. R. Pote Patil College of Engineering & Management
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.875rem' }}>
            An Autonomous Institute, Amravati &bull; <strong style={{ color: '#10b981' }}>NAAC A++</strong>
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            PROJECT MONITORING SYSTEM
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.25rem' }}>
            Department of Computer Science & Engineering
          </p>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
              padding: '0.875rem 1rem',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0, color: '#ef4444' }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ color: '#e2e8f0', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
              <input
                type="text"
                className="form-control"
                style={{
                  paddingLeft: '2.5rem',
                  backgroundColor: '#1e293b',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '0.9375rem',
                }}
                placeholder="Enter username (e.g. projecthead)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ color: '#e2e8f0', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
              <input
                type="password"
                className="form-control"
                style={{
                  paddingLeft: '2.5rem',
                  backgroundColor: '#1e293b',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '0.9375rem',
                }}
                placeholder="Enter account password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.9375rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
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
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center', letterSpacing: '0.05em' }}>
            Predefined Demo Accounts (Click to Fill)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.625rem 0.875rem',
                backgroundColor: '#1e293b',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                color: '#ffffff',
              }}
              onClick={() => handleQuickFill('projecthead', 'Project@123')}
            >
              <span>
                <strong style={{ color: '#38bdf8' }}>Project Head:</strong> <span style={{ color: '#f8fafc', marginLeft: '4px' }}>Prof. A. D. Chokhat</span>
              </span>
              <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.8125rem' }}>Project@123</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.625rem 0.875rem',
                backgroundColor: '#1e293b',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                color: '#ffffff',
              }}
              onClick={() => handleQuickFill('guide_jawandhiya', 'Guide@123')}
            >
              <span>
                <strong style={{ color: '#c084fc' }}>Guide:</strong> <span style={{ color: '#f8fafc', marginLeft: '4px' }}>Dr. P. M. Jawandhiya</span>
              </span>
              <span style={{ color: '#c084fc', fontWeight: 700, fontSize: '0.8125rem' }}>Guide@123</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.625rem 0.875rem',
                backgroundColor: '#1e293b',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                color: '#ffffff',
              }}
              onClick={() => handleQuickFill('student01', 'Student@123')}
            >
              <span>
                <strong style={{ color: '#34d399' }}>Student:</strong> <span style={{ color: '#f8fafc', marginLeft: '4px' }}>Govind (Group 1)</span>
              </span>
              <span style={{ color: '#34d399', fontWeight: 700, fontSize: '0.8125rem' }}>Student@123</span>
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', fontSize: '0.8125rem', color: '#64748b', textAlign: 'center' }}>
        Institutional Project Monitoring & Evaluation System &bull; Academic Year 2026-27
      </div>
    </div>
  );
};
