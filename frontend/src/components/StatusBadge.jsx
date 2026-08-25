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
    blue: { bg: '#eff6ff', text: '#2563eb' },
    green: { bg: '#ecfdf5', text: '#059669' },
    amber: { bg: '#fffbeb', text: '#d97706' },
    red: { bg: '#fef2f2', text: '#dc2626' },
    purple: { bg: '#f5f3ff', text: '#7c3aed' },
  };

  const theme = colorMap[color] || colorMap.blue;

  return (
    <div className="metric-card">
      {Icon && (
        <div className="metric-icon" style={{ backgroundColor: theme.bg, color: theme.text }}>
          <Icon size={24} />
        </div>
      )}
      <div className="metric-info">
        <span className="metric-label">{title}</span>
        <span className="metric-value">{value}</span>
        {subtitle && <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>{subtitle}</span>}
      </div>
    </div>
  );
};
