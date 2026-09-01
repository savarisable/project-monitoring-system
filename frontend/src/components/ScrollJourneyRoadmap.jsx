import React, { useRef, useState, useEffect } from 'react';
import {
  Flag,
  CheckCircle2,
  Clock,
  Award,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileCheck2,
  Code2,
  Presentation,
  ShieldCheck,
  GraduationCap,
  Layers,
} from 'lucide-react';

export const ScrollJourneyRoadmap = ({ milestones = [], progressPercentage = 0 }) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  // Default rich stages if milestones array is empty
  const defaultStages = [
    {
      order: 1,
      title: 'Guide Allocation',
      subtitle: 'Faculty Advisor Assigned',
      desc: 'Project Head assigns your departmental faculty guide based on project domain & specialization.',
      status: 'COMPLETED',
      icon: GraduationCap,
      color: '#8b5cf6',
    },
    {
      order: 2,
      title: 'Synopsis Submission',
      subtitle: 'Project Scope & SRS',
      desc: 'Team submits project problem statement, objectives, tech stack, and architectural diagram.',
      status: 'COMPLETED',
      icon: FileCheck2,
      color: '#ec4899',
    },
    {
      order: 3,
      title: 'Synopsis Verification',
      subtitle: 'Faculty Quality Review',
      desc: 'Guide reviews feasibility, proposes scope corrections, and approves formal commencement.',
      status: 'COMPLETED',
      icon: ShieldCheck,
      color: '#3b82f6',
    },
    {
      order: 4,
      title: 'Development Phase 1',
      subtitle: 'Core Modules & UI Mockups',
      desc: 'Database design, authentication, core API implementation, and UI screenshots upload.',
      status: 'IN_PROGRESS',
      icon: Code2,
      color: '#f59e0b',
    },
    {
      order: 5,
      title: 'Stage 1 Presentation',
      subtitle: 'Internal Evaluation & Scoring',
      desc: 'Demonstration of initial working prototype and SRS review in front of the project panel.',
      status: 'PENDING',
      icon: Presentation,
      color: '#10b981',
    },
    {
      order: 6,
      title: 'Development Phase 2',
      subtitle: 'Integration & Testing',
      desc: 'Full backend-frontend integration, test cases, and video recording of demo features.',
      status: 'PENDING',
      icon: Layers,
      color: '#6366f1',
    },
    {
      order: 7,
      title: 'Final Dissertation & Viva',
      subtitle: 'Capstone Defense & Honors',
      desc: 'Final project report submission, external viva evaluation, and capstone completion certificate.',
      status: 'PENDING',
      icon: Award,
      color: '#ec4899',
    },
  ];

  const stages = milestones && milestones.length > 0
    ? milestones.map((m, idx) => {
        const icons = [GraduationCap, FileCheck2, ShieldCheck, Code2, Presentation, Layers, Award];
        const colors = ['#8b5cf6', '#ec4899', '#3b82f6', '#f59e0b', '#10b981', '#6366f1', '#ec4899'];
        return {
          order: m.order || idx + 1,
          title: m.title,
          subtitle: m.status === 'COMPLETED' ? 'Milestone Achieved' : m.status === 'IN_PROGRESS' ? 'Currently Active' : 'Upcoming Stage',
          desc: m.description || 'Deliver project documentation, code implementation and stage progress.',
          status: m.status || 'PENDING',
          icon: icons[idx % icons.length],
          color: colors[idx % colors.length],
        };
      })
    : defaultStages;

  // Handle horizontal scroll & wheel navigation
  const handleScroll = () => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      const progress = (scrollLeft / maxScroll) * 100;
      setScrollProgress(progress);
      const stepIndex = Math.min(
        stages.length - 1,
        Math.floor((scrollLeft / maxScroll) * stages.length)
      );
      setActiveStep(stepIndex);
    }
  };

  const scrollBy = (offset) => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        marginTop: '2rem',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-surface) 50%, var(--bg-subtle) 100%)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
        overflow: 'hidden',
        position: 'relative',
        padding: '2.5rem 1.5rem 2rem 1.5rem',
      }}
    >
      {/* Decorative Gradient Glows in Background */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '20%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, rgba(236, 72, 153, 0.04) 70%, transparent 100%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '15%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(147, 51, 234, 0.03) 70%, transparent 100%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      {/* Header with Title & Navigation Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', position: 'relative', zIndex: 2 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.25rem 0.75rem', backgroundColor: '#f3e8ff', color: '#7e22ce', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            <Sparkles size={14} /> Interactive Lifecycle Flow
          </div>
          <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            Project Capstone Journey
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0 0' }}>
            Scroll horizontally or drag to navigate through your academic project milestones.
          </p>
        </div>

        {/* Scroll Control Arrows */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => scrollBy(-360)}
            title="Scroll Left"
            style={{ width: '38px', height: '38px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => scrollBy(360)}
            title="Scroll Right"
            style={{ width: '38px', height: '38px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Horizontal Track Container */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          position: 'relative',
          paddingBottom: '2.5rem',
          paddingTop: '3.5rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          cursor: 'grab',
        }}
      >
        {/* Continuous Sinusoidal SVG Ribbon Curve */}
        <svg
          style={{
            position: 'absolute',
            top: '80px',
            left: 0,
            width: `${stages.length * 360}px`,
            height: '180px',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <defs>
            <linearGradient id="journeyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="25%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="75%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Smooth Winding Sinusoidal Wave Path */}
          <path
            d={stages.reduce((acc, _, i) => {
              const startX = i * 360 + 80;
              const midX = i * 360 + 260;
              const endX = (i + 1) * 360 + 80;
              const y1 = i % 2 === 0 ? 50 : 120;
              const y2 = i % 2 === 0 ? 120 : 50;
              if (i === 0) return `M ${startX} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${endX} ${y2}`;
              return `${acc} C ${midX} ${y1}, ${midX} ${y2}, ${endX} ${y2}`;
            }, '')}
            fill="none"
            stroke="url(#journeyGradient)"
            strokeWidth="7"
            strokeLinecap="round"
            filter="url(#glow)"
          />
        </svg>

        {/* Milestone Cards Along the Journey */}
        <div style={{ display: 'flex', gap: '2rem', paddingLeft: '1rem', paddingRight: '2rem', zIndex: 2 }}>
          {stages.map((stage, index) => {
            const isTop = index % 2 === 0;
            const isCompleted = stage.status === 'COMPLETED';
            const isInProgress = stage.status === 'IN_PROGRESS';
            const Icon = stage.icon;

            return (
              <div
                key={stage.order}
                style={{
                  width: '320px',
                  minWidth: '320px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  position: 'relative',
                  marginTop: isTop ? '0' : '90px',
                }}
              >
                {/* Milestone Node Pin */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: isCompleted
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : isInProgress
                        ? 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)'
                        : 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isCompleted || isInProgress ? '0 10px 20px -5px rgba(99, 102, 241, 0.4)' : 'none',
                      border: '3px solid #ffffff',
                      flexShrink: 0,
                    }}
                  >
                    {isCompleted ? <CheckCircle2 size={22} /> : <Flag size={20} />}
                  </div>

                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.6rem',
                      borderRadius: '9999px',
                      backgroundColor: isCompleted ? '#ecfdf5' : isInProgress ? '#ede9fe' : '#f1f5f9',
                      color: isCompleted ? '#065f46' : isInProgress ? '#6d28d9' : '#64748b',
                      border: '1px solid',
                      borderColor: isCompleted ? '#a7f3d0' : isInProgress ? '#ddd6fe' : '#e2e8f0',
                    }}
                  >
                    {isCompleted ? 'COMPLETED' : isInProgress ? 'IN PROGRESS' : 'UPCOMING'}
                  </span>
                </div>

                {/* Milestone Glassmorphic Content Card */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    border: '1px solid',
                    borderColor: isInProgress ? 'var(--border-glow)' : 'var(--border-color)',
                    boxShadow: isInProgress
                      ? 'var(--shadow-md), var(--shadow-glow)'
                      : 'var(--shadow-sm)',
                    width: '100%',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        backgroundColor: `${stage.color}25`,
                        color: stage.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                      {stage.order}. {stage.title}
                    </h3>
                  </div>

                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: stage.color, marginBottom: '0.5rem' }}>
                    {stage.subtitle}
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    {stage.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Progress Bar & Hint */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#64748b', fontWeight: 500 }}>
          <span>Scroll track:</span>
          <div style={{ width: '120px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${Math.max(10, scrollProgress)}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
                borderRadius: '9999px',
                transition: 'width 0.15s ease-out',
              }}
            />
          </div>
        </div>

        <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>Swipe or scroll horizontally</span> <span>&rarr;</span>
        </div>
      </div>
    </div>
  );
};
