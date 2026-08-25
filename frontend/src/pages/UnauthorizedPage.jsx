import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const UnauthorizedPage = () => {
  const { user } = useAuth();

  const getHomeLink = () => {
    if (user?.role === 'ROLE_PROJECT_HEAD') return '/head/dashboard';
    if (user?.role === 'ROLE_GUIDE') return '/guide/dashboard';
    if (user?.role === 'ROLE_STUDENT') return '/student/dashboard';
    return '/login';
  };

  return (
    <div style={{ textAlign: 'center', padding: '4rem 1.5rem', maxWidth: '500px', margin: '0 auto' }}>
      <div
        style={{
          width: '64px',
          height: '64px',
          backgroundColor: '#fef2f2',
          color: '#ef4444',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto',
        }}
      >
        <ShieldAlert size={36} />
      </div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>Access Denied</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '2rem' }}>
        You do not have the required role permissions to access this page. Institutional role boundaries are strictly enforced.
      </p>
      <Link to={getHomeLink()} className="btn btn-primary" style={{ display: 'inline-flex' }}>
        <ArrowLeft size={18} /> Return to Dashboard
      </Link>
    </div>
  );
};
