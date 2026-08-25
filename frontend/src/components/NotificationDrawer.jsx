import React from 'react';
import { X, Bell, CheckCheck, Clock, FileText, Calendar, Info } from 'lucide-react';
import { api } from '../services/api';

export const NotificationDrawer = ({ isOpen, onClose, notifications = [], onRefresh }) => {
  if (!isOpen) return null;

  const handleMarkAllRead = async () => {
    try {
      await api.common.markAllNotifsRead();
      onRefresh();
    } catch (e) {
      console.error('Failed to mark all as read', e);
    }
  };

  const handleMarkOneRead = async (id) => {
    try {
      await api.common.markNotifRead(id);
      onRefresh();
    } catch (e) {
      console.error('Failed to mark notification read', e);
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'SUBMISSION': return <FileText size={16} color="#2563eb" />;
      case 'REVIEW': return <CheckCheck size={16} color="#10b981" />;
      case 'PRESENTATION': return <Calendar size={16} color="#7c3aed" />;
      case 'MEETING': return <Clock size={16} color="#d97706" />;
      default: return <Info size={16} color="#64748b" />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={18} color="var(--primary-600)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>Notifications</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {notifications.some((n) => !n.read) && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleMarkAllRead}
                style={{ fontSize: '0.75rem' }}
              >
                Mark all read
              </button>
            )}
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="drawer-body">
          {notifications.length === 0 ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#94a3b8' }}>
              <Bell size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                style={{
                  padding: '0.875rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: notif.read ? 'var(--bg-surface)' : '#eff6ff',
                  border: '1px solid',
                  borderColor: notif.read ? 'var(--border-color)' : '#bfdbfe',
                  marginBottom: '0.75rem',
                  transition: 'all 0.15s ease',
                  cursor: notif.read ? 'default' : 'pointer',
                }}
                onClick={() => !notif.read && handleMarkOneRead(notif.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                    {getCategoryIcon(notif.category)}
                    {notif.title}
                  </div>
                  {!notif.read && (
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb' }}></span>
                  )}
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.4 }}>
                  {notif.message}
                </p>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.375rem' }}>
                  {new Date(notif.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export const Toast = ({ message, type = 'info', onClose }) => {
  if (!message) return null;

  const bgMap = {
    success: '#ecfdf5',
    error: '#fef2f2',
    info: '#eff6ff',
  };

  const borderMap = {
    success: '#a7f3d0',
    error: '#fecaca',
    info: '#bfdbfe',
  };

  const textMap = {
    success: '#065f46',
    error: '#991b1b',
    info: '#1e40af',
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 100,
        backgroundColor: bgMap[type] || bgMap.info,
        border: `1px solid ${borderMap[type] || borderMap.info}`,
        color: textMap[type] || textMap.info,
        padding: '0.875rem 1.25rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        maxWidth: '400px',
      }}
    >
      <span style={{ fontSize: '0.875rem', fontWeight: 500, flex: 1 }}>{message}</span>
      {onClose && (
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
          <X size={16} />
        </button>
      )}
    </div>
  );
};
