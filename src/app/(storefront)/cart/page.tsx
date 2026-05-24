// src/app/(storefront)/cart/page.tsx
// FIXED: redirect ke /login?redirect=/checkout (bukan callbackUrl)
// Mobile-first premium cart UI

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Trash2, Plus, Minus,
  ArrowLeft, ChevronRight, Tag, Loader2,
  Lock,
} from 'lucide-react';
import { useCartStore }  from '@/store/cartStore';
import { useAuth }       from '@/hooks/useAuth';
import { formatIDR }     from '@/lib/utils';

// ── Cart item row ─────────────────────────────────────────────────────────────
function CartItem({ item }: { item: { id: number; name: string; price: number; quantity: number; image: string } }) {
  const updateQuantity = useCartStore(s => s.updateQuantity);
  const removeItem     = useCartStore(s => s.removeItem);
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    setTimeout(() => removeItem(item.id), 200);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: removing ? 0 : 1, x: removing ? -20 : 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3.5 py-4 border-b border-stone-100 last:border-0"
    >
      {/* Image */}
      <Link href="/menu" className="shrink-0">
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-stone-100">
          <Image
            src={item.image}
            alt={item.name}
            fill sizes="64px"
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Info + controls */}
      <div className="flex-1 min-w-0">
        <p className="font-playfair text-sm font-black italic text-stone-900 truncate">
          {item.name}
        </p>
        <p className="text-xs text-amber-600 font-bold mt-0.5" suppressHydrationWarning>
          {formatIDR(item.price)}
        </p>

        <div className="flex items-center justify-between mt-2.5">
          {/* Qty adjuster */}
          <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              aria-label="Kurangi"
              className="w-8 h-8 flex items-center justify-center text-stone-500 hover:bg-stone-100 active:bg-stone-200 transition-colors"
            >
              <Minus size={12} />
            </button>
            <span className="w-7 text-center text-xs font-black text-stone-800" suppressHydrationWarning>
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              aria-label="Tambah"
              className="w-8 h-8 flex items-center justify-center text-stone-500 hover:bg-stone-100 active:bg-stone-200 transition-colors"
            >
              <Plus size={12} />
            </button>
          </div>

          {/* Line total + delete */}
          <div className="flex items-center gap-3">
            <p className="text-sm font-black text-stone-900" suppressHydrationWarning>
              {formatIDR(item.price * item.quantity)}
            </p>
            <button
              onClick={handleRemove}
              aria-label={`Hapus ${item.name}`}
              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="w-20 h-20 rounded-3xl bg-stone-100 flex items-center justify-center mb-5"
      >
        <ShoppingBag size={32} className="text-stone-400" />
      </motion.div>
      <h2 className="font-playfair text-xl font-black italic text-stone-700 mb-2">
        Keranjang Kosong
      </h2>
      <p className="text-sm text-stone-400 mb-7 max-w-xs">
        Belum ada donat di keranjangmu. Yuk pilih favoritmu!
      </p>
      <Link href="/menu"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-stone-900 hover:bg-stone-700 text-white font-bold text-sm transition-colors"
      >
        <ShoppingBag size={16} />
        Lihat Menu
        <ChevronRight size={14} />
      </Link>
    </div>
  );
}

// ── Main Cart Page ────────────────────────────────────────────────────────────
export default function CartPage() {
  const router    = useRouter();
  const cart      = useCartStore(s => s.cart);
  const clearCart = useCartStore(s => s.clearCart);
  const { isLoggedIn, loading: authLoading } = useAuth();

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Order summary calculations
  const subtotal    = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax         = Math.round(subtotal * 0.11);
  const grandTotal  = subtotal + tax;
  const totalItems  = cart.reduce((s, i) => s + i.quantity, 0);

  const handleCheckout = useCallback(() => {
    if (!isLoggedIn) {
      // ── CRITICAL FIX: pakai ?redirect= bukan ?callbackUrl= ──
      router.push('/login?redirect=/checkout');
      return;
    }
    router.push('/checkout');
  }, [isLoggedIn, router]);

  // Hydration guard
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FDFCFA] flex items-center justify-center">
        <Loader2 size={24} className="text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 sm:pb-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/menu"
            className="p-2.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 text-stone-500 hover:text-stone-800 transition-all"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-playfair text-2xl font-black italic text-stone-900">
              Keranjang
            </h1>
            {cart.length > 0 && (
              <p className="text-xs text-stone-500" suppressHydrationWarning>
                {totalItems} item dipilih
              </p>
            )}
          </div>
          {cart.length > 0 && (
            <button onClick={clearCart}
              className="ml-auto text-xs text-rose-400 hover:text-rose-600 font-semibold transition-colors"
            >
              Kosongkan
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 items-start">

            {/* ── LEFT: Cart items ── */}
            <div className="bg-white border border-stone-200 rounded-3xl px-5 py-2">
              <AnimatePresence>
                {cart.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </AnimatePresence>
            </div>

            {/* ── RIGHT: Order summary ── */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-white border border-stone-200 rounded-3xl p-5">
                <h2 className="text-base font-bold text-stone-800 mb-5">
                  Ringkasan Order
                </h2>

                {/* Price breakdown */}
                <div className="space-y-3 pb-4 border-b border-stone-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Subtotal ({totalItems} item)</span>
                    <span className="font-semibold text-stone-800" suppressHydrationWarning>
                      {formatIDR(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">PPN 11%</span>
                    <span className="font-semibold text-stone-800" suppressHydrationWarning>
                      {formatIDR(tax)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Ongkir</span>
                    <span className="font-bold text-emerald-600">Gratis</span>
                  </div>
                </div>

                {/* Grand total */}
                <div className="flex justify-between items-center py-4">
                  <span className="text-base font-bold text-stone-800">Total</span>
                  <span className="text-xl font-black text-stone-900" suppressHydrationWarning>
                    {formatIDR(grandTotal)}
                  </span>
                </div>

                {/* Auth state message */}
                {!authLoading && !isLoggedIn && (
                  <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-4">
                    <Lock size={14} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 leading-relaxed">
                      Kamu perlu <strong>login</strong> sebelum checkout.
                      Akun kamu dibutuhkan untuk melacak pesanan.
                    </p>
                  </div>
                )}

                {/* Checkout button */}
                <button
                  onClick={handleCheckout}
                  disabled={authLoading}
                  className="
                    w-full flex items-center justify-center gap-2
                    bg-amber-500 hover:bg-amber-400 active:bg-amber-600
                    disabled:bg-stone-200 disabled:cursor-wait
                    text-stone-950 font-black text-sm
                    py-4 rounded-2xl
                    transition-all duration-150
                    shadow-md shadow-amber-500/20
                  "
                >
                  {authLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : !isLoggedIn ? (
                    <>
                      <Lock size={15} />
                      Login & Checkout
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={15} />
                      Lanjut Checkout
                      <ChevronRight size={14} />
                    </>
                  )}
                </button>

                {/* Continue shopping */}
                <Link href="/menu"
                  className="block text-center text-xs text-stone-500 hover:text-stone-700 font-medium mt-4 transition-colors"
                >
                  ← Tambah item lagi
                </Link>

                {/* Trust signals */}
                <div className="mt-5 pt-4 border-t border-stone-100 space-y-2">
                  {[
                    '🔒 Pembayaran aman & terenkripsi',
                    '📦 Konfirmasi via WhatsApp',
                    '✨ Dibuat fresh setiap pagi',
                  ].map(t => (
                    <p key={t} className="text-[11px] text-stone-400">{t}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── MOBILE STICKY CHECKOUT BAR ── */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#FDFCFA]/95 backdrop-blur-sm border-t border-stone-200 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-xs text-stone-500">Total</p>
              <p className="text-base font-black text-stone-900" suppressHydrationWarning>
                {formatIDR(grandTotal)}
              </p>
            </div>
            <button
              onClick={handleCheckout}
              disabled={authLoading}
              className="
                flex-1 flex items-center justify-center gap-2
                bg-amber-500 hover:bg-amber-400 active:bg-amber-600
                disabled:bg-stone-200
                text-stone-950 font-black text-sm
                py-3.5 rounded-2xl
                transition-all duration-150
                shadow-md shadow-amber-500/20
              "
            >
              {authLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : !isLoggedIn ? (
                <><Lock size={14} /> Login & Checkout</>
              ) : (
                <><ShoppingBag size={14} /> Checkout ({totalItems})</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}