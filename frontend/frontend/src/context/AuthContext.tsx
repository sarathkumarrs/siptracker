// frontend/src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react'; // Keep React for JSX, but import hooks directly
import type { ReactNode } from 'react'; // <-- Fix: Type-only import for ReactNode

import { supabase } from '../supabaseClient';
import type { Session, User, SupabaseClient } from '@supabase/supabase-js'; // <-- Fix: Type-only import for Session, User, SupabaseClient

// 1. Define the type for the AuthContext value
interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  supabase: SupabaseClient; // The Supabase client instance
  signIn: (email: string, password: string) => Promise<{ user: User | null; session: Session | null; } | null>;
  signOut: () => Promise<void>;
}

// 2. Create the context, initially null, but cast to the type we expect it to hold
const AuthContext = createContext<AuthContextType | null>(null);

// 3. AuthProvider component that wraps your app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error fetching session:", error);
          setSession(null);
          setUser(null);
        } else {
          setSession(session);
          // Ensure session.user exists before setting
          setUser(session?.user || null);
        }
      } catch (err) {
        console.error("Unexpected error in fetchSession:", err);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        // Ensure session.user exists before setting
        setUser(session?.user || null);
        console.log('Auth state changed:', event, session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    session,
    user,
    loading,
    supabase,
    signIn: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error("Supabase Sign In Error:", error);
        throw error;
      }
      return data;
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Supabase Sign Out Error:", error);
        throw error;
      }
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 5. Custom hook to consume the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};