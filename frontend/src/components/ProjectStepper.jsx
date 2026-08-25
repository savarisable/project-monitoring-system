import React from 'react';
import { Check, Clock, AlertTriangle, Circle } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const ProjectStepper = ({ milestones = [] }) => {
  if (!milestones || milestones.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
        No milestones configured for this project.
      </div>
    );
  }

  return (
    <div className="stepper-container">
      {milestones.map((step, index) => {
        const isCompleted = step.status === 'COMPLETED';
        const isDelayed = step.status === 'DELAYED';
        const isCorrection = step.status === 'CORRECTION_REQUIRED';
        const isUnderReview = step.status === 'UNDER_REVIEW' || step.status === 'SUBMITTED';

        let stepClass = 'step-pending';
        let IconComponent = Circle;

        if (isCompleted) {
          stepClass = 'step-completed';
          IconComponent = Check;
        } else if (isDelayed) {
          stepClass = 'step-delayed';
          IconComponent = AlertTriangle;
        } else if (isCorrection) {
          stepClass = 'step-delayed';
          IconComponent = AlertTriangle;
        } else if (isUnderReview || step.status === 'IN_PROGRESS' || step.status === 'PENDING') {
          // Check if this is the first non-completed step (Current)
          const firstUncompleted = milestones.findIndex((m) => m.status !== 'COMPLETED');
          if (firstUncompleted === index) {
            stepClass = 'step-current';
            IconComponent = Clock;
          }
        }

        return (
          <div key={step.id || index} className={`step-item ${stepClass}`}>
            <div className="step-indicator">
              <IconComponent size={16} />
            </div>
            <div className="step-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="step-title">
                  {step.order ? `${step.order}. ` : `${index + 1}. `}
                  {step.title}
                </span>
                <StatusBadge status={step.status} />
              </div>
              {step.description && <p className="step-meta">{step.description}</p>}
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                {step.deadline && (
                  <span>
                    <strong>Deadline:</strong> {new Date(step.deadline).toLocaleDateString()}
                  </span>
                )}
                {step.completedAt && (
                  <span style={{ color: '#059669' }}>
                    <strong>Completed:</strong> {new Date(step.completedAt).toLocaleDateString()}
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
