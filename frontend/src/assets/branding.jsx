import React from 'react';
import collegeBanner from '@uploaded/media_1787774560606.png';
import collegeLogo from '@uploaded/media_1787774574339.jpg';
import naacBadgeImg from '@uploaded/media_1788250515807.png';

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
        padding: '0.65rem 2.25rem',
        gap: '2rem',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Left: Round Logo + Red Separator + Official College Typography */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: 0 }}>
        <img
          src={collegeLogo}
          alt="P. R. Pote Patil College Emblem"
          style={{
            width: '88px',
            height: '88px',
            borderRadius: '50%',
            objectFit: 'cover',
            display: 'block',
            flexShrink: 0,
          }}
        />

        {/* Red Vertical Dividing Bar */}
        <div
          style={{
            width: '4px',
            height: '76px',
            backgroundColor: '#dc2626',
            borderRadius: '2px',
            flexShrink: 0,
          }}
        />

        {/* Full College Name & Autonomous University Affiliation */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div
            style={{
              fontSize: '2.15rem',
              fontWeight: 900,
              color: '#dc2626',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            P. R. Pote Patil
          </div>
          <div
            style={{
              fontSize: '1.65rem',
              fontWeight: 800,
              color: '#1e3a8a',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              marginTop: '2px',
              fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            College of Engineering & Management, Amravati
          </div>
          <div
            style={{
              fontSize: '0.95rem',
              color: '#ea580c',
              fontWeight: 700,
              marginTop: '4px',
              letterSpacing: '0.01em',
            }}
          >
            An Autonomous Institute Affiliated to Sant Gadge Baba Amravati University
          </div>
        </div>
      </div>

      {/* Right: Seamless NAAC A++ Ribbon Seal */}
      <NaacBadge size={88} />
    </div>
  );
};

// Circular College Emblem Component
export const CollegeEmblem = ({ size = 64 }) => {
  return (
    <img
      src={collegeLogo}
      alt="P. R. Pote Patil College Logo"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        objectFit: 'cover',
        display: 'block',
      }}
    />
  );
};
