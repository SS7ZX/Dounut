// src/app/login/LoginContent.tsx
// Client-side login content with useSearchParams

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function LoginContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl  = searchParams.get('callbackUrl');
  const redirect     = searchParams.get('redirect') ?? callbackUrl ?? '/dashboard';
  const errorParam   = searchParams.get('error');

  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);
  const [gLoading, setGLoading]   = useState(false);
  const [mounted, setMounted]     = useState(false);

  useEffect(() => {
    setMounted(true);
    if (errorParam === 'exchange_failed') {
      setError('Verifikasi gagal. Coba login ulang.');
    } else if (errorParam === 'auth_failed') {
      setError('Login dibatalkan atau gagal. Coba lagi.');
    }
  }, [errorParam]);

  const handleGoogle = async () => {
    setGLoading(true);
    setError(null);

    const { error: oauthErr } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // redirectTo: harus terdaftar di Supabase Dashboard
        redirectTo: `${window.location.origin}/auth/callback?next=${redirect}`,
      },
    });

    if (oauthErr) {
      setError('Google login gagal: ' + oauthErr.message);
      setGLoading(false);
    }
    // If success, browser auto-redirects — no need to setLoading(false)
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });

    if (signInErr) {
      setError('Email atau password salah.');
      setLoading(false);
      return;
    }

    if (typeof window !== 'undefined') {
      document.cookie = 'customer_token=1; path=/; max-age=3600; sameSite=strict';
    }

    router.push(redirect);
    router.refresh();
  };

  if (!mounted) return null;

  const busy = loading || gLoading;

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4 py-12">
      <div aria-hidden className="absolute top-1/4 left-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <span className="font-playfair text-2xl font-black italic text-stone-50 hover:text-amber-400 transition-colors">
                Nostimo
              </span>
            </Link>
            <h1 className="text-xl font-bold text-stone-100">Selamat datang kembali</h1>
            <p className="text-sm text-stone-500 mt-1.5">Masuk untuk melanjutkan pesananmu</p>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-stone-100 disabled:opacity-60 disabled:cursor-not-allowed text-stone-800 font-semibold text-sm py-3 rounded-xl border border-stone-200 transition-all duration-150 mb-5"
          >
            {gLoading ? <Loader2 size={18} className="animate-spin text-stone-500" /> : <GoogleIcon />}
            {gLoading ? 'Menghubungkan ke Google...' : 'Lanjutkan dengan Google'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-stone-800" />
            <span className="text-xs text-stone-600">atau masuk dengan email</span>
            <div className="flex-1 h-px bg-stone-800" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmail} noValidate className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-stone-400">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600 pointer-events-none" />
                <input
                  id="email" type="email" autoComplete="email" required
                  placeholder="nama@email.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  disabled={busy}
                  className="input-nostimo pl-10"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-semibold text-stone-400">Password</label>
                <Link href="/forgot-password" className="text-xs text-amber-500 hover:text-amber-400 transition-colors">
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600 pointer-events-none" />
                <input
                  id="password" type={showPw ? 'text' : 'password'}
                  autoComplete="current-password" required
                  placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  disabled={busy}
                  className="input-nostimo pl-10 pr-10"
                />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-400 transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div role="alert" className="flex items-start gap-2.5 bg-rose-950/60 border border-rose-900/80 rounded-xl px-4 py-3">
                <AlertCircle size={15} className="text-rose-400 shrink-0 mt-0.5" />
                <p className="text-sm text-rose-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={busy || !email || !password}
              className="mt-1 w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-700 disabled:cursor-not-allowed text-stone-950 font-black py-3.5 rounded-xl transition-all duration-150 text-sm"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" />Memproses...</> : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6">
            Belum punya akun?{' '}
            <Link href="/register" className="text-amber-400 font-semibold hover:text-amber-300 transition-colors">
              Daftar sekarang
            </Link>
          </p>
        </div>

        <p className="text-center mt-5">
          <Link href="/" className="text-xs text-stone-600 hover:text-stone-400 transition-colors">
            ← Kembali ke toko
          </Link>
        </p>
      </motion.div>
    </div>
  );
}