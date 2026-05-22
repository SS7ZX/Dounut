// src/hooks/useAuth.ts
// NOSTIMO — Auth Hook
'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types';

export function useAuth() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let ignore = false;

    async function init() {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();

        if (!ignore && session?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (!ignore) setProfile(data as Profile | null);
        }
      } catch (err) {
        console.error('[useAuth] Init error:', err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    init();

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (ignore) return;

        if (session?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setProfile(data as Profile | null);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
    if (typeof window !== 'undefined') {
      document.cookie = 'admin_token=; path=/; max-age=0; sameSite=strict';
    }
  }, []);

  return {
    profile,
    loading,
    mounted,
    isLoggedIn: !!profile,
    isAdmin: profile?.role === 'admin',
    signOut,
  };
}