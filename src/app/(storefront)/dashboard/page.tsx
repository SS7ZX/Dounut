// src/app/(storefront)/dashboard/page.tsx — NOSTIMO Customer Dashboard
// URL: localhost:3000/dashboard
// This replaces the plain "Dashboard Pelanggan" page with a premium version

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ShoppingBag, Clock, CheckCircle2, XCircle,
  User, Phone, MapPin, ChevronRight,
  Package, TrendingUp, Star, LogOut, Loader2,
} from 'lucide-react';
import { useAuth }        from '@/hooks/useAuth';
import { OrderService }   from '@/lib/supabase';
import { formatIDR, formatDate, STATUS_CONFIG } from '@/lib/utils';
import type { OrderWithItems } from '@/types';

// ── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  label, value, icon: Icon, accent,
}: {
  label: string; value: string | number;
  icon: React.ElementType; accent: string;
}) {
  return (
    <div className={`rounded-2xl border p-4 flex items-center gap-4 bg-white ${accent}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent.replace('border-', 'bg-').replace('/30', '/10')}`}>
        <Icon size={18} className="text-stone-700" />
      </div>
      <div>
        <p className="text-xs text-stone-500 font-medium">{label}</p>
        <p className="text-xl font-black text-stone-900" suppressHydrationWarning>{value}</p>
      </div>
    </div>
  );
}

// ── Order card ───────────────────────────────────────────────────────────────
function OrderCard({ order }: { order: OrderWithItems }) {
  const sc = STATUS_CONFIG[order.status];
  return (
    <Link href={`/order/${order.id}`}
      className="block bg-white border border-stone-200 rounded-2xl p-4 hover:shadow-md hover:border-stone-300 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-mono text-xs font-bold text-amber-600">
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sc.bg} ${sc.color}`}>
              {sc.label}
            </span>
          </div>
          <p className="text-xs text-stone-500">{formatDate(order.created_at)}</p>
        </div>
        <ChevronRight size={16} className="text-stone-400 mt-0.5 group-hover:text-stone-600 transition-colors shrink-0" />
      </div>

      {/* Items preview */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex -space-x-2">
          {order.order_items.slice(0, 3).map((item, i) => (
            <div key={i} className="relative w-8 h-8 rounded-lg overflow-hidden border-2 border-white bg-stone-100 shrink-0">
              <Image src={item.product_image} alt={item.product_name} fill sizes="32px" className="object-cover" />
            </div>
          ))}
          {order.order_items.length > 3 && (
            <div className="w-8 h-8 rounded-lg bg-stone-100 border-2 border-white flex items-center justify-center">
              <span className="text-[9px] font-bold text-stone-500">+{order.order_items.length - 3}</span>
            </div>
          )}
        </div>
        <p className="text-xs text-stone-500">{order.order_items.length} item</p>
        <p className="text-sm font-black text-stone-900 ml-auto" suppressHydrationWarning>
          {formatIDR(order.grand_total)}
        </p>
      </div>
    </Link>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function CustomerDashboard() {
  const router = useRouter();
  const { profile, loading, isLoggedIn, signOut } = useAuth();
  const [orders, setOrders]       = useState<OrderWithItems[]>([]);
  const [ordersLoading, setOLoad] = useState(true);
  const [mounted, setMounted]     = useState(false);

  useEffect(() => setMounted(true), []);

  // Redirect jika tidak login
  useEffect(() => {
    if (!loading && !isLoggedIn) router.push('/login?redirect=/dashboard');
  }, [loading, isLoggedIn, router]);

  // Load orders
  useEffect(() => {
    if (profile?.id) {
      OrderService.getByUser(profile.id).then(({ data }) => {
        setOrders(data ?? []);
        setOLoad(false);
      });
    }
  }, [profile?.id]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  // ── Loading state ──
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFA] flex items-center justify-center">
        <Loader2 size={28} className="text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn || !profile) return null;

  // ── Computed stats ──
  const totalSpend = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((s, o) => s + o.grand_total, 0);
  const pending   = orders.filter(o => ['pending','confirmed','processing','ready'].includes(o.status)).length;
  const completed = orders.filter(o => o.status === 'delivered').length;
  const recent    = orders.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-200 flex items-center justify-center shrink-0 overflow-hidden">
                {profile.avatar_url ? (
                  <Image src={profile.avatar_url} alt={profile.full_name} width={56} height={56} className="object-cover" />
                ) : (
                  <span className="text-xl font-black text-amber-700">
                    {profile.full_name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <div>
                <p className="text-xs text-stone-500 font-medium mb-0.5">Selamat datang,</p>
                <h1 className="font-playfair text-2xl font-black italic text-stone-900 leading-tight">
                  {profile.full_name}
                </h1>
                <p className="text-xs text-amber-600 font-semibold mt-0.5 capitalize">
                  {profile.role === 'admin' ? '⭐ Administrator' : '🍩 Member Nostimo'}
                </p>
              </div>
            </div>

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-500 hover:text-rose-500 hover:bg-rose-50 border border-stone-200 hover:border-rose-200 transition-all duration-150 shrink-0"
            >
              <LogOut size={13} />
              Keluar
            </button>
          </div>
        </motion.div>

        {/* ── Admin shortcut ── */}
        {profile.role === 'admin' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-5"
          >
            <Link href="/admin/dashboard"
              className="flex items-center justify-between px-5 py-4 rounded-2xl bg-stone-900 text-stone-100 hover:bg-stone-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <TrendingUp size={15} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">Admin Panel</p>
                  <p className="text-xs text-stone-500">Kelola toko Nostimo</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-stone-500" />
            </Link>
          </motion.div>
        )}

        {/* ── Stats grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          <div className="bg-white border border-stone-200 rounded-2xl p-4 text-center">
            <ShoppingBag size={18} className="text-amber-500 mx-auto mb-2" />
            <p className="text-xl font-black text-stone-900">{orders.length}</p>
            <p className="text-[11px] text-stone-500 font-medium">Total Order</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-2xl p-4 text-center">
            <Clock size={18} className="text-blue-500 mx-auto mb-2" />
            <p className="text-xl font-black text-stone-900">{pending}</p>
            <p className="text-[11px] text-stone-500 font-medium">Aktif</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-2xl p-4 text-center">
            <CheckCircle2 size={18} className="text-emerald-500 mx-auto mb-2" />
            <p className="text-xl font-black text-stone-900">{completed}</p>
            <p className="text-[11px] text-stone-500 font-medium">Selesai</p>
          </div>
        </motion.div>

        {/* ── Total spend ── */}
        {totalSpend > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8 bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-amber-700 font-semibold">Total Belanja</p>
              <p className="font-playfair text-2xl font-black italic text-stone-900 mt-0.5" suppressHydrationWarning>
                {formatIDR(totalSpend)}
              </p>
            </div>
            <div className="flex -space-x-1">
              {[1,2,3].map(i => (
                <Star key={i} size={18} className="text-amber-400" fill="#f59e0b" />
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Profile info card ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 bg-white border border-stone-200 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-stone-800">Info Akun</h2>
            <Link href="/profile"
              className="text-xs text-amber-600 hover:text-amber-500 font-semibold transition-colors"
            >
              Edit →
            </Link>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User size={14} className="text-stone-400 shrink-0" />
              <p className="text-sm text-stone-700">{profile.full_name}</p>
            </div>
            {profile.whatsapp && (
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-stone-400 shrink-0" />
                <p className="text-sm text-stone-700">{profile.whatsapp}</p>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Package size={14} className="text-stone-400 shrink-0" />
              <p className="text-sm text-stone-500 italic">
                {orders.length > 0
                  ? `${orders.length} pesanan tercatat`
                  : 'Belum ada pesanan'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Recent orders ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-stone-800">Riwayat Pesanan</h2>
            {orders.length > 5 && (
              <Link href="/orders" className="text-xs text-amber-600 hover:text-amber-500 font-semibold transition-colors">
                Lihat semua →
              </Link>
            )}
          </div>

          {ordersLoading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="h-20 rounded-2xl shimmer" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="text-center py-12 bg-white border border-dashed border-stone-300 rounded-2xl">
              <ShoppingBag size={36} className="text-stone-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-stone-500">Belum ada pesanan</p>
              <p className="text-xs text-stone-400 mt-1">Yuk, mulai pesan donat favoritmu!</p>
              <Link href="/menu"
                className="inline-flex items-center gap-1.5 mt-4 px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 text-sm font-bold hover:bg-amber-400 transition-colors"
              >
                Lihat Menu
                <ChevronRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </motion.div>

        {/* ── Quick actions ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-2 gap-3"
        >
          <Link href="/menu"
            className="flex items-center gap-3 p-4 bg-white border border-stone-200 rounded-2xl hover:border-amber-300 hover:bg-amber-50 transition-all group"
          >
            <ShoppingBag size={18} className="text-amber-500 shrink-0" />
            <div>
              <p className="text-sm font-bold text-stone-800">Pesan Lagi</p>
              <p className="text-xs text-stone-500">Lihat menu</p>
            </div>
          </Link>
          <Link href="/cart"
            className="flex items-center gap-3 p-4 bg-white border border-stone-200 rounded-2xl hover:border-stone-300 hover:bg-stone-50 transition-all group"
          >
            <Package size={18} className="text-stone-500 shrink-0" />
            <div>
              <p className="text-sm font-bold text-stone-800">Keranjang</p>
              <p className="text-xs text-stone-500">Cek pesanan</p>
            </div>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}