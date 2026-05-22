// src/app/(storefront)/dashboard/page.tsx — NOSTIMO Customer Dashboard
// Mobile-first premium design. Auth-gated. Shows orders + quick reorder.

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, ChevronRight, Package,
  TrendingUp, LogOut, Loader2,
  Star, LayoutDashboard, Plus,
  CheckCircle2, Clock,
} from 'lucide-react';
import { useAuth }       from '@/hooks/useAuth';
import { useCartStore }  from '@/store/cartStore';
import { OrderService, ProductService }  from '@/lib/supabase';
import { formatIDR, formatDate, STATUS_CONFIG } from '@/lib/utils';
import type { OrderWithItems, Product } from '@/types';

// ── Quick-add button ─────────────────────────────────────────────────────────
function QuickAddBtn({ product }: { product: Product }) {
  const addItem = useCartStore(s => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image_url });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleAdd}
      className={`
        flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold
        transition-all duration-200 shrink-0
        ${added
          ? 'bg-emerald-500 text-white scale-95'
          : 'bg-stone-100 hover:bg-amber-500 hover:text-stone-950 text-stone-600 active:scale-95'}
      `}
    >
      <AnimatePresence mode="wait">
        {added ? (
          <motion.span key="done" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1">
            <CheckCircle2 size={12} /> Done
          </motion.span>
        ) : (
          <motion.span key="add" className="flex items-center gap-1">
            <Plus size={12} /> Add
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

// ── Order card ───────────────────────────────────────────────────────────────
function OrderCard({ order }: { order: OrderWithItems }) {
  const sc = STATUS_CONFIG[order.status];
  const isActive = ['pending','confirmed','processing','ready'].includes(order.status);

  return (
    <Link href={`/order/${order.id}`}
      className="block bg-white border border-stone-200 rounded-2xl p-4 hover:shadow-md hover:border-stone-300 transition-all duration-200 group active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-mono text-xs font-bold text-amber-600">
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
            {isActive && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500">{formatDate(order.created_at)}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${sc.bg} ${sc.color}`}>
            {sc.label}
          </span>
          <ChevronRight size={14} className="text-stone-400 group-hover:text-stone-600 transition-colors" />
        </div>
      </div>

      {/* Item images */}
      <div className="flex items-center gap-2.5">
        <div className="flex -space-x-2.5">
          {order.order_items.slice(0, 4).map((item, i) => (
            <div key={i} className="relative w-9 h-9 rounded-xl overflow-hidden border-2 border-white bg-stone-100 shrink-0 shadow-sm">
              <Image src={item.product_image} alt={item.product_name} fill sizes="36px" className="object-cover" />
            </div>
          ))}
          {order.order_items.length > 4 && (
            <div className="w-9 h-9 rounded-xl bg-stone-100 border-2 border-white flex items-center justify-center shadow-sm">
              <span className="text-[9px] font-bold text-stone-500">+{order.order_items.length - 4}</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-stone-500 truncate">
            {order.order_items.map(i => i.product_name).join(', ')}
          </p>
        </div>
        <p className="text-sm font-black text-stone-900 shrink-0" suppressHydrationWarning>
          {formatIDR(order.grand_total)}
        </p>
      </div>
    </Link>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`shimmer rounded-xl ${className}`} />;
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function CustomerDashboard() {
  const router = useRouter();
  const { profile, loading, isLoggedIn, isAdmin, signOut } = useAuth();
  const cartItems = useCartStore(s => s.cart);
  const totalCartItems = cartItems.reduce((s, i) => s + i.quantity, 0);

  const [orders, setOrders]         = useState<OrderWithItems[]>([]);
  const [featured, setFeatured]     = useState<Product[]>([]);
  const [ordersLoading, setOLoad]   = useState(true);
  const [mounted, setMounted]       = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push('/login?redirect=/dashboard');
    }
  }, [loading, isLoggedIn, router]);

  const loadData = useCallback(async () => {
    if (!profile?.id) return;
    const [ordersRes, productsRes] = await Promise.all([
      OrderService.getByUser(profile.id),
      ProductService.getAll(),
    ]);
    setOrders(ordersRes.data ?? []);
    setFeatured((productsRes.data ?? []).slice(0, 4));
    setOLoad(false);
  }, [profile?.id]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  // ── Guards ──
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFA] flex items-center justify-center">
        <Loader2 size={28} className="text-amber-500 animate-spin" />
      </div>
    );
  }
  if (!isLoggedIn || !profile) return null;

  // ── Stats ──
  const totalSpend = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.grand_total, 0);
  const activeOrders = orders.filter(o => ['pending','confirmed','processing','ready'].includes(o.status)).length;
  const completedOrders = orders.filter(o => o.status === 'delivered').length;

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <div className="max-w-lg mx-auto px-4 py-6 pb-24">

        {/* ── TOP BAR ── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-7"
        >
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
              <span className="text-xl font-black text-white">
                {profile.full_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-xs text-stone-500 font-medium">Hi,</p>
              <h1 className="font-playfair text-xl font-black italic text-stone-900 leading-tight">
                {profile.full_name.split(' ')[0]}
              </h1>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Cart quick access */}
            <Link href="/cart"
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 text-stone-200 text-xs font-bold hover:bg-stone-800 transition-colors"
            >
              <ShoppingBag size={14} />
              Keranjang
              {mounted && totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-stone-950 text-[9px] font-black flex items-center justify-center" suppressHydrationWarning>
                  {totalCartItems}
                </span>
              )}
            </Link>

            <button onClick={handleSignOut}
              className="p-2 rounded-xl text-stone-400 hover:text-rose-400 hover:bg-rose-50 transition-colors"
              aria-label="Keluar"
            >
              <LogOut size={16} />
            </button>
          </div>
        </motion.div>

        {/* ── ADMIN BANNER ── */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-5"
          >
            <Link href="/admin/dashboard"
              className="flex items-center justify-between px-4 py-3.5 rounded-2xl bg-stone-900 border border-stone-700 group active:scale-[0.99] transition-transform"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
                  <LayoutDashboard size={16} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-100">Admin Panel</p>
                  <p className="text-xs text-stone-500">Kelola toko Nostimo</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-stone-600 group-hover:text-stone-400 transition-colors" />
            </Link>
          </motion.div>
        )}

        {/* ── STATS STRIP ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          {[
            { label: 'Total Order', value: orders.length, icon: ShoppingBag, color: 'text-stone-600' },
            { label: 'Aktif',       value: activeOrders,   icon: Clock,        color: 'text-amber-600' },
            { label: 'Selesai',     value: completedOrders, icon: CheckCircle2, color: 'text-emerald-600' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white border border-stone-200 rounded-2xl p-3.5 text-center">
              <Icon size={18} className={`mx-auto mb-1.5 ${color}`} />
              <p className="text-xl font-black text-stone-900">{value}</p>
              <p className="text-[10px] text-stone-500 font-medium mt-0.5">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* ── TOTAL SPEND CARD ── */}
        {totalSpend > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mb-6 bg-stone-900 rounded-2xl px-5 py-4 flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-stone-500 font-medium">Total Belanja</p>
              <p className="font-playfair text-2xl font-black italic text-stone-50 mt-0.5" suppressHydrationWarning>
                {formatIDR(totalSpend)}
              </p>
            </div>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={16} className="text-amber-400" fill={i <= Math.min(5, Math.ceil(completedOrders / 2)) ? '#f59e0b' : 'none'} />
              ))}
            </div>
          </motion.div>
        )}

        {/* ── QUICK ORDER — FEATURED PRODUCTS ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-stone-800">Pesan Cepat</h2>
            <Link href="/menu" className="text-xs text-amber-600 hover:text-amber-500 font-semibold transition-colors">
              Lihat semua →
            </Link>
          </div>

          <div className="flex flex-col gap-2.5">
            {ordersLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))
            ) : (
              featured.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="flex items-center gap-3 bg-white border border-stone-200 rounded-2xl px-3.5 py-3 hover:border-stone-300 transition-colors"
                >
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                    <Image src={product.image_url} alt={product.name} fill sizes="44px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-playfair text-sm font-black italic text-stone-900 truncate">{product.name}</p>
                    <p className="text-xs text-amber-600 font-bold" suppressHydrationWarning>{formatIDR(product.price)}</p>
                  </div>
                  <QuickAddBtn product={product} />
                </motion.div>
              ))
            )}
          </div>

          {/* View cart CTA if cart has items */}
          {mounted && totalCartItems > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3"
            >
              <Link href="/cart"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm transition-colors active:scale-[0.99]"
              >
                <ShoppingBag size={16} />
                Lihat Keranjang ({totalCartItems} item)
                <ChevronRight size={14} />
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* ── ORDER HISTORY ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-stone-800">Riwayat Pesanan</h2>
            <p className="text-xs text-stone-500">{orders.length} total</p>
          </div>

          {ordersLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-14 bg-white border border-dashed border-stone-300 rounded-2xl">
              <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={24} className="text-stone-400" />
              </div>
              <p className="text-sm font-bold text-stone-600 mb-1">Belum ada pesanan</p>
              <p className="text-xs text-stone-400 mb-5">Yuk mulai pesan donat favoritmu!</p>
              <Link href="/menu"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm font-bold transition-colors"
              >
                Lihat Menu
                <ChevronRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 10).map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.04 }}
                >
                  <OrderCard order={order} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── BOTTOM NAV SPACING ── */}
        <div className="h-8" />

      </div>

      {/* ── FLOATING BOTTOM NAV ── */}
      <div className="fixed bottom-0 inset-x-0 z-40 px-4 pb-4 md:hidden">
        <div className="bg-stone-950/95 backdrop-blur-md border border-stone-800 rounded-2xl px-2 py-2 flex items-center justify-around shadow-2xl shadow-black/40">
          {[
            { icon: TrendingUp, label: 'Dashboard', href: '/dashboard', active: true  },
            { icon: ShoppingBag, label: 'Menu',     href: '/menu',      active: false },
            { icon: Package,     label: 'Pesanan',  href: '/orders',    active: false },
          ].map(({ icon: Icon, label, href, active }) => (
            <Link key={label} href={href}
              className={`flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-all ${
                active
                  ? 'bg-amber-500/15 text-amber-400'
                  : 'text-stone-600 hover:text-stone-400'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-semibold">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}