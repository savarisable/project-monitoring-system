import React from 'react';
import collegeBanner from './collegeBanner.png';
import collegeLogo from './collegeLogo.jpg';
import naacBadgeImg from './naacBadge.png';

export { collegeBanner, collegeLogo, naacBadgeImg };

export const CollegeEmblem = ({ size = 60 }) => (
  <img
    src={collegeLogo}
    alt="P. R. Pote Patil College Emblem"
    style={{
      height: `${size}px`,
      width: `${size}px`,
      objectFit: 'contain',
      display: 'block',
    }}
  />
);

export const CollegeLogo = CollegeEmblem;

export const NaacBadge = ({ size = 65 }) => (
  <img
    src={naacBadgeImg}
    alt="Accredited with Grade A++ NAAC"
    style={{
      height: `${size}px`,
      width: 'auto',
      maxHeight: `${size}px`,
      objectFit: 'contain',
      display: 'block',
      mixBlendMode: 'multiply',
      backgroundColor: 'transparent',
    }}
  />
);

export const CollegeBanner = () => {
  return (
    <header className="w-full bg-white border-b-2 sm:border-b-4 border-blue-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 py-2 sm:px-6 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Emblem */}
        <div className="flex-shrink-0 flex items-center">
          <img
            src={collegeLogo}
            alt="College Emblem"
            className="h-11 w-11 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain"
          />
        </div>

        {/* Center: Official College Typography */}
        <div className="flex-1 text-center flex flex-col items-center justify-center px-1">
          <span className="text-[0.65rem] sm:text-xs md:text-sm lg:text-base font-bold text-red-600 tracking-wide uppercase leading-tight">
            P. R. Pote (Patil) Education &amp; Welfare Trust's Group of Institutes
          </span>
          <span className="text-xs sm:text-base md:text-lg lg:text-xl font-extrabold text-blue-950 tracking-tight leading-tight mt-0.5 sm:mt-1">
            College of Engineering &amp; Management, Amravati
          </span>
          <span className="hidden sm:inline-block text-[0.65rem] sm:text-xs font-semibold text-orange-600 leading-tight mt-0.5">
            (An Autonomous Institute Affiliated to SGBAU Amravati &bull; Approved by AICTE)
          </span>
        </div>

        {/* Right: NAAC A++ Seal */}
        <div className="flex-shrink-0 flex items-center justify-end">
          <img
            src={naacBadgeImg}
            alt="NAAC A++"
            className="h-10 sm:h-14 md:h-16 w-auto object-contain mix-blend-multiply"
          />
        </div>
      </div>
    </header>
  );
};
