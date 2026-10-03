import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp, Lock, Landmark, CheckCircle, Globe, Headphones } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';

interface GovOfficialBannerProps {
  portalType?: 'citizen' | 'gov';
  onSkipToContent?: () => void;
}

export const GovOfficialBanner: React.FC<GovOfficialBannerProps> = ({ portalType = 'citizen', onSkipToContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHelpline, setShowHelpline] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div className="bg-[#0b1c33] text-slate-200 text-[11px] select-none border-b border-[#1b3b68]">
      {/* Official Indian National Tricolor Stripe */}
      <div className="w-full h-1 flex">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-[#FFFFFF]"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      {/* Official Government of India Trust Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
        {/* Left: Official Indian Government Mark & Ashoka Stambh */}
        <div className="flex items-center space-x-2.5">
          <span className="text-amber-400 font-bold text-sm">🏛️</span>
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="font-extrabold text-white tracking-wide">
              {t.govtOfIndia}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-amber-300 font-medium hidden md:inline">
              {language === 'hi' ? 'नागरिक सेवा एवं लोक शिकायत निवारण प्रणाली' : 'National Civic Grievance & Municipal Operations'}
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline font-serif italic text-[10px]">
              सत्यमेव जयते
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer inline-flex items-center space-x-0.5 ml-1 text-[10px]"
          >
            <span>{t.govVerification}</span>
            {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Right: 1-Click Language Switch + 24/7 Helpline */}
        <div className="flex items-center space-x-3 text-[11px]">
          {/* 1-Click Language Toggle Button */}
          <button
            type="button"
            id="gov-banner-lang-toggle"
            onClick={toggleLanguage}
            className="px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] flex items-center space-x-1 transition-transform active:scale-95 cursor-pointer shadow-xs"
            title="Switch Language / भाषा बदलें"
          >
            <Globe className="w-3 h-3 text-slate-950" />
            <span>{t.switchLang}</span>
          </button>

          {/* 24/7 Helpline */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowHelpline(!showHelpline)}
              className="hover:text-white text-slate-300 cursor-pointer flex items-center space-x-1"
            >
              <Headphones className="w-3 h-3 text-amber-400" />
              <span>{t.tollFreeHelpline}1913</span>
            </button>
            {showHelpline && (
              <div className="absolute right-0 top-6 z-50 bg-[#0f294c] border border-amber-400/40 shadow-xl rounded-lg p-3 w-64 text-xs text-slate-200">
                <p className="font-bold text-white flex items-center space-x-1.5">
                  <span>🇮🇳</span>
                  <span>{t.nationalCivicHelpdesk}</span>
                </p>
                <p className="text-[11px] text-slate-300 mt-1">
                  {t.tollFreeHelpline}
                  <span className="font-mono font-bold text-amber-400">1913 / 1800-11-4000</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-1 border-t border-slate-700 pt-1">
                  {t.dedicatedForCivicIntake}
                </p>
              </div>
            )}
          </div>

          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-[10px] text-emerald-400 font-mono font-bold hidden sm:inline">NIC SECURE</span>
        </div>
      </div>

      {/* Accordion Verification Info */}
      {isOpen && (
        <div className="bg-[#07172c] border-t border-b border-[#1b3b68] px-4 sm:px-6 py-2.5 text-xs text-slate-300">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>{t.officialGovMunicipalPortal}</strong>{' '}
                {t.encryptedMunicipalServerDesc}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white text-[11px] cursor-pointer"
            >
              {t.dismissBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


