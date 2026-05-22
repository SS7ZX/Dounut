'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Props {
  redirectTo?: string;
}

export default function AdminLoginContent({ redirectTo = '/admin/dashboard' }: Props) {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl  = searchParams.get('callbackUrl');
  const errorParam   = searchParams.get('error');

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [mounted, setMounted]   = useState(false);
  const [success, setSuccess]   = useState(false);

  useEffect(() => {
    setMounted(true);
    if (errorParam === 'not_admin')       setError('Akun ini tidak memiliki akses admin.');
    if (errorParam === 'exchange_failed') setError('Verifikasi gagal. Coba lagi.');
    if (errorParam === 'auth_failed')     setError('Login dibatalkan. Coba lagi.');
  }, [errorParam]);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError('Email dan password tidak boleh kosong.');
      setLoading(false);
      return;
    }

    const { data, error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
    if (signInErr) { 
      setError('Email atau password salah.'); 
      setLoading(false); 
      return; 
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profile?.role !== 'admin') {
      await supabase.auth.signOut();
      setError('Akun ini tidak memiliki akses admin.');
      setLoading(false);
      return;
    }

    // Set middleware cookie so admin middleware accepts /admin routes
    if (typeof window !== 'undefined') {
      document.cookie = 'admin_token=1; path=/; max-age=3600; sameSite=strict';
    }

    setSuccess(true);
    setTimeout(() => {
      const target = callbackUrl?.startsWith('/admin') ? callbackUrl : redirectTo;
      router.push(target);
      router.refresh();
    }, 800);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      {/* Animated background gradient */}
      <div aria-hidden className="fixed top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div aria-hidden className="fixed bottom-1/4 right-1/4 w-80 h-80 bg-amber-400/3 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm sm:max-w-md relative z-10"
      >
        {/* Card Container */}
        <div className="bg-stone-900/80 backdrop-blur-xl border border-stone-800/60 rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
          {/* Top gradient accent line */}
          <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

          {/* Content */}
          <div className="px-6 sm:px-8 pt-8 sm:pt-10 pb-7 sm:pb-8">
            {/* Header Section */}
            <div className="text-center mb-8 sm:mb-10">
              <Link href="/" className="inline-block group">
                <p className="font-playfair text-4xl sm:text-5xl font-black italic text-white group-hover:text-amber-400 transition-colors duration-300">
                  Nostimo
                </p>
              </Link>

              {/* Admin Badge */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 bg-gradient-to-r from-amber-500/20 to-amber-400/10 border border-amber-500/30 rounded-full"
              >
                <ShieldCheck size={14} className="text-amber-400 flex-shrink-0" />
                <span className="text-xs font-bold text-amber-300 tracking-widest uppercase">Admin Panel</span>
              </motion.div>

              <p className="text-base sm:text-lg font-bold text-stone-50 mt-4">Masuk Panel Admin</p>
              <p className="text-xs sm:text-sm text-stone-500 mt-1.5">Kelola toko Nostimo dengan aman</p>
            </div>

            {/* Form */}
            <form onSubmit={handleEmail} noValidate className="flex flex-col gap-4">
              {/* Email Field */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="adm-email" className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Email Admin</label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600 group-focus-within:text-amber-400 pointer-events-none transition-colors" />
                  <input 
                    id="adm-email" 
                    type="email" 
                    autoComplete="email" 
                    required
                    placeholder="admin@nostimo.id"
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    disabled={loading || success}
                    className="w-full h-12 bg-stone-800/50 border border-stone-700 hover:border-stone-600 focus:border-amber-500 rounded-2xl pl-11 pr-4 text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="adm-password" className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Password</label>
                <div className="relative group">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600 group-focus-within:text-amber-400 pointer-events-none transition-colors" />
                  <input 
                    id="adm-password" 
                    type={showPw ? 'text' : 'password'} 
                    autoComplete="current-password" 
                    required
                    placeholder="••••••••"
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    disabled={loading || success}
                    className="w-full h-12 bg-stone-800/50 border border-stone-700 hover:border-stone-600 focus:border-amber-500 rounded-2xl pl-11 pr-12 text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPw(s => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-400 p-1 rounded-lg hover:bg-stone-700/50 transition-all"
                    disabled={loading || success}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              <AnimateErrorAlert error={error} />

              {/* Success Alert */}
              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="status" 
                  className="flex items-start gap-3 bg-green-950/60 border border-green-900/50 rounded-2xl px-4 py-3"
                >
                  <CheckCircle2 size={16} className="text-green-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-green-300 font-medium">Login berhasil! Mengalihkan...</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading || success || !email.trim() || !password.trim()}
                className="w-full h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:from-stone-700 disabled:to-stone-700 disabled:cursor-not-allowed text-stone-950 font-black text-sm sm:text-base rounded-2xl transition-all duration-200 mt-2 shadow-lg shadow-amber-500/30 hover:shadow-lg hover:shadow-amber-500/40 active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Memverifikasi...</span>
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Berhasil!</span>
                  </>
                ) : (
                  'Masuk ke Admin Panel'
                )}
              </button>
            </form>

            {/* Footer Link */}
            <div className="mt-6 text-center pt-4 border-t border-stone-800/30">
              <Link 
                href="/" 
                className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-stone-400 transition-colors group"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                Kembali ke toko
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center text-[11px] text-stone-700 mt-6 px-2"
        >
          Panel admin hanya untuk pengguna yang terautentikasi dengan role admin
        </motion.p>
      </motion.div>
    </div>
  );
}

// Separate component for error alert animation
function AnimateErrorAlert({ error }: { error: string | null }) {
  return (
    error && (
      <motion.div 
        initial={{ opacity: 0, y: -8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.95 }}
        role="alert" 
        className="flex items-start gap-3 bg-rose-950/70 border border-rose-900/50 rounded-2xl px-4 py-3 backdrop-blur-sm"
      >
        <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-rose-300 font-medium leading-relaxed">{error}</p>
      </motion.div>
    )
  );
}
