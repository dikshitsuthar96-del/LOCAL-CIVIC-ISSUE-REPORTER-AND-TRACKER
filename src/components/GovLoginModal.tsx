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
  FileCheck,
  HelpCircle,
  ShieldCheck,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import { GovUser } from '../types.js';

interface GovLoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onLoginSuccess: (user: GovUser) => void;
  currentOfficer?: GovUser | null;
  isFullPageGateway?: boolean;
  onOpenCitizenPortal?: () => void;
  onOpenAuthMatrix?: () => void;
}

export const GovLoginModal: React.FC<GovLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentOfficer,
  isFullPageGateway = false,
  onOpenCitizenPortal,
  onOpenAuthMatrix,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [pin, setPin] = useState('citygov2026');
  const [demoOfficers, setDemoOfficers] = useState<GovUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch official demo profiles
  useEffect(() => {
    fetch('/api/gov/auth/demo-officers')
      .then((res) => res.json())
      .then((data) => {
        if (data.officers) {
          setDemoOfficers(data.officers);
        }
      })
      .catch((err) => console.error('Failed to load demo officers:', err));
  }, []);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your municipal badge number or official city email.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/gov/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), pin: pin.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication rejected by municipal directory server.');
      }

      // Store token in localStorage for persistence
      localStorage.setItem('metropolis_gov_token', data.token);
      localStorage.setItem('metropolis_gov_user', JSON.stringify(data.user));

      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify badge or PIN.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (officer: GovUser) => {
    setIsLoading(true);
    setError(null);
    setIdentifier(officer.badgeNumber);
    const pinToUse = officer.demoPin || 'citygov2026';
    setPin(pinToUse);

    try {
      const res = await fetch('/api/gov/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: officer.badgeNumber, pin: pinToUse }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication error.');
      }

      localStorage.setItem('metropolis_gov_token', data.token);
      localStorage.setItem('metropolis_gov_user', JSON.stringify(data.user));

      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const content = (
    <div className="space-y-6 text-slate-900 font-sans">
      {/* Official Government Top Warning Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-600 p-4 text-xs text-amber-950 rounded-r-xl shadow-xs">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold uppercase tracking-wider text-amber-900 flex items-center space-x-2">
              <span>WARNING: RESTRICTED GOVERNMENT COMPUTER NETWORK</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-amber-200/80 rounded font-mono">
                TITLE 18 U.S.C. § 1030
              </span>
            </p>
            <p className="text-[11px] text-amber-900/90 leading-relaxed">
              This municipal terminal is property of the City of Metropolis Department of Information Technology.
              Access is restricted exclusively to authorized civil servants, municipal dispatchers, and transparency auditors.
              All authentication requests, session keys, and administrative operations are cryptographically logged.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-300 text-rose-800 p-3.5 rounded-xl text-xs flex items-center space-x-2.5 animate-in fade-in">
          <BadgeAlert className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Primary Section: 1-Click Fast-Track Verified Officer Cards (For RBAC Testing) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-slate-200">
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Verified Municipal Officer Directory (Instant RBAC Evaluation)</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Select any official profile below to simulate that officer’s clearance level and jurisdiction:
            </p>
          </div>
          {onOpenAuthMatrix && (
            <button
              type="button"
              onClick={onOpenAuthMatrix}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
            >
              <span>View RBAC Matrix</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {demoOfficers.map((officer) => {
            const isCurrent = currentOfficer?.badgeNumber === officer.badgeNumber;
            return (
              <button
                key={officer.badgeNumber}
                type="button"
                onClick={() => handleQuickLogin(officer)}
                disabled={isLoading}
                className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  isCurrent
                    ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/30'
                    : 'border-slate-300 hover:border-indigo-500 hover:bg-slate-50 bg-white shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">
                          {officer.name}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500">
                          ({officer.badgeNumber})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium mt-0.5">{officer.title}</p>
                    </div>

                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                        officer.role === 'CITY_ADMIN'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : officer.role === 'DEPT_DISPATCHER'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : officer.role === 'FIELD_SUPERVISOR'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      {(officer.role || '').replace('_', ' ')}
                    </span>
                  </div>

                  <div className="mt-2 text-[10px]">
                    <p className="text-slate-500 truncate">
                      Jurisdiction: <span className="font-semibold text-slate-800">{officer.departmentName}</span>
                    </p>
                    {officer.role === 'DEPT_DISPATCHER' && officer.departmentId !== 'ALL' ? (
                      <span className="inline-flex items-center space-x-1 font-mono text-[9px] font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded mt-1 border border-amber-300">
                        <Lock className="w-2.5 h-2.5 text-amber-700" />
                        <span>Isolated: Cannot access other departments</span>
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono bg-slate-50 px-2 py-1 rounded border border-slate-200/80">
                    <span className="text-slate-500">PIN: <strong className="text-slate-700">{officer.demoPin || 'citygov2026'}</strong></span>
                    <span className="text-[9px] text-indigo-600 font-sans font-semibold">Click to Authenticate</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">
                    {officer.clearanceLevel}
                  </span>
                  <span className="text-indigo-600 font-bold flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink mx-4 text-xs text-slate-400 uppercase tracking-widest font-bold">
          Or Enter Official Badge Credentials Manually
        </span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      {/* Manual Badge & Security PIN Authentication Form */}
      <form onSubmit={handleLoginSubmit} className="space-y-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">Official Municipal Credential Verification</span>
          <button
            type="button"
            onClick={() => {
              setIdentifier('INVALID-BADGE-999');
              setPin('WrongPassword#123');
            }}
            className="text-[11px] text-rose-600 hover:text-rose-800 font-mono hover:underline cursor-pointer"
          >
            Test Invalid Credential Rejection →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Employee Badge # or Email
            </label>
            <div className="relative">
              <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. MUNI-001 or admin@metropolis.gov"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 bg-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Security PIN / Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Default demo PIN: citygov2026"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 bg-white font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <span className="text-[11px] text-slate-500 font-mono">
            Encrypted with TLS 1.3 • Token TTL: 24 Hours
          </span>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            {isLoading ? (
              <span>Verifying Credentials...</span>
            ) : (
              <>
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Verify Badge & Enter Console</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Role-Based Access Control Summary */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs text-slate-600 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-slate-900 flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <span>Role-Based Access Control (RBAC) Governance Architecture</span>
          </h4>
          {onOpenAuthMatrix && (
            <button
              type="button"
              onClick={onOpenAuthMatrix}
              className="text-[11px] text-indigo-600 hover:underline font-bold"
            >
              Full Permissions Breakdown →
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px] mt-2">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="font-bold text-purple-900 block">City Admin</span>
            <span className="text-[10px] text-purple-700 font-mono block">Level 4 Executive</span>
            <p className="text-slate-500 mt-1 text-[10px] leading-tight">
              Universal read/write authority across all city agencies, triage, and department reassignments.
            </p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="font-bold text-blue-900 block">Dept Dispatcher</span>
            <span className="text-[10px] text-blue-700 font-mono block">Level 2 Dispatcher</span>
            <p className="text-slate-500 mt-1 text-[10px] leading-tight">
              Operational triage & crew dispatch strictly within assigned municipal department jurisdiction.
            </p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="font-bold text-emerald-900 block">Field Supervisor</span>
            <span className="text-[10px] text-emerald-700 font-mono block">Level 3 Supervisor</span>
            <p className="text-slate-500 mt-1 text-[10px] leading-tight">
              Can update on-site repair status & completion proof. Cannot dismiss or reassign departments.
            </p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block">Civic Auditor</span>
            <span className="text-[10px] text-slate-700 font-mono block">Level 1 Oversight</span>
            <p className="text-slate-500 mt-1 text-[10px] leading-tight">
              Independent read-only transparency inspection. All mutation actions are blocked (HTTP 403).
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // If Full Page Gateway Mode: Render as complete page
  if (isFullPageGateway) {
    return (
      <div className="min-h-[90vh] bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 flex flex-col justify-center items-center">
        {/* Government Official Top Banner */}
        <div className="max-w-3xl w-full mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-amber-500/40 flex items-center justify-center shadow-lg">
              <Landmark className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="text-[11px] font-mono font-bold tracking-widest uppercase text-amber-400">
                City of Metropolis • Municipal Administration
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Government Simulator Authentication Gateway
              </h1>
            </div>
          </div>

          {onOpenCitizenPortal && (
            <button
              type="button"
              onClick={onOpenCitizenPortal}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Citizen Portal</span>
            </button>
          )}
        </div>

        {/* Gateway Box */}
        <div className="max-w-3xl w-full bg-white rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">
          <div className="bg-slate-900 text-white px-6 py-3.5 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-mono text-amber-400 font-bold uppercase tracking-wider">
              Protected Civil Operations Console // Level 3 Security
            </span>
            <span className="font-mono text-slate-400 text-[11px]">
              Metropolis Intranet Node: MUNI-GW-09
            </span>
          </div>
          <div className="p-6 sm:p-8 bg-white">
            {content}
          </div>
        </div>
      </div>
    );
  }

  // Modal Mode (When opened from within the simulator)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border-2 border-slate-700 shadow-2xl rounded-2xl max-w-2xl w-full overflow-hidden text-slate-900 font-sans">
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Landmark className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-amber-400">
                City of Metropolis • Department Operations
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Government Employee Authentication & Access Gateway
              </h2>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="p-6 max-h-[85vh] overflow-y-auto">
          {content}
        </div>
      </div>
    </div>
  );
};
