import React from 'react';
import { Check, Clock, AlertTriangle, Circle, Calendar, ShieldCheck, ChevronRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '../utils/dateUtils';

export const ProjectStepper = ({ milestones = [] }) => {
  if (!milestones || milestones.length === 0) {
    return (
      <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No milestones configured for this academic project cycle.
      </div>
    );
  }

  // Find first uncompleted index to highlight active step
  const activeIndex = milestones.findIndex((m) => m.status !== 'COMPLETED');

  return (
    <div className="stepper-roadmap" style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative' }}>
      {milestones.map((step, index) => {
        const isCompleted = step.status === 'COMPLETED';
        const isDelayed = step.status === 'DELAYED';
        const isCorrection = step.status === 'CORRECTION_REQUIRED';
        const isCurrent = activeIndex === index || step.status === 'UNDER_REVIEW' || step.status === 'IN_PROGRESS';
        const isLast = index === milestones.length - 1;

        // Badge styling & icon
        let badgeBg = 'var(--bg-subtle)';
        let badgeColor = 'var(--text-muted)';
        let badgeBorder = 'var(--border-color)';
        let iconContent = index + 1;

        if (isCompleted) {
          badgeBg = '#10b981';
          badgeColor = '#ffffff';
          badgeBorder = '#10b981';
          iconContent = <Check size={16} strokeWidth={3} />;
        } else if (isDelayed || isCorrection) {
          badgeBg = '#ef4444';
          badgeColor = '#ffffff';
          badgeBorder = '#ef4444';
          iconContent = <AlertTriangle size={15} />;
        } else if (isCurrent) {
          badgeBg = 'var(--primary-500)';
          badgeColor = '#ffffff';
          badgeBorder = 'var(--primary-500)';
          iconContent = <Clock size={15} />;
        }

        // Connecting Line Color
        const lineBg = isCompleted ? '#10b981' : isCurrent ? 'var(--primary-500)' : 'var(--border-color)';

        return (
          <div
            key={step.id || index}
            style={{
              display: 'flex',
              gap: '1.25rem',
              position: 'relative',
              paddingBottom: isLast ? '0' : '1.5rem',
            }}
          >
            {/* Left Stepper Indicator & Connecting Line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: badgeBg,
                  color: badgeColor,
                  border: `2px solid ${badgeBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  zIndex: 2,
                  boxShadow: isCurrent
                    ? '0 0 0 4px rgba(14, 165, 233, 0.25)'
                    : isCompleted
                    ? '0 0 0 3px rgba(16, 185, 129, 0.2)'
                    : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {iconContent}
              </div>

              {!isLast && (
                <div
                  style={{
                    position: 'absolute',
                    top: '36px',
                    bottom: '0',
                    width: '3px',
                    backgroundColor: lineBg,
                    zIndex: 1,
                    borderRadius: '2px',
                  }}
                />
              )}
            </div>

            {/* Right Milestone Content Card */}
            <div
              style={{
                flex: 1,
                backgroundColor: isCurrent
                  ? 'rgba(14, 165, 233, 0.04)'
                  : isCompleted
                  ? 'rgba(16, 185, 129, 0.03)'
                  : 'var(--bg-subtle)',
                border: '1px solid',
                borderColor: isCurrent
                  ? 'rgba(14, 165, 233, 0.3)'
                  : isCompleted
                  ? 'rgba(16, 185, 129, 0.2)'
                  : 'var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {step.order ? `${step.order}. ` : `${index + 1}. `}
                    {step.title}
                  </span>
                  {isCurrent && (
                    <span className="badge badge-info" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>
                      Current Stage
                    </span>
                  )}
                </div>

                <StatusBadge status={step.status} />
              </div>

              {step.description && (
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '0 0 0.75rem 0', lineHeight: 1.45 }}>
                  {step.description}
                </p>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {step.deadline && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} style={{ color: isDelayed ? '#ef4444' : 'var(--text-muted)' }} />
                    <strong style={{ color: isDelayed ? '#ef4444' : 'var(--text-main)' }}>Deadline:</strong>{' '}
                    <span style={{ color: isDelayed ? '#ef4444' : 'inherit' }}>{formatDate(step.deadline)}</span>
                  </span>
                )}

                {step.completedAt && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: 700 }}>
                    <ShieldCheck size={13} />
                    <strong>Verified & Completed:</strong> {formatDate(step.completedAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
