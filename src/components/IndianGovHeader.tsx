import React, { useState } from 'react';
import {
  Calendar,
  Globe,
  User,
  Building2,
  Crown,
  ChevronDown,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';

interface IndianGovHeaderProps {
  appMode?: 'citizen' | 'gov' | 'admin';
  onSwitchMode?: (mode: 'citizen' | 'gov' | 'admin') => void;
  onSkipToContent?: () => void;
}

export const IndianGovHeader: React.FC<IndianGovHeaderProps> = ({
  appMode = 'citizen',
  onSwitchMode,
  onSkipToContent,
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'small'>('normal');
  const [showAccessMenu, setShowAccessMenu] = useState(false);

  const toggleFontSize = (level: 'normal' | 'large' | 'small') => {
    setFontSizeLevel(level);
    if (level === 'large') {
      document.documentElement.style.fontSize = '17px';
    } else if (level === 'small') {
      document.documentElement.style.fontSize = '14px';
    } else {
      document.documentElement.style.fontSize = '16px';
    }
  };

  return (
    <header className="w-full select-none text-slate-100 bg-[#061426] border-b border-[#142e4d] relative z-50">
      {/* Official Indian Flag Tricolor Micro-Strip (Saffron, White, Green) */}
      <div className="w-full h-1 flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-[#FFFFFF]" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* Top Utility Bar (Replicating Screenshot: Skip to main content | 📅 | ♿ | अ/A | 🇮🇳) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 flex items-center justify-between text-[11px] font-sans">
        {/* Left: Official Identification & Portal Switcher */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-200 tracking-wide">
              {t.govtOfIndia}
            </span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-300 hidden sm:inline text-[10px]">
              {language === 'hi' ? 'राष्ट्रीय नागरिक सेवा एवं लोक शिकायत निवारण' : 'National Grievance Redressal (CPGRAMS)'}
            </span>
          </div>

          {/* Quick Portals Switcher */}
          {onSwitchMode && (
            <div className="hidden md:flex items-center space-x-1 pl-2 border-l border-slate-700/60">
              <button
                type="button"
                onClick={() => onSwitchMode('citizen')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                  appMode === 'citizen'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.citizenPortal}
              </button>
              <button
                type="button"
                onClick={() => onSwitchMode('gov')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                  appMode === 'gov'
                    ? 'bg-sky-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.officerAccess}
              </button>
              <button
                type="button"
                onClick={() => onSwitchMode('admin')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                  appMode === 'admin'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.adminGate}
              </button>
            </div>
          )}
        </div>

        {/* Right: Exact controls from Screenshot */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-slate-300">
          {/* "Skip to main content" */}
          <button
            type="button"
            onClick={() => {
              if (onSkipToContent) {
                onSkipToContent();
              } else {
                const el = document.getElementById('main-content-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="hover:text-white transition-colors cursor-pointer text-[10px] sm:text-[11px] underline sm:no-underline hover:underline"
          >
            {t.skipToMain}
          </button>

          <span className="text-slate-600">|</span>

          {/* Calendar Icon */}
          <div
            className="flex items-center space-x-1 cursor-default text-slate-300 hover:text-white"
            title="Standard Indian Municipal Calendar"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-[10px] hidden lg:inline font-mono">14-09-2026</span>
          </div>

          <span className="text-slate-600">|</span>

          {/* Universal Accessibility / Font Controls */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAccessMenu(!showAccessMenu)}
              className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center"
              title="Accessibility & Text Size"
            >
              {/* Universal Access Symbol SVG */}
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <circle cx="12" cy="4" r="2" />
                <path d="M19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43c-.17-.19-.38-.34-.61-.45-.49-.23-1.07-.26-1.59-.07l-3.84 1.4c-.4.15-.71.47-.84.88L5.5 13H8l.9-2.7 1.6-.58V15l-3 4.5 1.7 1.1 3.3-5h1l3.3 5 1.7-1.1-3-4.5v-5.28l1.6.58.9 2.7h2.5z" />
              </svg>
            </button>

            {showAccessMenu && (
              <div className="absolute right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-2 z-50 text-[11px] flex items-center space-x-1.5 whitespace-nowrap">
                <span className="text-slate-400 mr-1">Text:</span>
                <button
                  type="button"
                  onClick={() => toggleFontSize('small')}
                  className={`px-1.5 py-0.5 rounded ${fontSizeLevel === 'small' ? 'bg-amber-400 text-black font-bold' : 'bg-slate-800 text-white'}`}
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => toggleFontSize('normal')}
                  className={`px-1.5 py-0.5 rounded ${fontSizeLevel === 'normal' ? 'bg-amber-400 text-black font-bold' : 'bg-slate-800 text-white'}`}
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => toggleFontSize('large')}
                  className={`px-1.5 py-0.5 rounded ${fontSizeLevel === 'large' ? 'bg-amber-400 text-black font-bold' : 'bg-slate-800 text-white'}`}
                >
                  A+
                </button>
              </div>
            )}
          </div>

          <span className="text-slate-600">|</span>

          {/* Language Switcher Icon: अ / A */}
          <button
            type="button"
            id="accessibility-language-toggle-btn"
            onClick={toggleLanguage}
            className="flex items-center space-x-1 font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer px-1 py-0.5 rounded hover:bg-slate-800/80"
            title="Switch Language / भाषा बदलें"
          >
            <span className="text-xs">अ</span>
            <span className="text-[10px] text-slate-400">/</span>
            <span className="text-xs">A</span>
          </button>

          <span className="text-slate-600">|</span>

          {/* Indian Tricolor Flag Graphic (Exact to screenshot) */}
          <div
            className="w-5 h-3.5 rounded-xs overflow-hidden border border-slate-500 shadow-xs flex flex-col justify-between shrink-0"
            title="National Flag of India (तिरंगा)"
          >
            <div className="h-[33.33%] bg-[#FF9933]" />
            <div className="h-[33.33%] bg-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full border-[0.6px] border-[#000080] flex items-center justify-center">
                <div className="w-0.5 h-0.5 rounded-full bg-[#000080]" />
              </div>
            </div>
            <div className="h-[33.33%] bg-[#138808]" />
          </div>
        </div>
      </div>
    </header>
  );
};
