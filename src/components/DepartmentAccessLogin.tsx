import React, { useState, useEffect } from 'react';
import {
  Building2,
  Shield,
  KeyRound,
  UserCheck,
  Lock,
  AlertTriangle,
  BadgeAlert,
  CheckCircle2,
  ArrowRight,
  Landmark,
  ShieldCheck,
  Truck,
  Droplets,
  Trash2,
  Lightbulb,
  Trees,
  Crown,
  ChevronRight,
  User,
  Search,
  Globe,
} from 'lucide-react';
import { GovUser, Department } from '../types.js';
import { useLanguage } from '../context/LanguageContext.js';

interface DepartmentAccessLoginProps {
  onLoginSuccess: (user: GovUser) => void;
  onOpenCitizenPortal?: () => void;
  onOpenAdminPortal?: () => void;
}

interface DeptOption {
  id: string;
  nameEn: string;
  nameHi: string;
  shortNameEn: string;
  shortNameHi: string;
  code: string;
  icon: React.ElementType;
  descriptionEn: string;
  descriptionHi: string;
  badgePrefix: string;
  color: string;
  borderColor: string;
  bgLight: string;
}

const DEPARTMENT_OPTIONS: DeptOption[] = [
  {
    id: 'dept_transport',
    nameEn: 'Department of Transportation & Streets (Road Department)',
    nameHi: 'सड़क एवं परिवहन विभाग (सड़क विभाग / PWD)',
    shortNameEn: 'Road Department',
    shortNameHi: 'सड़क विभाग (Road Dept)',
    code: 'DOT-STR',
    icon: Truck,
    descriptionEn: 'Road repairs, potholes, asphalt paving, street markings, curbs & sidewalks.',
    descriptionHi: 'सड़क मरम्मत, गड्ढे, डामर पैचिंग, लेन मार्किंग, फुटपाथ एवं पैदल पथ।',
    badgePrefix: 'DOT',
    color: 'text-amber-700',
    borderColor: 'border-amber-300',
    bgLight: 'bg-amber-50',
  },
  {
    id: 'dept_water',
    nameEn: 'Municipal Water & Sewer Authority',
    nameHi: 'नगरपालिका जल एवं सीवर प्राधिकरण (Jal Board)',
    shortNameEn: 'Water & Sewer Dept',
    shortNameHi: 'जल बोर्ड (Jal Board)',
    code: 'MWSA-ENG',
    icon: Droplets,
    descriptionEn: 'Water main leaks, fire hydrant faults, storm drainage, sewage backup.',
    descriptionHi: 'जल आपूर्ति पाइपलाइन रिसाव, फायर हाइड्रेंट खराबी, सीवर जाम एवं नाला सफाई।',
    badgePrefix: 'WATER',
    color: 'text-blue-700',
    borderColor: 'border-blue-300',
    bgLight: 'bg-blue-50',
  },
  {
    id: 'dept_sanitation',
    nameEn: 'Department of Sanitation & Waste Management',
    nameHi: 'स्वच्छता एवं ठोस अपशिष्ट प्रबंधन विभाग (Swachh Bharat)',
    shortNameEn: 'Sanitation & Waste Dept',
    shortNameHi: 'स्वच्छता विभाग (Sanitation)',
    code: 'DSWM-OPS',
    icon: Trash2,
    descriptionEn: 'Garbage disposal, recycling overflow, dumpster clearances, street sweeping.',
    descriptionHi: 'कचरा उठाव, ओवरफ्लो डस्टबिन, सामुदायिक कंटेनर, सड़क सफाई एवं कीटनाशक।',
    badgePrefix: 'SAN',
    color: 'text-emerald-700',
    borderColor: 'border-emerald-300',
    bgLight: 'bg-emerald-50',
  },
  {
    id: 'dept_lighting',
    nameEn: 'Bureau of Street Lighting & Electrical',
    nameHi: 'पथ प्रकाश एवं विद्युत ब्यूरो (Street Lighting)',
    shortNameEn: 'Street Lighting Bureau',
    shortNameHi: 'विद्युत एवं पथ प्रकाश',
    code: 'BSL-ELEC',
    icon: Lightbulb,
    descriptionEn: 'Streetlamps, intersection lighting, electrical conduit repairs, signals.',
    descriptionHi: 'स्ट्रीट लाइट, अंधेरे चौराहे, केबलिंग खराबी, विद्युत पोल एवं ट्रैफिक सिग्नल।',
    badgePrefix: 'LIGHT',
    color: 'text-yellow-700',
    borderColor: 'border-yellow-300',
    bgLight: 'bg-yellow-50',
  },
  {
    id: 'dept_parks',
    nameEn: 'Parks, Urban Forestry & Public Space',
    nameHi: 'उद्यान, शहरी वानिकी एवं सार्वजनिक स्थल',
    shortNameEn: 'Parks & Forestry Dept',
    shortNameHi: 'उद्यान एवं वानिकी',
    code: 'PUF-ENV',
    icon: Trees,
    descriptionEn: 'Public parks, hazard tree limbs, turf maintenance, playground equipment.',
    descriptionHi: 'सार्वजनिक पार्क, खतरनाक पेड़ की टहनी, घास छंटाई एवं खेल उपकरण मरम्मत।',
    badgePrefix: 'PARKS',
    color: 'text-teal-700',
    borderColor: 'border-teal-300',
    bgLight: 'bg-teal-50',
  },
];

export const DepartmentAccessLogin: React.FC<DepartmentAccessLoginProps> = ({
  onLoginSuccess,
  onOpenCitizenPortal,
  onOpenAdminPortal,
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  // Step 1: Department Selection (defaults to Road Department for instant evaluation)
  const [selectedDeptId, setSelectedDeptId] = useState<string>('dept_transport');
  const [demoOfficers, setDemoOfficers] = useState<GovUser[]>([]);
  const [identifier, setIdentifier] = useState('');
  const [pin, setPin] = useState('citygov2026');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load demo officers on mount
  useEffect(() => {
    fetch('/api/gov/auth-matrix')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.demoOfficers) {
          setDemoOfficers(data.demoOfficers);
        }
      })
      .catch(() => {});
  }, []);

  const selectedDept = DEPARTMENT_OPTIONS.find((d) => d.id === selectedDeptId) || DEPARTMENT_OPTIONS[0];

  // Find demo officer matching selected department
  const matchingOfficer = demoOfficers.find((o) => o.departmentId === selectedDeptId) || {
    id: `gov_officer_${selectedDeptId}`,
    badgeNumber: `${selectedDept.badgePrefix}-402`,
    name:
      selectedDeptId === 'dept_transport'
        ? 'Marcus Sterling (Executive Engineer)'
        : selectedDeptId === 'dept_water'
        ? 'Priya Chen (Section Officer)'
        : selectedDeptId === 'dept_sanitation'
        ? 'David Ramos (Sanitation Superintendent)'
        : selectedDeptId === 'dept_lighting'
        ? 'Elena Rostova (Electrical Inspector)'
        : 'Sarah Jenkins (Forestry Officer)',
    role: 'DEPT_DISPATCHER' as const,
    departmentId: selectedDept.id,
    departmentName: selectedDept.nameEn,
    clearanceLevel: 'LEVEL_2_TACTICAL' as const,
    token: `metropolis_mock_token_${selectedDeptId}`,
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/gov/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim() || matchingOfficer.badgeNumber,
          pin,
          departmentId: selectedDeptId,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Authentication failed');
      }

      const data = await res.json();
      localStorage.setItem('metropolis_gov_user', JSON.stringify(data.user));
      localStorage.setItem('metropolis_gov_token', data.token);
      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check badge or PIN.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoOfficerLogin = (officer: GovUser) => {
    localStorage.setItem('metropolis_gov_user', JSON.stringify(officer));
    localStorage.setItem('metropolis_gov_token', officer.token);
    onLoginSuccess(officer);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 bg-[#07172c] text-slate-100 min-h-[calc(100vh-3.5rem)] select-none">
      {/* Official Indian Government Portal Header Card */}
      <div className="w-full max-w-4xl bg-[#0b203d] border border-[#1e3e6b] rounded-2xl shadow-2xl overflow-hidden mb-6">
        {/* Top Flag Stripe */}
        <div className="w-full h-1.5 flex">
          <div className="flex-1 bg-[#FF9933]"></div>
          <div className="flex-1 bg-[#FFFFFF]"></div>
          <div className="flex-1 bg-[#138808]"></div>
        </div>

        {/* National Emblem & Department Title Strip */}
        <div className="px-5 py-4 border-b border-[#1b3b68] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0a1b33]">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/60 flex items-center justify-center text-amber-300 font-bold text-2xl shadow-inner shrink-0">
              🏛️
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-amber-400 font-extrabold text-xs tracking-wider uppercase">
                  {t.govtOfIndia}
                </span>
                <span className="px-1.5 py-0.2 bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 rounded text-[9px] font-mono font-bold uppercase">
                  CPGRAMS SECURE
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight mt-0.5">
                {t.departmentPortal}
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">
                {t.satyamevaJayateNic}
              </p>
            </div>
          </div>

          {/* 1-Click Language Switcher Button */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center space-x-1.5 transition-transform active:scale-95 cursor-pointer shadow-sm"
              title="Change Language / भाषा बदलें"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{t.switchLang}</span>
            </button>
          </div>
        </div>

        {/* Two-Step Workflow Indicator */}
        <div className="grid grid-cols-2 text-center text-xs font-bold border-b border-[#1b3b68] bg-[#07172c]">
          <div className="py-2.5 px-3 bg-[#0d284d] text-amber-400 border-r border-[#1b3b68] flex items-center justify-center space-x-1.5">
            <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[11px] font-extrabold">1</span>
            <span>{t.step1SelectDept}</span>
          </div>
          <div className="py-2.5 px-3 text-slate-300 flex items-center justify-center space-x-1.5">
            <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[11px] font-extrabold">2</span>
            <span>{t.step2VerifyAuthority}</span>
          </div>
        </div>

        {/* Main Selection & Login Body */}
        <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0b203d]">
          {/* Left Column: Department Selection Cards (Step 1) */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Building2 className="w-4 h-4" />
                <span>{t.selectDeptToAccess}</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {DEPARTMENT_OPTIONS.length} {t.agenciesAvailable}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {t.deptIsolationNotice}
            </p>

            <div className="space-y-2 mt-3">
              {DEPARTMENT_OPTIONS.map((dept) => {
                const isSelected = selectedDeptId === dept.id;
                const Icon = dept.icon;

                return (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => {
                      setSelectedDeptId(dept.id);
                      setError(null);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
                      isSelected
                        ? 'bg-[#13335e] border-amber-400 shadow-md ring-1 ring-amber-400/40 text-white'
                        : 'bg-[#081930] hover:bg-[#0f294c] border-[#1e3e6b] text-slate-300'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold tracking-tight">
                          {language === 'hi' ? dept.nameHi : dept.nameEn}
                        </span>
                        <span className="font-mono text-[10px] uppercase font-bold text-amber-400/80 bg-slate-900/60 px-1.5 py-0.2 rounded ml-2 shrink-0">
                          {dept.code}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {language === 'hi' ? dept.descriptionHi : dept.descriptionEn}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="shrink-0 text-amber-400 pt-1">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Official Authority Authentication (Step 2) */}
          <div className="lg:col-span-6 bg-[#07172c] border border-[#1e3e6b] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{t.authorityAuthStep}</span>
              </div>

              {/* Selected Department Badge */}
              <div className="p-3 rounded-lg bg-[#0e274a] border border-[#244b7d] mb-4 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Landmark className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1 text-xs">
                  <span className="text-[10px] text-amber-400 font-mono font-bold uppercase block">
                    {t.accessingDeptQueue}
                  </span>
                  <span className="font-bold text-white text-xs truncate block">
                    {language === 'hi' ? selectedDept.nameHi : selectedDept.nameEn}
                  </span>
                </div>
              </div>

              {/* 1-Click Verified Officer Login for Selected Department */}
              <div className="mb-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{t.oneClickOfficerProfile}</span>
                  </span>
                  <span className="text-[9px] font-mono text-emerald-300 font-bold bg-emerald-900/60 px-1 rounded">
                    VERIFIED
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{matchingOfficer.name}</p>
                    <p className="text-[10px] font-mono text-slate-300">
                      {t.badgeLabel} <strong>{matchingOfficer.badgeNumber}</strong> • {t.pinLabel} <span className="text-amber-400">citygov2026</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoOfficerLogin(matchingOfficer)}
                    className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1 shrink-0 transition-all cursor-pointer shadow-sm"
                  >
                    <span>{t.loginBtn}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Manual Login Form */}
              <form onSubmit={handleLogin} className="space-y-3 text-xs">
                {error && (
                  <div className="p-2.5 rounded bg-rose-950/60 border border-rose-600/50 text-rose-200 text-xs flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {t.badgeOrEmailLabel}
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={matchingOfficer.badgeNumber}
                    className="w-full px-3 py-2 rounded bg-[#030d1a] border border-[#1b3b68] text-white focus:border-amber-400 focus:outline-none text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {t.securityPinLabel}
                  </label>
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter Security PIN (demo: citygov2026)"
                    className="w-full px-3 py-2 rounded bg-[#030d1a] border border-[#1b3b68] text-white focus:border-amber-400 focus:outline-none text-xs font-mono"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>
                    {isLoading
                      ? t.verifyingCredentials
                      : `${t.authenticateAndEnter} ${language === 'hi' ? selectedDept.shortNameHi : selectedDept.shortNameEn}`}
                  </span>
                </button>
              </form>
            </div>

            {/* Statutory Legal Warning Notice */}
            <div className="mt-4 pt-3 border-t border-[#1b3b68] text-[10px] text-slate-400 leading-normal flex items-start space-x-2">
              <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                {t.restrictedNetworkWarning}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Navigation Strip */}
        <div className="px-5 py-3 bg-[#061426] border-t border-[#1b3b68] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-400">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {t.digitalIndiaCommission}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs font-semibold">
            {onOpenAdminPortal && (
              <button
                type="button"
                onClick={onOpenAdminPortal}
                className="text-purple-400 hover:text-purple-300 cursor-pointer flex items-center space-x-1"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>{t.adminDashboard}</span>
              </button>
            )}
            {onOpenCitizenPortal && (
              <button
                type="button"
                onClick={onOpenCitizenPortal}
                className="text-indigo-400 hover:text-indigo-300 cursor-pointer flex items-center space-x-1"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t.citizenPortal}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
