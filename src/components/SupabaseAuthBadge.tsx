import React, { useState } from 'react';
import { useSupabaseAuth } from '../context/SupabaseAuthContext.js';
import { ShieldCheck, UserCheck, LogOut, KeyRound, Database, ExternalLink, X, CheckCircle2, AlertCircle } from 'lucide-react';

export const SupabaseAuthBadge: React.FC = () => {
  const { userId, userEmail, user, isConfigured, supabaseUrl, signInWithEmail, signUpWithEmail, signInAnonymously, signOut } = useSupabaseAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setAuthError('Please provide both email and password.');
      return;
    }
    setAuthError(null);
    setAuthSuccess(null);
    setIsSubmitting(true);

    try {
      const { error } = authMode === 'signin'
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password);

      if (error) {
        setAuthError(error.message || 'Authentication error');
      } else {
        setAuthSuccess(authMode === 'signin' ? 'Signed in successfully!' : 'Account registered successfully!');
        setTimeout(() => {
          setIsOpen(false);
          setAuthSuccess(null);
        }, 1200);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Unexpected auth error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestSession = async () => {
    setIsSubmitting(true);
    setAuthError(null);
    try {
      await signInAnonymously();
      setAuthSuccess('Authenticated with verified UUID session!');
      setTimeout(() => {
        setIsOpen(false);
        setAuthSuccess(null);
      }, 1000);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to initialize session');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Supabase Status Pill in Citizen Header */}
      <div className="flex items-center space-x-2 text-xs bg-slate-900 text-slate-100 px-3 py-1.5 rounded-xs border border-slate-700 shadow-xs">
        <div className="flex items-center space-x-1.5">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-emerald-300">Supabase:</span>
          <span className="text-[11px] text-slate-300 font-mono hidden sm:inline">pftkladzsrwgbxyyuowm</span>
        </div>

        <span className="text-slate-600">|</span>

        <div className="flex items-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-medium text-slate-300">UUID:</span>
          <span className="font-mono text-[11px] text-blue-300 max-w-[110px] sm:max-w-[150px] truncate" title={userId || ''}>
            {userId ? `${userId.substring(0, 8)}...${userId.substring(userId.length - 4)}` : 'Unassigned'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="ml-1 px-2 py-0.5 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xs transition-colors cursor-pointer"
        >
          Manage Auth
        </button>
      </div>

      {/* Supabase Auth Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white border-2 border-slate-800 rounded-xs shadow-2xl max-w-md w-full p-6 relative">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
              <div className="w-10 h-10 rounded-xs bg-emerald-100 flex items-center justify-center border border-emerald-300">
                <Database className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Supabase Civic Authentication</h3>
                <p className="text-xs text-slate-600">Row Level Security (RLS) & Verified User UUID</p>
              </div>
            </div>

            {/* Current Session Dossier */}
            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xs p-3">
              <div className="text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Database:</span>
                  <span className="text-emerald-700 font-bold">Connected (Supabase PG)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Active User UUID:</span>
                  <span className="text-blue-700 font-bold break-all text-[11px]">{userId || 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Citizen Email:</span>
                  <span className="text-slate-800 text-[11px]">{userEmail || 'Anonymous Session'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">RLS Scope:</span>
                  <span className="text-slate-700 text-[11px]">auth.uid() == civic_reports.user_id</span>
                </div>
              </div>
            </div>

            {authSuccess && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xs text-xs text-emerald-800 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{authSuccess}</span>
              </div>
            )}

            {authError && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xs text-xs text-rose-800 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Email / Password Form */}
            <form onSubmit={handleEmailSubmit} className="mt-4 space-y-3">
              <div className="flex border-b border-slate-200 mb-3">
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className={`pb-2 px-3 text-xs font-semibold cursor-pointer ${
                    authMode === 'signin' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-500'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className={`pb-2 px-3 text-xs font-semibold cursor-pointer ${
                    authMode === 'signup' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-500'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Citizen Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="citizen@example.com"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Authenticating...' : authMode === 'signin' ? 'Sign In with Supabase' : 'Create Supabase Account'}
                </button>

                <button
                  type="button"
                  onClick={handleGuestSession}
                  disabled={isSubmitting}
                  className="py-2 px-3 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xs cursor-pointer"
                >
                  Use Verified UUID
                </button>
              </div>
            </form>

            {userId && (
              <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="text-[11px] text-slate-500">Need to switch identity?</span>
                <button
                  type="button"
                  onClick={signOut}
                  className="text-xs text-rose-600 hover:text-rose-800 flex items-center space-x-1 cursor-pointer font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
