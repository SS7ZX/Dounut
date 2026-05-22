// src/app/auth/confirm/AuthConfirmContent.tsx
// Client-side handler untuk Supabase Implicit flow
// Membaca #access_token dari URL fragment dan set session

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AuthConfirmContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const next         = searchParams.get('next') ?? '/dashboard';
  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const [msg, setMsg]       = useState('Memverifikasi akun...');

  useEffect(() => {
    async function handleFragment() {
      // Get the full hash fragment
      const hash = window.location.hash;

      if (!hash || hash === '#') {
        // No fragment — check if session already exists
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.replace(next);
          return;
        }
        setStatus('error');
        setMsg('Tidak ada token ditemukan. Coba login ulang.');
        setTimeout(() => router.replace('/login'), 2500);
        return;
      }

      // Parse fragment params
      const params = new URLSearchParams(hash.substring(1));
      const accessToken  = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const errorDesc    = params.get('error_description');

      if (errorDesc) {
        setStatus('error');
        setMsg(`Error: ${errorDesc}`);
        setTimeout(() => router.replace('/login?error=auth_failed'), 2500);
        return;
      }

      if (!accessToken || !refreshToken) {
        setStatus('error');
        setMsg('Token tidak lengkap. Coba login ulang.');
        setTimeout(() => router.replace('/login'), 2500);
        return;
      }

      // Set session manually from tokens
      const { error } = await supabase.auth.setSession({
        access_token:  accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        setStatus('error');
        setMsg('Gagal memverifikasi sesi. Coba login ulang.');
        setTimeout(() => router.replace('/login'), 2500);
        return;
      }

      // Success — redirect
      router.replace(next);
    }

    handleFragment();
  }, [next, router]);

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center gap-4">
      {status === 'loading' ? (
        <>
          <Loader2 size={32} className="text-amber-500 animate-spin" />
          <p className="text-sm text-stone-400 font-medium">{msg}</p>
        </>
      ) : (
        <>
          <div className="w-12 h-12 rounded-full bg-rose-950 border border-rose-800 flex items-center justify-center">
            <span className="text-rose-400 text-xl">✕</span>
          </div>
          <p className="text-sm text-rose-400 font-medium max-w-xs text-center">{msg}</p>
          <p className="text-xs text-stone-600">Mengalihkan ke login...</p>
        </>
      )}
    </div>
  );
}