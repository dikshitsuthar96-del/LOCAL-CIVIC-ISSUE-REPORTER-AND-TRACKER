import React from 'react';

interface CivicLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  showSubtitle?: boolean;
}

export const CivicLogo: React.FC<CivicLogoProps> = ({
  size = 'md',
  variant = 'dark',
  showSubtitle = true,
}) => {
  const isLight = variant === 'light';

  // Dimension scaling
  const emblemSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
  };

  return (
    <div className="flex items-center space-x-3 select-none">
      {/* Official Government Civic Emblem */}
      <div
        className={`${emblemSizes[size]} shrink-0 rounded-full flex items-center justify-center p-1 shadow-xs border ${
          isLight
            ? 'bg-white/10 border-white/30 text-white'
            : 'bg-gradient-to-b from-amber-50 to-slate-100 border-[#0b2239]/20 text-[#0b2239]'
        }`}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-label="Civic Seva Government Emblem"
        >
          {/* Outer circle ring */}
          <circle cx="24" cy="24" r="21" stroke="#0b2239" strokeWidth="2.5" />
          <circle cx="24" cy="24" r="18.5" stroke="#ea580c" strokeWidth="1" strokeDasharray="2 2" />

          {/* Civic Building Pillars (Government Architecture) */}
          <path
            d="M12 34H36V36H12V34Z"
            fill="#0b2239"
          />
          <path
            d="M14 31H34V33H14V31Z"
            fill="#ea580c"
          />
          {/* 4 Pillars */}
          <rect x="15" y="20" width="3" height="11" fill="#0b2239" rx="0.5" />
          <rect x="20" y="20" width="3" height="11" fill="#0b2239" rx="0.5" />
          <rect x="25" y="20" width="3" height="11" fill="#0b2239" rx="0.5" />
          <rect x="30" y="20" width="3" height="11" fill="#0b2239" rx="0.5" />

          {/* Roof Pediment / Dome */}
          <path
            d="M24 10L36 19H12L24 10Z"
            fill="#0b2239"
          />
          {/* Ashoka / Civic Chakra in Pediment */}
          <circle cx="24" cy="15.5" r="2.5" fill="#ea580c" />

          {/* Location Pin & Service Leaves */}
          <path
            d="M24 6C22.3 6 21 7.3 21 9C21 11.2 24 14 24 14C24 14 27 11.2 27 9C27 7.3 25.7 6 24 6Z"
            fill="#ea580c"
          />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center space-x-2">
          <span
            className={`font-black tracking-tight font-serif ${titleSizes[size]} ${
              isLight ? 'text-white' : 'text-[#0b2239]'
            }`}
          >
            Civic Seva
          </span>
          <span className="bg-[#ea580c] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-xs uppercase tracking-wider">
            PORTAL
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`font-medium tracking-normal ${subtitleSizes[size]} ${
              isLight ? 'text-slate-200' : 'text-slate-600'
            }`}
          >
            Citizen Civic Issue Reporting &amp; Resolution Portal
          </span>
        )}
      </div>
    </div>
  );
};
