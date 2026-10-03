import React, { useState } from 'react';
import {
  Building2,
  Shield,
  LogOut,
  UserCheck,
  ChevronDown,
  Lock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { GovUser } from '../../types.js';

interface GovOfficerHeaderProps {
  currentOfficer: GovUser;
  onLogout: () => void;
  onSwitchOfficer?: (officer: GovUser) => void;
  onOpenCitizenPortal: () => void;
  onOpenAdminPortal?: () => void;
}

export const GovOfficerHeader: React.FC<GovOfficerHeaderProps> = ({
  currentOfficer,
  onLogout,
  onSwitchOfficer,
  onOpenCitizenPortal,
  onOpenAdminPortal,
}) => {
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);
  const [demoOfficers, setDemoOfficers] = useState<GovUser[]>([]);
  const [loadingDemoOfficers, setLoadingDemoOfficers] = useState(false);

  const fetchDemoOfficers = async () => {
    if (demoOfficers.length > 0) {
      setShowSwitchMenu(!showSwitchMenu);
      return;
    }
    setLoadingDemoOfficers(true);
    try {
      const res = await fetch('/api/gov/auth/demo-officers');
      const data = await res.json();
      if (data.officers) {
        setDemoOfficers(data.officers);
        setShowSwitchMenu(true);
      }
    } catch (err) {
      console.error('Failed to load demo officers:', err);
    } finally {
      setLoadingDemoOfficers(false);
    }
  };

  return (
    <header className="bg-[#0b2239] text-white rounded-md p-4 shadow-sm border-b-2 border-[#ea580c]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Department & Title */}
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-sm bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
            <Building2 className="w-6 h-6 text-[#ff9933]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-[#ea580c] text-white rounded-xs">
                Official Government Portal
              </span>
              <span className="text-white/40">•</span>
              <span className="text-xs text-white/90 font-medium">
                {currentOfficer.departmentName}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Municipal Grievance Redressal &amp; Continuous Monitoring Console
            </h1>
          </div>
        </div>

        {/* Right: Authenticated Officer Profile & Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Officer Identity Pill */}
          <div className="bg-white/10 hover:bg-white/15 transition-colors px-3 py-1.5 rounded-sm border border-white/20 flex items-center space-x-2.5 text-xs">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-white">{currentOfficer.name}</span>
                <span className="font-mono text-[10px] bg-black/40 text-orange-300 px-1 py-0.2 rounded">
                  {currentOfficer.badgeNumber}
                </span>
              </div>
              <div className="text-[10px] text-white/70 flex items-center space-x-1">
                <Shield className="w-2.5 h-2.5 text-orange-400 inline" />
                <span>{currentOfficer.role}</span>
                <span>•</span>
                <span className="font-mono text-emerald-300">{currentOfficer.clearanceLevel}</span>
              </div>
            </div>
          </div>

          {/* Quick Switch Officer Dropdown (for testing RBAC jurisdictions) */}
          <div className="relative">
            <button
              type="button"
              onClick={fetchDemoOfficers}
              className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-sm text-xs font-semibold border border-white/20 flex items-center space-x-1 cursor-pointer"
              title="Switch Officer Profile to test Departmental Isolation & RBAC"
            >
              <span>Switch Badge</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/70" />
            </button>

            {showSwitchMenu && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white text-slate-900 rounded-sm shadow-xl border border-slate-300 py-2 z-50 text-xs">
                <div className="px-3 py-1.5 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Select Officer Clearance (RBAC Test)
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                  {demoOfficers.map((officer) => (
                    <button
                      key={officer.badgeNumber}
                      type="button"
                      onClick={() => {
                        setShowSwitchMenu(false);
                        if (onSwitchOfficer) onSwitchOfficer(officer);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors flex items-start space-x-2 cursor-pointer"
                    >
                      <div className="w-5 h-5 rounded bg-blue-100 text-[#0b2239] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {officer.badgeNumber.slice(0, 3)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-900 truncate">{officer.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{officer.departmentName}</div>
                        <div className="text-[9px] font-mono text-orange-700">
                          {officer.role} • {officer.badgeNumber}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={onLogout}
            className="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-sm text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            title="Terminate municipal officer session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
