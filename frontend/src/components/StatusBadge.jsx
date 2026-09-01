import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toUpperCase().replace(/\s+/g, '_');

  let badgeClass = 'badge-neutral';
  let label = status.replace(/_/g, ' ');

  switch (normalized) {
    case 'COMPLETED':
    case 'VERIFIED':
    case 'APPROVED':
    case 'PRESENT':
    case 'ACTIVE':
      badgeClass = 'badge-success';
      break;

    case 'ON_TRACK':
    case 'IN_PROGRESS':
    case 'ONLINE_SUBMITTED':
    case 'SUBMITTED':
    case 'SCHEDULED':
      badgeClass = 'badge-info';
      break;

    case 'UNDER_REVIEW':
    case 'OFFLINE_SUBMITTED':
    case 'PENDING':
    case 'MEDIUM':
      badgeClass = 'badge-warning';
      break;

    case 'CORRECTION_REQUIRED':
    case 'DELAYED':
    case 'HIGH':
    case 'URGENT':
    case 'NOT_ATTENDED':
    case 'CANCELLED':
      badgeClass = 'badge-danger';
      break;

    default:
      badgeClass = 'badge-neutral';
  }

  return <span className={`badge ${badgeClass}`}>{label}</span>;
};

export const StatCard = ({ title, value, icon: Icon, color = 'blue', subtitle }) => {
  const colorMap = {
    blue: { bg: 'rgba(56, 189, 248, 0.15)', text: 'var(--primary-500)' },
    green: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' },
    amber: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' },
    red: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' },
    purple: { bg: 'rgba(168, 85, 247, 0.15)', text: '#a855f7' },
  };

  const cTheme = colorMap[color] || colorMap.blue;

  return (
    <div className="stat-card" style={{ borderTop: `3px solid ${cTheme.text}` }}>
      {Icon && (
        <div className="stat-icon" style={{ backgroundColor: cTheme.bg, color: cTheme.text }}>
          <Icon size={24} />
        </div>
      )}
      <div className="stat-info">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
};
