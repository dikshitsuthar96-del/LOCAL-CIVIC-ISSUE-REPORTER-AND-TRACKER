import React, { useState } from 'react';
import {
  Phone,
  User,
  Building2,
  Crown,
  Menu,
  X,
  HelpCircle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';
import { CivicLogo } from './CivicLogo.js';

interface MunicipalHeaderProps {
  appMode: 'citizen' | 'gov' | 'admin';
  onSwitchMode: (mode: 'citizen' | 'gov' | 'admin') => void;
  onNavigateSection: (sectionId: string) => void;
  activeSection?: string;
  onOpenWorkflowGuide?: () => void;
}

export const MunicipalHeader: React.FC<MunicipalHeaderProps> = ({
  appMode,
  onSwitchMode,
  onNavigateSection,
  activeSection = 'home',
  onOpenWorkflowGuide,
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'small'>('normal');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleFontSizeChange = (size: 'normal' | 'large' | 'small') => {
    setFontSize(size);
    if (typeof document !== 'undefined') {
      if (size === 'large') document.documentElement.style.fontSize = '17px';
      else if (size === 'small') document.documentElement.style.fontSize = '14px';
      else document.documentElement.style.fontSize = '16px';
    }
  };

  // Explicit portal navigation specifications matching guidelines:
  // Citizen: Home | Report Issue | My Complaints | Help
  // Government: Dashboard | Complaints | Assigned | Completed
  // Admin: Dashboard | Complaints | Departments | Users | Reports | Settings
  const citizenNav = [
    { id: 'home', label: 'Home' },
    { id: 'report', label: 'Report Issue' },
    { id: 'track', label: 'My Complaints' },
    { id: 'help', label: 'Help' },
  ];

  const govNav = [
    { id: 'gov-dashboard', label: 'Dashboard' },
    { id: 'gov-complaints', label: 'Complaints' },
    { id: 'gov-assigned', label: 'Assigned' },
    { id: 'gov-completed', label: 'Completed' },
  ];

  const adminNav = [
    { id: 'admin-dashboard', label: 'Dashboard' },
    { id: 'admin-complaints', label: 'Complaints' },
    { id: 'admin-departments', label: 'Departments' },
    { id: 'admin-users', label: 'Users' },
    { id: 'admin-reports', label: 'Reports' },
    { id: 'admin-settings', label: 'Settings' },
  ];

  const currentNav =
    appMode === 'citizen'
      ? citizenNav
      : appMode === 'gov'
      ? govNav
      : adminNav;

  return (
    <header className="w-full select-none bg-white shadow-xs sticky top-0 z-50">
      {/* ------------------------------------------------------------- */}
      {/* LEVEL 1: TOP GOVERNMENT UTILITY STRIP                         */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#0b2239] text-slate-200 border-b border-[#143455]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-7 flex items-center justify-between text-[11px]">
          {/* Left: National Identity */}
          <div className="flex items-center space-x-2 font-medium">
            <span className="text-[#ea580c] font-bold">🏛️</span>
            <span className="text-slate-100 font-semibold tracking-wide">
              {t.govtOfIndia} &bull; Public Civic Governance
            </span>
          </div>

          {/* Right: Accessibility & Language */}
          <div className="flex items-center space-x-3 text-slate-300 text-[11px] shrink-0">
            {/* Language Toggle: हिन्दी | English */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="font-bold text-[#ffb049] hover:text-white transition-colors cursor-pointer px-1 py-0.5 rounded text-xs"
              title="Switch Language / भाषा बदलें"
            >
              {language === 'en' ? 'हिन्दी' : 'English'}
            </button>

            <span className="text-slate-600">|</span>

            {/* Font Resizer */}
            <div className="flex items-center space-x-1 font-mono text-[10px]" title="Font Size">
              <button
                type="button"
                onClick={() => handleFontSizeChange('small')}
                className={`px-1 rounded cursor-pointer ${
                  fontSize === 'small' ? 'bg-[#ea580c] text-white font-bold' : 'hover:text-white'
                }`}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => handleFontSizeChange('normal')}
                className={`px-1 rounded cursor-pointer ${
                  fontSize === 'normal' ? 'bg-[#ea580c] text-white font-bold' : 'hover:text-white'
                }`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => handleFontSizeChange('large')}
                className={`px-1 rounded cursor-pointer ${
                  fontSize === 'large' ? 'bg-[#ea580c] text-white font-bold' : 'hover:text-white'
                }`}
              >
                A+
              </button>
            </div>

            {onOpenWorkflowGuide && (
              <>
                <span className="text-slate-600 hidden sm:inline">|</span>
                <button
                  type="button"
                  onClick={onOpenWorkflowGuide}
                  className="hover:text-white transition-colors cursor-pointer hidden sm:flex items-center space-x-1 text-[#ffb049]"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>Workflow Guide</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* LEVEL 2: MAIN BRANDING & PORTAL SWITCHER                      */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Official Emblem & Portal Title */}
          <div
            onClick={() => {
              if (appMode !== 'citizen') onSwitchMode('citizen');
              onNavigateSection('home');
            }}
            className="cursor-pointer"
          >
            <CivicLogo size="md" variant="dark" />
          </div>

          {/* Right: Helpline & Portal Switcher Badges */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Toll-Free Civic Helpline */}
            <div className="hidden md:flex items-center space-x-2 text-left pr-3 border-r border-slate-200">
              <div className="w-7 h-7 rounded-full bg-blue-50 text-[#0b2239] flex items-center justify-center shrink-0 border border-blue-200">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block leading-none">
                  Civic Helpline
                </span>
                <span className="text-xs font-bold text-[#0b2239] font-mono">1916 (Toll-Free)</span>
              </div>
            </div>

            {/* Portal Switcher Tabs: Citizen / Government / Admin */}
            <div className="flex items-center bg-slate-100 p-1 rounded-md border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => onSwitchMode('citizen')}
                className={`px-3 py-1.5 rounded-sm flex items-center space-x-1.5 transition-colors cursor-pointer ${
                  appMode === 'citizen'
                    ? 'bg-[#0b2239] text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:text-[#0b2239]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Citizen Portal</span>
                <span className="sm:hidden">Citizen</span>
              </button>

              <button
                type="button"
                onClick={() => onSwitchMode('gov')}
                className={`px-3 py-1.5 rounded-sm flex items-center space-x-1.5 transition-colors cursor-pointer ${
                  appMode === 'gov'
                    ? 'bg-[#0b2239] text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:text-[#0b2239]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Government</span>
                <span className="sm:hidden">Gov</span>
              </button>

              <button
                type="button"
                onClick={() => onSwitchMode('admin')}
                className={`px-3 py-1.5 rounded-sm flex items-center space-x-1.5 transition-colors cursor-pointer ${
                  appMode === 'admin'
                    ? 'bg-[#0b2239] text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:text-[#0b2239]'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>

            {/* Mobile Nav Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 text-slate-700 hover:text-[#0b2239] border border-slate-300 rounded-sm"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* LEVEL 3: ACTIVE PORTAL NAVIGATION BAR (Deep Navy Strip)       */}
      {/* ------------------------------------------------------------- */}
      <nav className="bg-[#0b2239] text-white border-b-2 border-[#ea580c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="hidden lg:flex items-center space-x-1 py-1">
            {currentNav.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigateSection(item.id)}
                  className={`px-4 py-2 transition-colors cursor-pointer rounded-xs text-xs font-semibold whitespace-nowrap ${
                    isActive
                      ? 'bg-[#ea580c] text-white font-bold'
                      : 'text-slate-200 hover:bg-[#143455] hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center text-xs text-slate-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
            <span>
              {appMode === 'citizen'
                ? 'Citizen Self-Service Portal'
                : appMode === 'gov'
                ? 'Department Field Crew Console'
                : 'Municipal Oversight & Governance'}
            </span>
          </div>
        </div>

        {/* Mobile Navigation Links */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#071626] border-t border-[#143455] px-4 py-2 space-y-1">
            {currentNav.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigateSection(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xs ${
                  activeSection === item.id
                    ? 'bg-[#ea580c] text-white font-bold'
                    : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};
