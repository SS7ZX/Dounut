// src/app/(storefront)/menu/page.tsx
// FIXED: useCartStore (Zustand) bukan useCart (Context lama)
// Mobile-first premium product catalog

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Plus, Minus, CheckCircle2,
  Flame, Sparkles, Lock, Search, SlidersHorizontal, X,
  Loader2,
} from 'lucide-react';
import { useCartStore }   from '@/store/cartStore';   // ← ZUSTAND, bukan useCart
import { useAuth }        from '@/hooks/useAuth';
import { ProductService } from '@/lib/supabase';
import { formatIDR, BADGE_CONFIG } from '@/lib/utils';
import type { Product } from '@/types';

// ── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = ['Semua', 'Premium', 'Classic'] as const;
type Category = typeof CATEGORIES[number];

// ── Product Card ─────────────────────────────────────────────────────────────
interface ProductCardProps {
  product:    Product;
  isLoggedIn: boolean;
}

function ProductCard({ product, isLoggedIn }: ProductCardProps) {
  const router  = useRouter();
  const addItem = useCartStore(s => s.addItem);  // ← ZUSTAND

  const [qty, setQty]     = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = useCallback(() => {
    if (!isLoggedIn) {
      router.push('/login?redirect=/menu');
      return;
    }
    addItem({
      id:       product.id,
      name:     product.name,
      price:    product.price,
      quantity: qty,
      image:    product.image_url,
    });
    setAdded(true);
    setQty(1);
    setTimeout(() => setAdded(false), 1400);
  }, [isLoggedIn, product, qty, addItem, router]);

  const badge     = product.badge ? BADGE_CONFIG[product.badge] : null;
  const isSoldOut = product.badge === 'sold_out' || product.stock === 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`
        group bg-white border border-stone-200 rounded-2xl overflow-hidden
        shadow-sm hover:shadow-md hover:border-stone-300
        transition-shadow duration-200
        ${isSoldOut ? 'opacity-60' : ''}
      `}
    >
      {/* Image container */}
      <div className="relative aspect-square bg-stone-50 overflow-hidden">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-transform duration-500 ${!isSoldOut ? 'group-hover:scale-105' : ''}`}
        />

        {/* Badge */}
        {badge && (
          <div className={`absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black ${badge.bg} ${badge.text}`}>
            {product.badge === 'best_seller' && <Flame size={9} />}
            {product.badge === 'new' && <Sparkles size={9} />}
            {badge.label}
          </div>
        )}

        {/* Auth gate overlay */}
        {!isLoggedIn && !isSoldOut && (
          <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/30 transition-all duration-200 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100">
            <div className="flex items-center gap-1.5 bg-stone-950/90 backdrop-blur-sm rounded-xl px-3 py-2">
              <Lock size={11} className="text-amber-400" />
              <span className="text-[11px] text-stone-200 font-semibold">Login untuk pesan</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5">
        <h3 className="font-playfair font-black italic text-stone-900 text-sm leading-tight mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-[11px] text-stone-500 leading-relaxed line-clamp-2 mb-3">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <p className="text-base font-black text-stone-900" suppressHydrationWarning>
            {formatIDR(product.price)}
          </p>
          <span className="text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full font-medium capitalize">
            {product.category}
          </span>
        </div>

        {/* Add to cart */}
        {isSoldOut ? (
          <div className="w-full h-9 rounded-xl bg-stone-100 flex items-center justify-center">
            <span className="text-xs font-bold text-stone-400">Habis Terjual</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {/* Qty adjuster */}
            <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="Kurangi"
                className="w-8 h-9 flex items-center justify-center text-stone-500 hover:bg-stone-100 disabled:opacity-30 transition-colors"
              >
                <Minus size={12} />
              </button>
              <span className="w-6 text-center text-xs font-bold text-stone-800" suppressHydrationWarning>
                {qty}
              </span>
              <button
                onClick={() => setQty(q => Math.min(20, q + 1))}
                aria-label="Tambah"
                className="w-8 h-9 flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-colors"
              >
                <Plus size={12} />
              </button>
            </div>

            {/* Add button */}
            <button
              onClick={handleAdd}
              className={`
                flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl
                text-xs font-bold transition-all duration-200 active:scale-95
                ${added
                  ? 'bg-emerald-500 text-white'
                  : isLoggedIn
                    ? 'bg-stone-900 hover:bg-stone-700 text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950'}
              `}
            >
              <AnimatePresence mode="wait">
                {added ? (
                  <motion.span key="done"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-1"
                  >
                    <CheckCircle2 size={12} /> Added!
                  </motion.span>
                ) : (
                  <motion.span key="add" className="flex items-center gap-1">
                    {isLoggedIn ? <ShoppingBag size={12} /> : <Lock size={11} />}
                    {isLoggedIn ? 'Add' : 'Login'}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="rounded-2xl border border-stone-200 overflow-hidden">
      <div className="aspect-square shimmer" />
      <div className="p-3.5 space-y-2.5">
        <div className="h-3.5 w-3/4 shimmer rounded-lg" />
        <div className="h-3 w-full shimmer rounded-lg" />
        <div className="h-3 w-1/2 shimmer rounded-lg" />
        <div className="h-9 shimmer rounded-xl mt-3" />
      </div>
    </div>
  );
}

// ── Auth gate banner ──────────────────────────────────────────────────────────
function AuthBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3.5 mb-5"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <Lock size={15} className="text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-stone-900">Login untuk memesan</p>
          <p className="text-xs text-stone-500 mt-0.5">Browse bebas, order butuh akun</p>
        </div>
      </div>
      <div className="flex items-center gap-2 pl-11 sm:pl-0">
        <Link href="/login?redirect=/menu"
          className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          Masuk
        </Link>
        <Link href="/register"
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-colors"
        >
          Daftar Gratis
        </Link>
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MenuPage() {
  const { isLoggedIn } = useAuth();
  const cartCount      = useCartStore(s => s.cart.reduce((sum, i) => sum + i.quantity, 0)); // ← ZUSTAND

  const [products, setProducts]   = useState<Product[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [category, setCategory]   = useState<Category>('Semua');
  const [showSearch, setShowSrch] = useState(false);
  const [mounted, setMounted]     = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    ProductService.getAll().then(({ data }) => {
      setProducts(data ?? []);
      setLoading(false);
    });
  }, []);

  // Filter products
  const filtered = products.filter(p => {
    const matchCat = category === 'Semua' || p.category.toLowerCase() === category.toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#FDFCFA]">

      {/* ── STICKY HEADER ── */}
      <div className="sticky top-16 z-30 bg-[#FDFCFA]/95 backdrop-blur-sm border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">

          {/* Top row */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <h1 className="font-playfair text-xl font-black italic text-stone-900 leading-tight">
                Menu Donat
              </h1>
              <p className="text-xs text-stone-500">
                {loading ? '...' : `${filtered.length} dari ${products.length} varian`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Search toggle */}
              <button
                onClick={() => setShowSrch(s => !s)}
                className={`p-2.5 rounded-xl border transition-all ${
                  showSearch
                    ? 'bg-stone-900 border-stone-900 text-white'
                    : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'
                }`}
                aria-label="Cari produk"
              >
                {showSearch ? <X size={16} /> : <Search size={16} />}
              </button>

              {/* Cart shortcut */}
              <Link href="/cart" className="relative p-2.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 text-stone-500 hover:text-stone-800 transition-all">
                <ShoppingBag size={16} />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-stone-950 text-[9px] font-black flex items-center justify-center" suppressHydrationWarning>
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Search bar — animated */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mb-3"
              >
                <div className="relative">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Cari donat..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full h-10 bg-white border border-stone-300 rounded-xl pl-9 pr-4 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 transition-all"
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`
                  px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0
                  transition-all duration-150
                  ${category === cat
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-white border border-stone-200 text-stone-500 hover:border-stone-300 hover:text-stone-700'}
                `}
              >
                {cat}
                {cat !== 'Semua' && (
                  <span className={`ml-1.5 text-[10px] ${category === cat ? 'text-stone-400' : 'text-stone-400'}`}>
                    {products.filter(p => p.category.toLowerCase() === cat.toLowerCase()).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">

        {/* Auth banner */}
        {mounted && !isLoggedIn && <AuthBanner />}

        {/* Product grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-4xl mb-4">🍩</p>
            <p className="font-playfair text-lg font-black italic text-stone-400">
              Tidak ada produk ditemukan
            </p>
            <p className="text-sm text-stone-500 mt-2">
              Coba kata kunci lain atau pilih kategori berbeda
            </p>
            <button
              onClick={() => { setSearch(''); setCategory('Semua'); setShowSrch(false); }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-stone-900 text-stone-100 text-sm font-semibold hover:bg-stone-800 transition-colors"
            >
              Reset Filter
            </button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
          >
            <AnimatePresence>
              {filtered.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isLoggedIn={isLoggedIn}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Bottom spacer for mobile */}
        <div className="h-6" />
      </div>

      {/* ── FLOATING CART BAR — mobile only, shows when cart has items ── */}
      {mounted && cartCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-4 inset-x-4 z-40 md:hidden"
        >
          <Link href="/cart"
            className="flex items-center justify-between px-5 py-4 bg-stone-950 rounded-2xl shadow-2xl shadow-black/40 border border-stone-800 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center">
                <ShoppingBag size={15} className="text-stone-950" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-100">Lihat Keranjang</p>
                <p className="text-[10px] text-stone-500" suppressHydrationWarning>{cartCount} item</p>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
              <span className="text-xs font-black text-stone-950" suppressHydrationWarning>{cartCount}</span>
            </div>
          </Link>
        </motion.div>
      )}
    </div>
  );
}