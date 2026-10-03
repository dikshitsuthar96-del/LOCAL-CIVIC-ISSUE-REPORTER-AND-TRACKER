import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  Calendar,
  Eye,
  Globe,
  MessageSquare,
  Volume2,
  Share2,
  Palette,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  FilePlus2,
  Sparkles,
  Award,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';

interface NationalPortalHeroProps {
  onSearch: (query: string, category: string) => void;
  onSelectAction: (action: 'report' | 'track' | 'browse', sampleQuery?: string) => void;
  onOpenVoiceAssistant?: () => void;
}

export const NationalPortalHero: React.FC<NationalPortalHeroProps> = ({
  onSearch,
  onSelectAction,
  onOpenVoiceAssistant,
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(() => {
    try {
      return localStorage.getItem('india_gov_cookie_consent') !== 'accepted';
    } catch {
      return true;
    }
  });

  const categories = [
    'All Categories',
    'Report Civic Grievance',
    'Track Token / Status',
    'Roads & Potholes',
    'Waste & Sanitation',
    'Water Main & Leakages',
    'Street Lighting',
    'Municipal Administration',
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim(), selectedCategory);
    } else {
      onSelectAction('browse');
    }
  };

  const handleTrendingClick = (term: string) => {
    if (term === 'Report Civic Grievance' || term === 'Report Grievance') {
      onSelectAction('report');
    } else if (term === 'Track Grievance Token' || term === 'Track Token') {
      onSelectAction('track');
    } else {
      setSearchQuery(term);
      onSearch(term, selectedCategory);
    }
  };

  const handleAcceptCookies = () => {
    setShowCookieBanner(false);
    try {
      localStorage.setItem('india_gov_cookie_consent', 'accepted');
    } catch {}
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'india.gov.in - National Civic Portal',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    }
  };

  return (
    <div className="relative w-full bg-[#0a192f] text-white overflow-hidden select-none">
      {/* ------------------------------------------------------------- */}
      {/* 1. ATMOSPHERIC BACKGROUND IMAGE & WARM OVERLAY (EXACT TO UI)  */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-civic-city.svg"
          alt="Civic Smart Governance & Municipal Infrastructure"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-40 filter contrast-110 brightness-95"
        />
        {/* Layered vignette gradient: Dark navy to deep warm vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#061426]/90 via-[#0b1e36]/75 to-[#061324]/90 mix-blend-multiply" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#061426]/30 to-[#020b17]/90" />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. RIGHT-SIDE FLOATING DOCK (IDENTICAL TO SCREENSHOT)         */}
      {/* ------------------------------------------------------------- */}
      <div className="fixed right-3 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center bg-[#132847]/90 backdrop-blur-md border border-[#234575] rounded-xl p-1.5 shadow-2xl space-y-2">
        {/* Chat / AI Grievance Assistant */}
        <button
          type="button"
          onClick={() => onSelectAction('report')}
          className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/15 transition-all cursor-pointer group relative"
          title="Citizen Grievance Chatbot"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="absolute right-10 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[11px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-700 font-sans">
            AI Civic Assistant
          </span>
        </button>

        {/* Voice Dictation / Screen Reader */}
        <button
          type="button"
          onClick={() => {
            if (onOpenVoiceAssistant) onOpenVoiceAssistant();
            else onSelectAction('report');
          }}
          className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/15 transition-all cursor-pointer group relative"
          title="Voice Assistance / Screen Reader"
        >
          <Volume2 className="w-4 h-4" />
          <span className="absolute right-10 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[11px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-700 font-sans">
            Voice Dictation
          </span>
        </button>

        {/* Calendar / Municipal SLA Working Days */}
        <button
          type="button"
          onClick={() => setShowCalendarModal(true)}
          className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/15 transition-all cursor-pointer group relative"
          title="Civic Calendar & SLA Working Days"
        >
          <Calendar className="w-4 h-4" />
          <span className="absolute right-10 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[11px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-700 font-sans">
            Municipal SLA Calendar
          </span>
        </button>

        {/* Share Portal */}
        <button
          type="button"
          onClick={handleShare}
          className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/15 transition-all cursor-pointer group relative"
          title="Share National Portal"
        >
          <Share2 className="w-4 h-4" />
          <span className="absolute right-10 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[11px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-700 font-sans">
            Share Portal
          </span>
        </button>

        {/* Theme & Contrast */}
        <button
          type="button"
          onClick={() => {
            document.documentElement.classList.toggle('high-contrast');
          }}
          className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/15 transition-all cursor-pointer group relative"
          title="Toggle High Contrast View"
        >
          <Palette className="w-4 h-4" />
          <span className="absolute right-10 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[11px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-700 font-sans">
            High Contrast View
          </span>
        </button>
      </div>

      {/* Share Toast */}
      {showShareToast && (
        <div className="fixed top-20 right-5 z-50 bg-emerald-700 text-white text-xs px-3.5 py-2 rounded-xl shadow-xl flex items-center space-x-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>National Portal URL copied to clipboard!</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. HERO CONTENT CONTAINER (CENTERED PIXEL-PERFECT LAYOUT)     */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-16 sm:pb-24 flex flex-col items-center text-center">
        {/* Ashoka Lion Capital (State Emblem of India) */}
        <div className="mb-3 flex flex-col items-center">
          <svg
            className="w-16 h-18 sm:w-20 sm:h-22 text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]"
            viewBox="0 0 100 120"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Detailed Vector Representation of the Lion Capital of Ashoka */}
            {/* Top Abacus / Three visible Lions */}
            <path d="M50 8 C46 8 43 11 43 15 C43 18 45 20 47 22 C44 24 40 28 40 33 C40 37 42 40 45 42 C41 45 37 50 37 56 C37 63 42 68 47 70 L53 70 C58 68 63 63 63 56 C63 50 59 45 55 42 C58 40 60 37 60 33 C60 28 56 24 53 22 C55 20 57 18 57 15 C57 11 54 8 50 8 Z" fill="currentColor" />
            {/* Left Lion Profile */}
            <path d="M37 25 C33 22 28 24 26 28 C24 32 25 38 28 42 C24 45 22 51 23 57 C24 63 28 68 35 70 L38 65 C34 63 32 58 32 53 C32 48 35 44 38 42 Z" fill="currentColor" />
            {/* Right Lion Profile */}
            <path d="M63 25 C67 22 72 24 74 28 C76 32 75 38 72 42 C76 45 78 51 77 57 C76 63 72 68 65 70 L62 65 C66 63 68 58 68 53 C68 48 65 44 62 42 Z" fill="currentColor" />
            {/* Abacus Plate */}
            <rect x="22" y="70" width="56" height="5" rx="1.5" fill="currentColor" />
            {/* Dharma Chakra (Ashoka Wheel in Center of Abacus) */}
            <circle cx="50" cy="79" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="50" cy="79" r="1.5" fill="currentColor" />
            <line x1="50" y1="73" x2="50" y2="85" stroke="currentColor" strokeWidth="0.8" />
            <line x1="44" y1="79" x2="56" y2="79" stroke="currentColor" strokeWidth="0.8" />
            <line x1="45.8" y1="74.8" x2="54.2" y2="83.2" stroke="currentColor" strokeWidth="0.8" />
            <line x1="45.8" y1="83.2" x2="54.2" y2="74.8" stroke="currentColor" strokeWidth="0.8" />
            {/* Bull and Horse Accents on base */}
            <ellipse cx="32" cy="79" rx="4" ry="2.5" fill="currentColor" opacity="0.8" />
            <ellipse cx="68" cy="79" rx="4" ry="2.5" fill="currentColor" opacity="0.8" />
            {/* Inverted Lotus Bell Base */}
            <path d="M25 86 C25 86 35 96 50 96 C65 96 75 86 75 86 L78 92 C68 102 32 102 22 92 Z" fill="currentColor" />
            <rect x="28" y="96" width="44" height="2" fill="currentColor" />
          </svg>
          {/* Satyameva Jayate Inscription in Devanagari */}
          <span className="text-[10px] sm:text-[11px] font-serif tracking-[0.25em] text-white/90 font-bold uppercase mt-1">
            सत्यमेव जयते
          </span>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* BRAND IDENTITY: "india.gov.in" (WITH GREEN UNDERLINE ACCENT)  */}
        {/* ------------------------------------------------------------- */}
        <div className="relative inline-block mb-2">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-sans drop-shadow-md">
            <span>india</span>
            <span className="text-[#38bdf8]">.</span>
            <span>gov</span>
            <span className="text-[#38bdf8]">.</span>
            <span className="relative inline-block">
              in
              {/* Green underline dot/bar accent under ".in" */}
              <span className="absolute -bottom-1.5 left-0 w-full h-[4px] bg-[#16a34a] rounded-full" />
            </span>
          </h1>
          {/* Subtle civic edition tag */}
          <span className="absolute -top-2 -right-16 hidden sm:inline-block px-1.5 py-0.2 bg-[#16a34a] text-white font-mono text-[9px] font-bold rounded">
            CIVIC
          </span>
        </div>

        {/* Pill Badge: "National Portal of India" */}
        <div className="mb-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#172e50] border border-[#2d5286] text-xs sm:text-sm font-semibold text-white tracking-wide shadow-inner">
            <span>National Portal of India</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></span>
            <span className="text-[11px] text-sky-200">Grievance Redressal Edition</span>
          </div>
        </div>

        {/* Subtitle: "Where Government Information Converges" */}
        <p className="text-sm sm:text-base text-slate-200 font-medium tracking-wide mb-6 sm:mb-8 max-w-xl">
          Where Government Information & Civic Grievance Redressal Converge
        </p>

        {/* ------------------------------------------------------------- */}
        {/* 4. THREE-SEGMENT SEARCH BAR (IDENTICAL TO SCREENSHOT)         */}
        {/* ------------------------------------------------------------- */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full max-w-3xl bg-white rounded-xl shadow-2xl p-1.5 flex flex-col sm:flex-row items-stretch gap-1 sm:gap-0 border border-slate-200/80"
        >
          {/* Segment 1: Input "Search for" */}
          <div className="flex-1 flex items-center px-4 py-2 text-slate-900">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchTicketsPlaceholder}
              className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden bg-transparent"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Vertical Divider */}
          <div className="hidden sm:block w-[1px] bg-slate-200 my-2" />

          {/* Segment 2: Category Dropdown "All Categories" */}
          <div className="relative sm:w-52">
            <button
              type="button"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="w-full h-full px-3.5 py-2.5 sm:py-0 flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 font-semibold bg-slate-50 sm:bg-transparent rounded-lg sm:rounded-none cursor-pointer"
            >
              <span className="truncate">{selectedCategory}</span>
              <ChevronDown className={`w-3.5 h-3.5 ml-1 text-slate-500 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCategoryOpen && (
              <div className="absolute left-0 sm:right-0 top-full mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 text-left">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsCategoryOpen(false);
                      if (cat === 'Report Civic Grievance') onSelectAction('report');
                      else if (cat === 'Track Token / Status') onSelectAction('track');
                    }}
                    className={`w-full px-3.5 py-1.5 text-xs text-left hover:bg-slate-100 flex items-center justify-between cursor-pointer ${
                      selectedCategory === cat ? 'font-bold text-red-600 bg-red-50' : 'text-slate-700'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <Check className="w-3.5 h-3.5 text-red-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Segment 3: Red Search Button */}
          <button
            type="submit"
            id="hero-national-search-btn"
            className="px-6 py-2.5 bg-[#d9222a] hover:bg-[#c01a21] active:scale-[0.98] text-white font-bold text-sm rounded-lg sm:rounded-r-lg sm:rounded-l-none flex items-center justify-center space-x-1.5 shadow-md transition-all cursor-pointer"
          >
            <span>Search</span>
          </button>
        </form>

        {/* ------------------------------------------------------------- */}
        {/* 5. TRENDING SEARCHES / CIVIC PILLS (EXACT OUTLINED PILL UI)  */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-300 font-medium mr-1">Trending Searches :</span>
          {[
            { label: 'Report Grievance', isAction: true },
            { label: 'Track Token', isAction: true },
            { label: 'Pothole Repair', isAction: false },
            { label: 'Garbage Clearance', isAction: false },
            { label: 'Water Leakage', isAction: false },
            { label: 'Streetlight Outage', isAction: false },
            { label: 'Apply Aadhaar', isAction: false },
            { label: 'DigiLocker', isAction: false },
          ].map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleTrendingClick(item.label)}
              className="px-3 py-1 rounded-full border border-white/40 hover:border-white hover:bg-white/10 text-white text-[11px] font-medium transition-all cursor-pointer backdrop-blur-xs flex items-center space-x-1"
            >
              {item.isAction && <Sparkles className="w-3 h-3 text-amber-400 mr-0.5" />}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 6. BOTTOM TESTIMONIAL RIBBON (EXACT TO SCREENSHOT)            */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-10 sm:mt-12 w-full max-w-3xl bg-white text-slate-900 rounded-2xl p-3.5 sm:p-4 shadow-xl flex items-center space-x-3.5 text-left border border-slate-100">
          {/* Avatar circle with white frame */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200 bg-[#061626] shadow-xs flex items-center justify-center p-1">
              <img
                src="/images/emblem-india.svg"
                alt="Government of India Public Grievance Directorate"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Red Quote symbol & Quote content */}
          <div className="flex-1 text-xs text-slate-700 leading-snug">
            <span className="text-[#d9222a] font-serif text-lg font-extrabold mr-1">“</span>
            <span className="italic font-medium">
              India&apos;s Digital Public Infrastructure has demonstrated how technology can expand opportunity, improve municipal responsiveness, and empower citizens with transparent civic redressal.
            </span>
          </div>

          <div className="hidden sm:block text-right shrink-0 border-l border-slate-200 pl-3">
            <span className="text-[10px] font-mono font-bold text-slate-900 block">CPGRAMS 3.0</span>
            <span className="text-[9px] text-slate-400">National Framework</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 7. BOTTOM COOKIE CONSENT BANNER (IDENTICAL TO SCREENSHOT)     */}
      {/* ------------------------------------------------------------- */}
      {showCookieBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white text-slate-900 border-t border-slate-200 shadow-2xl px-4 sm:px-8 py-3 transition-transform animate-fade-in">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5 max-w-2xl">
              <strong className="text-slate-900 font-bold block sm:inline mr-1">
                This website uses cookies to provide a better user experience.
              </strong>
              <span className="text-slate-600">
                By clicking accept, you agree to the policies outlined in the{' '}
                <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">
                  Cookie Settings
                </span>
                .
              </span>
            </div>

            <div className="flex items-center space-x-2 flex-wrap gap-y-2">
              <button
                type="button"
                onClick={() => setShowCookieBanner(false)}
                className="px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-100 text-[11px] font-bold text-slate-700 tracking-wider uppercase cursor-pointer"
              >
                Customize Cookies
              </button>
              <button
                type="button"
                onClick={() => setShowCookieBanner(false)}
                className="px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-100 text-[11px] font-bold text-slate-700 tracking-wider uppercase cursor-pointer"
              >
                Decline Optional Cookies
              </button>
              <button
                type="button"
                id="accept-all-cookies-btn"
                onClick={handleAcceptCookies}
                className="px-4 py-1.5 rounded bg-[#d9222a] hover:bg-[#c01a21] text-white text-[11px] font-bold tracking-wider uppercase shadow-xs cursor-pointer transition-colors"
              >
                Accept All Cookies
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SLA Calendar Modal */}
      {showCalendarModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-[#d9222a]" />
                <h3 className="text-sm font-bold text-slate-900">
                  Municipal Redressal Calendar & SLAs
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCalendarModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <p>
                Under the Citizen Charter, municipal complaints are triaged 24/7. Field inspection crews operate during scheduled municipal shifts:
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Emergency & Water Leakage:</span>
                  <strong className="text-emerald-700">4 to 12 Hours SLA</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pothole & Asphalt Repair:</span>
                  <strong className="text-amber-700">24 to 48 Hours SLA</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sanitation & Bin Clearance:</span>
                  <strong className="text-blue-700">12 to 24 Hours SLA</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Streetlight Fixture:</span>
                  <strong className="text-purple-700">24 to 48 Hours SLA</strong>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowCalendarModal(false)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Close Calendar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
