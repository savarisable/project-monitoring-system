import React from 'react';
import collegeBanner from './collegeBanner.png';
import collegeLogo from './collegeLogo.jpg';
import naacBadgeImg from './naacBadge.png';

export { collegeBanner, collegeLogo, naacBadgeImg };

export const CollegeEmblem = ({ size = 48 }) => (
  <img
    src={collegeLogo}
    alt="College Emblem"
    style={{
      height: `${size}px`,
      width: `${size}px`,
      objectFit: 'contain',
      display: 'block',
    }}
  />
);

export const CollegeLogo = CollegeEmblem;

export const NaacBadge = ({ size = 42 }) => (
  <img
    src={naacBadgeImg}
    alt="NAAC A++"
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
    <>
      {/* Mobile Top App Bar (< 768px) */}
      <header className="block md:hidden w-full bg-white border-b-2 border-blue-900 px-3 py-1.5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img src={collegeLogo} alt="Logo" className="h-8 w-8 object-contain" />
            <div className="flex flex-col">
              <span className="text-[11px] font-extrabold text-blue-950 leading-tight">
                P. R. POTE PATIL COE&M
              </span>
              <span className="text-[9px] font-semibold text-orange-600 leading-none">
                Autonomous &bull; CSE Department
              </span>
            </div>
          </div>
          <img src={naacBadgeImg} alt="NAAC" className="h-7 w-auto object-contain mix-blend-multiply" />
        </div>
      </header>

      {/* Desktop Banner (>= 768px) */}
      <header className="hidden md:block w-full bg-white border-b-4 border-blue-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between gap-4">
          <div className="flex-shrink-0">
            <img src={collegeLogo} alt="College Emblem" className="h-16 w-16 lg:h-20 lg:w-20 object-contain" />
          </div>

          <div className="flex-1 text-center flex flex-col items-center justify-center px-2">
            <span className="text-xs lg:text-sm font-bold text-red-600 tracking-wider uppercase leading-tight">
              P. R. Pote (Patil) Education &amp; Welfare Trust's Group of Educational Institutes
            </span>
            <span className="text-base lg:text-xl font-extrabold text-blue-950 tracking-tight leading-tight mt-0.5">
              College of Engineering &amp; Management, Amravati
            </span>
            <span className="text-[11px] lg:text-xs font-semibold text-orange-600 leading-tight mt-0.5">
              (An Autonomous Institute Affiliated to Sant Gadge Baba Amravati University &bull; NAAC A++)
            </span>
          </div>

          <div className="flex-shrink-0 flex items-center justify-end">
            <img src={naacBadgeImg} alt="NAAC A++" className="h-14 lg:h-16 w-auto object-contain mix-blend-multiply" />
          </div>
        </div>
      </header>
    </>
  );
};
