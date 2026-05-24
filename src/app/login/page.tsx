// src/app/login/page.tsx
// FIXED: baca callbackUrl DAN redirect param
// Jadi apapun param yang dikirim, login selalu redirect dengan benar

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  // ── CRITICAL FIX: baca KEDUA param ──────────────────────────────────────
  // callbackUrl = NextAuth pattern (dikirim oleh cart/page.tsx lama)
  // redirect    = Supabase pattern (yang kita pakai)
  // Prioritas: callbackUrl dulu, fallback ke redirect, lalu /dashboard
  const callbackUrl = searchParams.get('callbackUrl');
  const redirectParam = searchParams.get('redirect');
  const destination = callbackUrl ?? redirectParam ?? '/dashboard';
  // ────────────────────────────────────────────────────────────────────────

  const errorParam = searchParams.get('error');

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [mounted, setMounted]   = useState(false);

  useEffect(() => {
    setMounted(true);
    if (errorParam === 'exchange_failed' || errorParam === 'auth_failed') {
      setError('Login gagal. Coba lagi.');
    } else if (errorParam === 'no_code') {
      setError('Proses login terputus. Coba lagi.');
    }
  }, [errorParam]);

  const handleGoogle = async () => {
    setGLoading(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Kirim destination ke callback agar setelah Google auth,
        // user diarahkan ke halaman yang benar (misal: /checkout)
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(destination)}`,
      },
    });
    if (err) {
      setError('Google login gagal. Coba lagi.');
      setGLoading(false);
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: err } = await supabase.auth.signInWithPassword({ email, password });

    if (err) {
      setError('Email atau password salah.');
      setLoading(false);
      return;
    }

    // Redirect ke destination (bisa /checkout, /menu, /dashboard, dll)
    router.push(destination);
    router.refresh();
  };

  if (!mounted) return null;
  const busy = loading || gLoading;

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center px-5 py-10">
      <div aria-hidden className="fixed top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        {/* Redirect context hint — tunjukkan ke user mau ke mana */}
        {destination !== '/dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center gap-2.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-3"
          >
            <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-300 font-medium">
              Masuk dulu untuk melanjutkan ke{' '}
              <span className="font-bold text-amber-200">
                {destination === '/checkout' ? 'halaman checkout' :
                 destination === '/cart'     ? 'keranjang' :
                 destination}
              </span>
            </p>
          </motion.div>
        )}

        <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden">
          {/* Amber accent */}
          <div className="h-[3px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

          <div className="px-6 pt-8 pb-7 sm:px-8">
            {/* Brand */}
            <div className="text-center mb-7">
              <Link href="/" className="inline-block">
                <p className="font-playfair text-3xl font-black italic text-stone-50 hover:text-amber-400 transition-colors duration-200">
                  Nostimo
                </p>
              </Link>
              <p className="text-sm font-bold text-stone-100 mt-3">Selamat datang kembali</p>
              <p className="text-xs text-stone-500 mt-1">Masuk untuk melanjutkan</p>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={busy}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-stone-100 active:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed text-stone-800 font-semibold text-sm h-12 rounded-2xl border border-stone-200 transition-all duration-150"
            >
              {gLoading ? <Loader2 size={18} className="animate-spin text-stone-500" /> : <GoogleIcon />}
              {gLoading ? 'Menghubungkan...' : 'Lanjutkan dengan Google'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-stone-800" />
              <span className="text-xs text-stone-600 font-medium">atau</span>
              <div className="flex-1 h-px bg-stone-800" />
            </div>

            {/* Email form */}
            <form onSubmit={handleEmail} noValidate className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-stone-400">Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600 pointer-events-none" />
                  <input
                    id="email" type="email" autoComplete="email" inputMode="email" required
                    placeholder="nama@email.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    disabled={busy}
                    className="w-full h-12 bg-stone-800 border border-stone-700 rounded-xl pl-10 pr-4 text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 disabled:opacity-50 transition-all duration-150"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-xs font-semibold text-stone-400">Password</label>
                  <Link href="/reset" className="text-xs text-amber-500 hover:text-amber-400 transition-colors">
                    Lupa password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600 pointer-events-none" />
                  <input
                    id="password" type={showPw ? 'text' : 'password'} autoComplete="current-password" required
                    placeholder="••••••••"
                    value={password} onChange={e => setPassword(e.target.value)}
                    disabled={busy}
                    className="w-full h-12 bg-stone-800 border border-stone-700 rounded-xl pl-10 pr-12 text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 disabled:opacity-50 transition-all duration-150"
                  />
                  <button type="button" onClick={() => setShowPw(s => !s)}
                    aria-label={showPw ? 'Sembunyikan' : 'Tampilkan'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-400 p-1 transition-colors"
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  className="flex items-start gap-2.5 bg-rose-950/60 border border-rose-900 rounded-xl px-3.5 py-3"
                >
                  <AlertCircle size={15} className="text-rose-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-300 leading-relaxed">{error}</p>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={busy || !email || !password}
                className="w-full h-12 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 disabled:bg-stone-700 disabled:cursor-not-allowed text-stone-950 font-black text-sm rounded-2xl transition-all duration-150 mt-1 shadow-lg shadow-amber-500/20"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" />Memproses...</> : 'Masuk'}
              </button>
            </form>

            <p className="text-center text-xs text-stone-500 mt-5">
              Belum punya akun?{' '}
              <Link href={`/register?redirect=${encodeURIComponent(destination)}`}
                className="text-amber-400 font-bold hover:text-amber-300 transition-colors"
              >
                Daftar gratis
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-4">
          <Link href="/" className="text-xs text-stone-700 hover:text-stone-500 transition-colors">
            ← Kembali ke toko
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <Loader2 size={28} className="text-amber-500 animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}