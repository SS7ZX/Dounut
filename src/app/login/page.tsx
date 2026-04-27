'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, User, ChevronLeft, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type AuthView = 'login' | 'register' | 'forgot';

export default function CustomerAuthPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirectTo   = searchParams.get('redirect') || '/dashboard';

  const [view,     setView]     = useState<AuthView>('login');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  // Form state
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');

  // If already logged in → redirect
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace(redirectTo);
    });
  }, [router, redirectTo]);

  // Clear messages when switching views
  useEffect(() => {
    setError('');
    setSuccess('');
  }, [view]);

  /* ── Handlers ─────────────────────────────────────────────────────────── */

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: err } = await supabase.auth.signInWithPassword({ email, password });

    if (err) {
      setError('Email atau kata sandi salah. Silakan coba lagi.');
      setLoading(false);
      return;
    }

    // Redirect after login
    router.push(redirectTo);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      setLoading(false);
      return;
    }

    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    // Supabase by default requires email confirmation.
    // If email confirm is OFF in Supabase dashboard → user is auto logged in.
    if (data.session) {
      router.push('/dashboard');
    } else {
      setSuccess('Akun berhasil dibuat! Cek email kamu untuk konfirmasi, lalu login.');
      setView('login');
    }
    setLoading(false);
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (err) {
      setError('Gagal mengirim email pemulihan. Pastikan email sudah terdaftar.');
    } else {
      setSuccess('Link pemulihan sudah dikirim! Cek inbox kamu.');
    }
    setLoading(false);
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setError('');

    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
      },
    });

    if (err) {
      setError('Gagal login dengan Google. Coba lagi.');
      setLoading(false);
    }
    // If success → Supabase will redirect to callback URL automatically
  }

  /* ── Render ───────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-white flex font-jakarta selection:bg-amber-200">

      {/* KIRI: Form */}
      <div className="w-full lg:w-1/2 flex flex-col px-6 md:px-16 lg:px-24 py-10 relative z-10">

        <Link href="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors w-max">
          <div className="bg-stone-50 p-2 rounded-full border border-stone-100">
            <ChevronLeft className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold">Kembali</span>
        </Link>

        <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto mt-12 lg:mt-0">

          {/* Heading */}
          <div className="mb-8">
            <span className="font-playfair font-black italic text-2xl text-amber-500 tracking-tight">Nostimo</span>
            <h1 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight mb-2 mt-2">
              {view === 'login'    && 'Selamat Datang Kembali.'}
              {view === 'register' && 'Buat Akun Baru.'}
              {view === 'forgot'   && 'Atur Ulang Sandi.'}
            </h1>
            <p className="text-stone-500 font-medium text-sm">
              {view === 'login'    && 'Masuk untuk melihat pesanan dan mengumpulkan poin.'}
              {view === 'register' && 'Daftar sekarang dan nikmati donat artisan premium!'}
              {view === 'forgot'   && 'Masukkan email dan kami kirim link pemulihan.'}
            </p>
          </div>

          {/* Alert: Error */}
          {error && (
            <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 mb-5 text-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Alert: Success */}
          {success && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 mb-5 text-sm font-medium">
              ✅ {success}
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="email" required autoComplete="email"
                  placeholder="Email kamu"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium text-sm outline-none"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="password" required autoComplete="current-password"
                  placeholder="Kata sandi"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium text-sm outline-none"
                />
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => setView('forgot')}
                  className="text-sm font-bold text-amber-600 hover:text-stone-900 transition-colors">
                  Lupa Sandi?
                </button>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-stone-900 hover:bg-amber-500 disabled:opacity-60 text-white rounded-xl py-4 text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Masuk Sekarang <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>
          )}

          {/* ── REGISTER FORM ── */}
          {view === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text" required
                  placeholder="Nama lengkap"
                  value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium text-sm outline-none"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="email" required autoComplete="email"
                  placeholder="Email aktif"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium text-sm outline-none"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="password" required autoComplete="new-password"
                  placeholder="Buat kata sandi (min. 6 karakter)"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium text-sm outline-none"
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-stone-900 hover:bg-amber-500 disabled:opacity-60 text-white rounded-xl py-4 text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Daftar Akun <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>
          )}

          {/* ── FORGOT FORM ── */}
          {view === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="email" required autoComplete="email"
                  placeholder="Email terdaftarmu"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium text-sm outline-none"
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-stone-900 hover:bg-amber-500 disabled:opacity-60 text-white rounded-xl py-4 text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Kirim Link Pemulihan'}
              </button>
            </form>
          )}

          {/* Divider + Google */}
          {view !== 'forgot' && (
            <>
              <div className="flex items-center gap-4 my-7">
                <div className="h-px bg-stone-200 flex-1" />
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Atau</span>
                <div className="h-px bg-stone-200 flex-1" />
              </div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white border-2 border-stone-200 hover:bg-stone-50 hover:border-stone-300 disabled:opacity-60 rounded-xl py-4 text-sm font-bold text-stone-700 flex items-center justify-center gap-3 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
                Lanjutkan dengan Google
              </button>
            </>
          )}

          {/* Toggle */}
          <div className="mt-8 text-center text-sm font-medium text-stone-600">
            {view === 'login' && (
              <p>Belum punya akun?{' '}
                <button onClick={() => setView('register')} className="font-bold text-stone-900 hover:text-amber-600 underline underline-offset-4">Daftar di sini</button>
              </p>
            )}
            {view === 'register' && (
              <p>Sudah punya akun?{' '}
                <button onClick={() => setView('login')} className="font-bold text-stone-900 hover:text-amber-600 underline underline-offset-4">Masuk di sini</button>
              </p>
            )}
            {view === 'forgot' && (
              <p>Kembali ke{' '}
                <button onClick={() => setView('login')} className="font-bold text-stone-900 hover:text-amber-600 underline underline-offset-4">Halaman Login</button>
              </p>
            )}
          </div>

        </div>
      </div>

      {/* KANAN: Banner */}
      <div className="hidden lg:block lg:w-1/2 relative bg-amber-50 overflow-hidden">
        <Image
          src="/donat18.png"
          alt="Artisan Donuts"
          fill
          className="object-cover object-center scale-110 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-2xl font-playfair italic leading-tight mb-4">
            "Donat artisan terbaik yang pernah saya coba. Teksturnya sangat lembut dan rasanya premium!"
          </p>
          <p className="font-bold tracking-widest uppercase text-sm text-stone-300">— Jakarta Foodies</p>
        </div>
      </div>

    </div>
  );
}