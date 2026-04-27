'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  // Kalau sudah login sebagai admin → redirect
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const { data: prof } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      if (prof?.role === 'admin') router.replace('/admin/dashboard');
    });
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });

    if (err) {
      setError('Email atau kata sandi salah.');
      setLoading(false);
      return;
    }

    // Cek apakah role = admin
    const { data: prof } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (prof?.role !== 'admin') {
      await supabase.auth.signOut();
      setError('Akun ini tidak memiliki akses admin.');
      setLoading(false);
      return;
    }

    router.push('/admin/dashboard');
  }

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <span className="font-playfair font-black italic text-3xl text-amber-500">Nostimo</span>
          <p className="text-stone-500 text-sm mt-2 font-medium">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8">
          <h1 className="text-xl font-black text-white mb-6">Masuk sebagai Admin</h1>

          {error && (
            <div className="flex items-center gap-3 bg-rose-950/50 border border-rose-900 text-rose-400 rounded-xl px-4 py-3 mb-5 text-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
              <input
                type="email" required autoComplete="email"
                placeholder="Email admin"
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 text-white placeholder:text-stone-500 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
              <input
                type="password" required autoComplete="current-password"
                placeholder="Kata sandi"
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 text-white placeholder:text-stone-500 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-stone-950 rounded-xl py-4 text-sm font-black transition-all duration-300 flex items-center justify-center gap-2 group mt-2"
            >
              {loading
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : <>Masuk <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              }
            </button>
          </form>
        </div>

        <p className="text-center text-stone-600 text-xs mt-6">
          Bukan admin?{' '}
          <a href="/" className="text-stone-400 hover:text-white transition-colors">Kembali ke toko</a>
        </p>
      </div>
    </div>
  );
}