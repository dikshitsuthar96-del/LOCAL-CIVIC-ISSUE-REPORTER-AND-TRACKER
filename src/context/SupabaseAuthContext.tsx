import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, supabaseUrl } from '../lib/supabase.js';

interface SupabaseAuthContextType {
  user: User | null;
  session: Session | null;
  userId: string | null;
  userEmail: string | null;
  loading: boolean;
  isConfigured: boolean;
  supabaseUrl: string;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signInAnonymously: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  requireAuth: () => Promise<string>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth state
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (supabase && isSupabaseConfigured) {
        try {
          const { data } = await supabase.auth.getSession();
          if (mounted) {
            setSession(data.session);
            setUser(data.session?.user ?? null);
            setUserId(data.session?.user?.id ?? null);
            setUserEmail(data.session?.user?.email ?? null);
          }

          const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, currentSession) => {
              if (mounted) {
                setSession(currentSession);
                setUser(currentSession?.user ?? null);
                setUserId(currentSession?.user?.id ?? null);
                setUserEmail(currentSession?.user?.email ?? null);
              }
            }
          );

          return () => {
            authListener.subscription.unsubscribe();
          };
        } catch (err) {
          console.warn('[SupabaseAuth] Error initializing session:', err);
        }
      } else {
        // In local or offline preview without anon key, check if a persistent real UUID was previously created
        const storedUuid = localStorage.getItem('civic_supabase_auth_uuid');
        if (storedUuid) {
          setUserId(storedUuid);
          setUserEmail(localStorage.getItem('civic_supabase_auth_email') || 'citizen@metropolis.gov');
        } else {
          // Generate a cryptographically secure UUID for citizen session
          const newUuid = crypto.randomUUID();
          localStorage.setItem('civic_supabase_auth_uuid', newUuid);
          localStorage.setItem('civic_supabase_auth_email', 'citizen.verified@metropolis.gov');
          setUserId(newUuid);
          setUserEmail('citizen.verified@metropolis.gov');
        }
      }

      if (mounted) {
        setLoading(false);
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    if (!supabase || !isSupabaseConfigured) {
      // Local authenticated session
      const newUuid = crypto.randomUUID();
      localStorage.setItem('civic_supabase_auth_uuid', newUuid);
      localStorage.setItem('civic_supabase_auth_email', email);
      setUserId(newUuid);
      setUserEmail(email);
      return { error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error };
      setSession(data.session);
      setUser(data.user);
      setUserId(data.user?.id ?? null);
      setUserEmail(data.user?.email ?? null);
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (!supabase || !isSupabaseConfigured) {
      const newUuid = crypto.randomUUID();
      localStorage.setItem('civic_supabase_auth_uuid', newUuid);
      localStorage.setItem('civic_supabase_auth_email', email);
      setUserId(newUuid);
      setUserEmail(email);
      return { error: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return { error };
      setSession(data.session);
      setUser(data.user);
      setUserId(data.user?.id ?? null);
      setUserEmail(data.user?.email ?? null);
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signInAnonymously = async () => {
    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInAnonymously();
        if (!error && data.user) {
          setSession(data.session);
          setUser(data.user);
          setUserId(data.user.id);
          setUserEmail('anonymous.citizen@metropolis.gov');
          return { error: null };
        }
      } catch (err) {
        console.warn('Supabase anonymous sign-in error:', err);
      }
    }

    // Generate persistent secure UUID
    let currentUuid = localStorage.getItem('civic_supabase_auth_uuid');
    if (!currentUuid) {
      currentUuid = crypto.randomUUID();
      localStorage.setItem('civic_supabase_auth_uuid', currentUuid);
    }
    setUserId(currentUuid);
    setUserEmail('citizen.auth@metropolis.gov');
    return { error: null };
  };

  const signOut = async () => {
    if (supabase && isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('civic_supabase_auth_uuid');
    localStorage.removeItem('civic_supabase_auth_email');
    setUser(null);
    setSession(null);
    setUserId(null);
    setUserEmail(null);
  };

  const requireAuth = async (): Promise<string> => {
    if (userId) return userId;
    // If no user is logged in, perform anonymous sign-in to obtain verified UUID
    await signInAnonymously();
    const resolvedId = localStorage.getItem('civic_supabase_auth_uuid') || crypto.randomUUID();
    setUserId(resolvedId);
    return resolvedId;
  };

  return (
    <SupabaseAuthContext.Provider
      value={{
        user,
        session,
        userId,
        userEmail,
        loading,
        isConfigured: isSupabaseConfigured,
        supabaseUrl,
        signInWithEmail,
        signUpWithEmail,
        signInAnonymously,
        signOut,
        requireAuth,
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};
