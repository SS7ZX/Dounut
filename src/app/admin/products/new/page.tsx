'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, ImagePlus, CheckCircle2, AlertCircle, Plus, Sparkles } from 'lucide-react';
import { ProductService } from '@/lib/supabase';
import { BADGE_CONFIG, formatIDR } from '@/lib/utils';
import type { ProductBadge } from '@/types';

const BADGE_OPTIONS: (ProductBadge | null)[] = [null, 'best_seller', 'new', 'limited', 'sold_out'];

export default function AdminProductCreatePage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Donat Premium');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [badge, setBadge] = useState<ProductBadge | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Auto-format currency untuk preview
  const formattedPrice = useMemo(() => {
    const value = Number(price.replace(/[^0-9]/g, ''));
    return Number.isNaN(value) ? 'IDR 0' : formatIDR(value);
  }, [price]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const cleanedPrice = Number(price.replace(/[^0-9]/g, ''));
    const cleanedStock = Number(stock.replace(/[^0-9]/g, ''));

    // Validasi Premium
    if (!name.trim() || !category.trim() || !description.trim() || !imageUrl.trim()) {
      setError('Mohon lengkapi semua field utama (Badge opsional).');
      return;
    }
    if (cleanedPrice <= 0) {
      setError('Harga donat harus lebih dari IDR 0.');
      return;
    }
    if (cleanedStock < 0) {
      setError('Stok tidak bisa bernilai negatif.');
      return;
    }

    setLoading(true);

    const payload = {
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      price: cleanedPrice,
      stock: cleanedStock,
      image_url: imageUrl.trim(),
      badge,
      is_available: isAvailable,
      sort_order: 999, // Default di akhir
    };

    const { data, error: createError } = await ProductService.create(payload);
    setLoading(false);

    if (createError || !data) {
      setError(createError ?? 'Koneksi ke database terputus. Silakan coba lagi.');
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push('/admin/products');
    }, 1200); // Sedikit lebih lama biar animasinya kelihatan
  };

  // Variasi animasi standar
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.05),rgba(255,255,255,0))] px-4 py-8 sm:px-6 lg:px-10 font-sans">
      <div className="mx-auto max-w-6xl">
        
        {/* Header Section */}
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeIn}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between mb-10"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-500">Dashboard / Katalog</p>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white">Tambah Donat.</h1>
            <p className="max-w-xl text-sm sm:text-base text-stone-400 font-medium">
              Buat listing produk premium baru. Detail ini akan langsung tersinkronisasi dengan tampilan depan toko.
            </p>
          </div>

          <div className="flex justify-start md:justify-end">
            <Link
              href="/admin/products"
              className="group inline-flex items-center gap-2 rounded-full border border-stone-800 bg-stone-900/50 px-5 py-3 text-sm font-bold text-stone-300 transition-all hover:border-amber-500/50 hover:text-white hover:bg-stone-900 shadow-sm hover:shadow-amber-500/10"
            >
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              Batal & Kembali
            </Link>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
          
          {/* KOLOM KIRI: Form Input */}
          <motion.section 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.1, duration: 0.5 }}
            className="rounded-[2.5rem] border border-stone-800/60 bg-stone-900/40 p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Detail Form</h2>
                <p className="text-sm text-stone-500 font-medium mt-1">Pastikan URL gambar valid dan berkualitas tinggi.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block space-y-2 group">
                  <span className="text-sm font-bold text-stone-300 group-focus-within:text-amber-400 transition-colors">Nama Donat</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Glazed Caramel Crunch"
                    className="w-full rounded-2xl border border-stone-800 bg-stone-950/50 px-5 py-4 text-sm font-medium text-stone-100 outline-none transition-all focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 focus:bg-stone-900"
                  />
                </label>

                <label className="block space-y-2 group">
                  <span className="text-sm font-bold text-stone-300 group-focus-within:text-amber-400 transition-colors">Kategori</span>
                  <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Donat Premium"
                    className="w-full rounded-2xl border border-stone-800 bg-stone-950/50 px-5 py-4 text-sm font-medium text-stone-100 outline-none transition-all focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 focus:bg-stone-900"
                  />
                </label>
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                <label className="block space-y-2 group">
                  <span className="text-sm font-bold text-stone-300 group-focus-within:text-amber-400 transition-colors">Harga (IDR)</span>
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="15000"
                    inputMode="numeric"
                    className="w-full rounded-2xl border border-stone-800 bg-stone-950/50 px-5 py-4 text-sm font-bold text-amber-500 outline-none transition-all focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 focus:bg-stone-900 placeholder:text-stone-700"
                  />
                </label>

                <label className="block space-y-2 group">
                  <span className="text-sm font-bold text-stone-300 group-focus-within:text-amber-400 transition-colors">Stok Tersedia</span>
                  <input
                    value={stock}
                    onChange={(e) => setStock(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="10"
                    inputMode="numeric"
                    className="w-full rounded-2xl border border-stone-800 bg-stone-950/50 px-5 py-4 text-sm font-medium text-stone-100 outline-none transition-all focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 focus:bg-stone-900"
                  />
                </label>

                <label className="block space-y-2 group">
                  <span className="text-sm font-bold text-stone-300 group-focus-within:text-amber-400 transition-colors">Status</span>
                  <select
                    value={isAvailable ? 'available' : 'draft'}
                    onChange={(e) => setIsAvailable(e.target.value === 'available')}
                    className="w-full rounded-2xl border border-stone-800 bg-stone-950/50 px-5 py-4 text-sm font-medium text-stone-100 outline-none transition-all focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 focus:bg-stone-900 appearance-none"
                  >
                    <option value="available">🟢 Tersedia (Publik)</option>
                    <option value="draft">⚪ Nonaktif (Draft)</option>
                  </select>
                </label>
              </div>

              <label className="block space-y-2 group">
                <span className="text-sm font-bold text-stone-300 group-focus-within:text-amber-400 transition-colors">URL Gambar Resolusi Tinggi</span>
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full rounded-2xl border border-stone-800 bg-stone-950/50 px-5 py-4 text-sm font-medium text-stone-100 outline-none transition-all focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 focus:bg-stone-900"
                />
              </label>

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block space-y-2 group">
                  <span className="text-sm font-bold text-stone-300 group-focus-within:text-amber-400 transition-colors">Label Tambahan (Badge)</span>
                  <select
                    value={badge ?? ''}
                    onChange={(e) => setBadge(e.target.value ? (e.target.value as ProductBadge) : null)}
                    className="w-full rounded-2xl border border-stone-800 bg-stone-950/50 px-5 py-4 text-sm font-medium text-stone-100 outline-none transition-all focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 focus:bg-stone-900 appearance-none"
                  >
                    <option value="">-- Tanpa Badge --</option>
                    {BADGE_OPTIONS.filter((option) => option !== null).map((option) => (
                      <option key={option} value={option}>{BADGE_CONFIG[option!].label}</option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-2 group">
                  <span className="text-sm font-bold text-stone-300 group-focus-within:text-amber-400 transition-colors">Deskripsi Menggoda</span>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Ceritakan kombinasi rasa, tekstur, dan kenapa donat ini wajib dibeli..."
                    className="w-full rounded-2xl border border-stone-800 bg-stone-950/50 px-5 py-4 text-sm font-medium text-stone-100 outline-none transition-all focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 focus:bg-stone-900 resize-none"
                  />
                </label>
              </div>

              {/* Error & Success Messages with Animation */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm font-medium text-rose-200 flex items-center gap-3">
                      <AlertCircle size={18} className="text-rose-400 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  </motion.div>
                )}

                {success && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm font-medium text-emerald-200 flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                      <span>Produk berhasil mengudara! Mengalihkan...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading || success}
                className="group relative flex w-full items-center justify-center gap-3 rounded-full bg-amber-500 px-6 py-5 text-sm font-black uppercase tracking-[0.15em] text-stone-950 shadow-[0_0_40px_rgba(245,158,11,0.2)] transition-all hover:bg-amber-400 hover:shadow-[0_0_60px_rgba(245,158,11,0.4)] hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : success ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <Plus size={20} className="transition-transform group-hover:rotate-90" />
                )}
                <span>{loading ? 'Menyimpan...' : success ? 'Tersimpan!' : 'Listing Produk Sekarang'}</span>
              </button>
            </form>
          </motion.section>

          {/* KOLOM KANAN: Live Preview (Sticky on Desktop) */}
          <motion.aside 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:sticky lg:top-8 rounded-[2.5rem] border border-stone-800/60 bg-stone-900/40 p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
          >
            <div className="flex items-center gap-4 mb-8 border-b border-stone-800 pb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-800 text-stone-300 shadow-inner">
                <ImagePlus size={20} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Live Preview</p>
                <h2 className="text-xl font-black text-white">Tampilan User</h2>
              </div>
            </div>

            <div className="group relative rounded-[2rem] border border-stone-800/50 bg-[#FDFCFB] overflow-hidden shadow-xl transition-all hover:shadow-2xl">
              {/* Dummy "New" Badge Absolute for visual flair like storefront */}
              {badge && (
                <div className={`absolute top-4 left-4 z-10 rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-widest shadow-lg ${BADGE_CONFIG[badge].bg} ${BADGE_CONFIG[badge].text}`}>
                  {BADGE_CONFIG[badge].label}
                </div>
              )}
              
              <div className="relative h-48 w-full bg-stone-100 p-6 flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="h-full w-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-110" 
                  />
                ) : (
                  <div className="text-stone-300 flex flex-col items-center gap-2">
                    <ImagePlus size={40} className="opacity-50" />
                    <span className="text-xs font-bold uppercase tracking-widest opacity-50">Menunggu Gambar</span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-black italic uppercase tracking-tight text-stone-900 line-clamp-1">
                  {name || 'Nama Donat'}
                </h3>
                <p className="mt-2 text-sm font-medium text-stone-500 line-clamp-2 leading-relaxed">
                  {description || 'Deskripsi estetik yang bikin ngiler akan muncul di sini...'}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-xl font-black text-amber-600">
                    {formattedPrice}
                  </p>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-white shadow-md">
                    <Plus size={18} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-stone-800/50 bg-stone-950/50 p-6">
              <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles size={14} className="text-amber-500"/>
                Sistem Data
              </h4>
              <ul className="space-y-3 text-sm font-medium">
                <li className="flex justify-between items-center">
                  <span className="text-stone-500">Kategori</span>
                  <span className="text-stone-200">{category || '-'}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-stone-500">Stok Induk</span>
                  <span className="text-stone-200">{stock || '0'} Pcs</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-stone-500">Visibilitas</span>
                  <span className={isAvailable ? 'text-emerald-400' : 'text-rose-400'}>
                    {isAvailable ? 'Publik' : 'Disembunyikan'}
                  </span>
                </li>
              </ul>
            </div>
          </motion.aside>

        </div>
      </div>
    </div>
  );
}