import React from 'react';
import collegeBanner from './collegeBanner.png';
import collegeLogo from './collegeLogo.jpg';
import naacBadgeImg from './naacBadge.png';

export { collegeBanner, collegeLogo, naacBadgeImg };

export const CollegeEmblem = ({ size = 42 }) => (
  <img
    src={collegeLogo}
    alt="College Emblem"
    style={{
      height: `${size}px`,
      width: `${size}px`,
      objectFit: 'contain',
      display: 'block',
      borderRadius: '50%',
      backgroundColor: '#ffffff',
      padding: '2px'
    }}
  />
);

export const CollegeLogo = CollegeEmblem;

export const NaacBadge = ({ size = 38 }) => (
  <img
    src={naacBadgeImg}
    alt="Accredited with Grade A++ NAAC"
    style={{
      height: `${size}px`,
      width: 'auto',
      maxHeight: `${size}px`,
      objectFit: 'contain',
      display: 'block',
    }}
  />
);

export const CollegeBanner = () => {
  return (
    <header className="w-full bg-[#0c2340] border-b border-[#1e3a8a] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-3 py-2 sm:px-6 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Emblem + Red Divider + Official College Title */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <img
              src={collegeLogo}
              alt="Logo"
              className="h-9 w-9 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full bg-white p-0.5 object-contain shadow"
            />
          </div>

          {/* Red Vertical Line */}
          <div className="w-[2px] sm:w-[3px] h-8 sm:h-11 bg-red-500 flex-shrink-0 rounded-full" />

          {/* Official Titles (1:1 with prpotepatilengg.ac.in) */}
          <div className="flex flex-col justify-center min-w-0">
            <span className="text-red-500 font-extrabold text-[11px] sm:text-sm md:text-base leading-tight tracking-wide">
              P. R. Pote Patil
            </span>
            <span className="text-white font-bold text-[10px] sm:text-xs md:text-sm lg:text-base leading-tight truncate">
              College of Engineering &amp; Management, Amravati
            </span>
            <span className="text-sky-400 font-medium text-[8.5px] sm:text-[11px] leading-tight">
              (An Autonomous Institute) &bull; <span className="text-emerald-400 font-semibold">Project Monitoring System</span>
            </span>
          </div>
        </div>

        {/* Right: NAAC A++ Badge */}
        <div className="flex-shrink-0 flex items-center">
          <img
            src={naacBadgeImg}
            alt="NAAC A++"
            className="h-8 sm:h-11 md:h-12 w-auto object-contain"
          />
        </div>
      </div>
    </header>
  );
};
