'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, ChevronLeft, ArrowRight, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
  const router = useRouter();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState(false);

  // Kalau sudah login → langsung ke dashboard
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/dashboard');
    });
  }, [router]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (name.trim().length < 2) {
      setError('Nama minimal 2 karakter.');
      return;
    }
    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }

    setLoading(true);

    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name.trim(),
          whatsapp:  whatsapp.trim(),
        },
      },
    });

    if (err) {
      if (err.message.includes('already registered')) {
        setError('Email ini sudah terdaftar. Silakan login.');
      } else {
        setError(err.message);
      }
      setLoading(false);
      return;
    }

    // Email confirm OFF → langsung dapat session → redirect
    if (data.session) {
      router.push('/dashboard');
      return;
    }

    // Email confirm ON → tampilkan pesan cek email
    setSuccess(true);
    setLoading(false);
  }

  async function handleGoogleRegister() {
    setLoading(true);
    setError('');

    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (err) {
      setError('Gagal daftar dengan Google. Coba lagi.');
      setLoading(false);
    }
  }

  /* ── Success Screen ────────────────────────────────────────────────────── */
  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-black text-stone-900 mb-3">Akun Berhasil Dibuat!</h1>
          <p className="text-stone-500 text-sm leading-relaxed mb-8">
            Kami mengirimkan link konfirmasi ke <strong>{email}</strong>.
            Cek inbox (dan folder spam) kamu, lalu klik link-nya untuk mengaktifkan akun.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-amber-500 text-white rounded-xl px-8 py-4 text-sm font-bold transition-all duration-300"
          >
            Ke Halaman Login
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  /* ── Main Form ─────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-white flex font-jakarta selection:bg-amber-200">

      {/* KIRI: Form */}
      <div className="w-full lg:w-1/2 flex flex-col px-6 md:px-16 lg:px-24 py-10">

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
              Buat Akun Baru.
            </h1>
            <p className="text-stone-500 font-medium text-sm">
              Daftar sekarang dan nikmati donat artisan premium Jakarta Selatan!
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 mb-5 text-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="flex-1">{error}</span>
              {error.includes('sudah terdaftar') && (
                <Link href="/login" className="font-bold underline whitespace-nowrap">Login →</Link>
              )}
            </div>
          )}

          {/* Form */}
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
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="tel"
                placeholder="Nomor WhatsApp (opsional)"
                value={whatsapp} onChange={e => setWhatsapp(e.target.value)}
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

            <button
              type="submit" disabled={loading}
              className="w-full bg-stone-900 hover:bg-amber-500 disabled:opacity-60 text-white rounded-xl py-4 text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg mt-2"
            >
              {loading
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : <>Daftar Sekarang <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              }
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="h-px bg-stone-200 flex-1" />
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Atau</span>
            <div className="h-px bg-stone-200 flex-1" />
          </div>

          {/* Google */}
          <button
            type="button" onClick={handleGoogleRegister} disabled={loading}
            className="w-full bg-white border-2 border-stone-200 hover:bg-stone-50 hover:border-stone-300 disabled:opacity-60 rounded-xl py-4 text-sm font-bold text-stone-700 flex items-center justify-center gap-3 transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
            </svg>
            Daftar dengan Google
          </button>

          <p className="mt-8 text-center text-sm font-medium text-stone-600">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-bold text-stone-900 hover:text-amber-600 underline underline-offset-4">
              Masuk di sini
            </Link>
          </p>

        </div>
      </div>

      {/* KANAN: Banner */}
      <div className="hidden lg:block lg:w-1/2 relative bg-amber-50 overflow-hidden">
        <Image src="/donat18.png" alt="Artisan Donuts" fill className="object-cover object-center scale-110 opacity-90" />
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
            "Daftar gratis dan dapatkan pengalaman belanja donat artisan terbaik!"
          </p>
          <p className="font-bold tracking-widest uppercase text-sm text-stone-300">— Nostimo Community</p>
        </div>
      </div>

    </div>
  );
}