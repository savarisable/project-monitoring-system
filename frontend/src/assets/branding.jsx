import React from 'react';
import collegeBanner from './collegeBanner.png';
import collegeLogo from './collegeLogo.jpg';
import naacBadgeImg from './naacBadge.png';

export { collegeBanner, collegeLogo, naacBadgeImg };

// Real Authentic NAAC A++ Ribbon Seal (Seamless background blend)
export const NaacBadge = ({ size = 86 }) => (
  <img
    src={naacBadgeImg}
    alt="Accredited with Grade A++ NAAC"
    style={{
      height: `${size}px`,
      width: 'auto',
      maxHeight: `${size}px`,
      objectFit: 'contain',
      display: 'block',
      flexShrink: 0,
      mixBlendMode: 'multiply',
      backgroundColor: 'transparent',
    }}
  />
);

// Large Official Website-Style Full-Width Header
export const CollegeBanner = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#ffffff',
        borderBottom: '3px solid #1e3a8a',
        boxSizing: 'border-box',
        gap: '1.5rem',
        flexWrap: 'nowrap',
      }}
    >
      {/* Left: Circular College Emblem */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <img
          src={collegeLogo}
          alt="P. R. Pote Patil College Emblem"
          style={{
            height: '80px',
            width: '80px',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>

      {/* Middle: Prominent Official College Name Typography */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          flex: 1,
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        {/* Red dividing line */}
        <div
          style={{
            width: '4px',
            height: '65px',
            backgroundColor: '#dc2626',
            borderRadius: '2px',
            flexShrink: 0,
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span
            style={{
              fontSize: '1.95rem',
              fontWeight: 900,
              color: '#dc2626',
              letterSpacing: '0.02em',
              lineHeight: 1.15,
              textTransform: 'uppercase',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            P. R. Pote (Patil) Education &amp; Welfare Trust's Group of Educational Institutes
          </span>

          <span
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#1e3a8a',
              letterSpacing: '0.01em',
              lineHeight: 1.2,
              marginTop: '2px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            College of Engineering &amp; Management, Amravati
          </span>

          <span
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#ea580c',
              letterSpacing: '0.03em',
              lineHeight: 1.2,
              marginTop: '3px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            (An Autonomous Institute Affiliated to Sant Gadge Baba Amravati University)
          </span>
        </div>
      </div>

      {/* Right: Golden NAAC A++ Ribbon Seal */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexShrink: 0 }}>
        <NaacBadge size={80} />
      </div>
    </div>
  );
};
