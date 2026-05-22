// src/app/admin/dashboard/page.tsx — NOSTIMO Admin Dashboard

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  TrendingUp, ShoppingBag, Package, Clock,
  ArrowUpRight, CheckCircle2, XCircle,
  RefreshCw, ChevronRight, Loader2,
} from 'lucide-react';
import { OrderService, ProductService } from '@/lib/supabase';
import { formatIDR, formatDate, STATUS_CONFIG, STATUS_FLOW } from '@/lib/utils';
import type { OrderWithItems, Product, OrderStatus } from '@/types';

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, trend, color }: {
  label: string; value: string; sub: string;
  icon: React.ElementType; trend?: string; color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-stone-900 border border-stone-800 rounded-2xl p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-stone-500 font-medium leading-tight">{label}</p>
        <div className={`p-2 rounded-xl ${color}`}>
          <Icon size={14} />
        </div>
      </div>
      <p className="text-2xl font-black text-stone-50 leading-none mb-1" suppressHydrationWarning>
        {value}
      </p>
      <p className="text-xs text-stone-600">{sub}</p>
    </motion.div>
  );
}

// ── Order Row ─────────────────────────────────────────────────────────────────
function OrderRow({ order, onAdvance, updating }: {
  order: OrderWithItems;
  onAdvance: (id: string, next: string) => void;
  updating: string | null;
}) {
  const sc   = STATUS_CONFIG[order.status];
  const next = STATUS_FLOW[order.status];
  const busy = updating === order.id;

  return (
    <div className="flex items-center gap-3 py-3 border-b border-stone-800/50 last:border-0">
      {/* Item preview images */}
      <div className="flex -space-x-2 shrink-0">
        {order.order_items.slice(0, 2).map((item, i) => (
          <div key={i} className="w-8 h-8 rounded-lg border-2 border-stone-900 overflow-hidden bg-stone-800">
            <Image src={item.product_image} alt={item.product_name} width={32} height={32} className="object-cover w-full h-full" />
          </div>
        ))}
        {order.order_items.length > 2 && (
          <div className="w-8 h-8 rounded-lg border-2 border-stone-900 bg-stone-800 flex items-center justify-center">
            <span className="text-[9px] font-bold text-stone-500">+{order.order_items.length - 2}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-xs font-mono font-bold text-amber-400">
            #{order.id.slice(0, 7).toUpperCase()}
          </p>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sc.bg} ${sc.color}`}>
            {sc.label}
          </span>
        </div>
        <p className="text-xs text-stone-400 truncate mt-0.5">{order.customer_name}</p>
      </div>

      {/* Total */}
      <p className="text-xs font-bold text-stone-200 shrink-0 hidden sm:block" suppressHydrationWarning>
        {formatIDR(order.grand_total)}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {next && (
          <button
            onClick={() => onAdvance(order.id, next)}
            disabled={busy}
            className="px-2.5 py-1.5 rounded-lg bg-amber-500/12 text-amber-400 text-[10px] font-bold hover:bg-amber-500/20 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {busy ? '...' : `→ ${STATUS_CONFIG[next as OrderStatus]?.label}`}
          </button>
        )}
        <Link href={`/admin/orders/${order.id}`}
          className="p-1.5 rounded-lg text-stone-600 hover:text-stone-300 hover:bg-stone-800 transition-colors"
        >
          <ChevronRight size={13} />
        </Link>
      </div>
    </div>
  );
}

// ── Dashboard Page ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [orders, setOrders]     = useState<OrderWithItems[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRef]    = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadData = async (refresh = false) => {
    if (refresh) setRef(true);
    const [{ data: o }, { data: p }] = await Promise.all([
      OrderService.getAll(),
      ProductService.getAllAdmin(),
    ]);
    setOrders(o ?? []);
    setProducts(p ?? []);
    setLoading(false);
    setRef(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleAdvance = async (id: string, next: string) => {
    setUpdating(id);
    await OrderService.updateStatus(id, next);
    await loadData();
    setUpdating(null);
  };

  // ── Computed stats ──
  const today        = new Date().toDateString();
  const todayOrders  = orders.filter(o => new Date(o.created_at).toDateString() === today);
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.grand_total, 0);
  const pending      = orders.filter(o => o.status === 'pending').length;
  const activeProds  = products.filter(p => p.is_available).length;

  const recentOrders = orders.slice(0, 6);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-stone-100">Dashboard</h1>
          <p className="text-xs text-stone-500 mt-0.5">Ringkasan toko Nostimo hari ini</p>
        </div>
        <button onClick={() => loadData(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 text-xs font-medium transition-all"
        >
          <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Stats grid — 2x2 mobile, 4 columns desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Total Revenue"
          value={formatIDR(totalRevenue)}
          sub={`${orders.length} order total`}
          icon={TrendingUp}
          color="bg-amber-500/12 text-amber-400"
        />
        <StatCard
          label="Order Hari Ini"
          value={String(todayOrders.length)}
          sub={`${todayOrders.filter(o => o.status !== 'cancelled').length} berhasil`}
          icon={ShoppingBag}
          color="bg-blue-500/12 text-blue-400"
        />
        <StatCard
          label="Menunggu"
          value={String(pending)}
          sub="Perlu tindakan"
          icon={Clock}
          color="bg-rose-500/12 text-rose-400"
        />
        <StatCard
          label="Produk Aktif"
          value={String(activeProds)}
          sub={`dari ${products.length} total`}
          icon={Package}
          color="bg-emerald-500/12 text-emerald-400"
        />
      </div>

      {/* Main content — orders + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">

        {/* Recent orders */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-800">
            <h2 className="text-sm font-bold text-stone-200">Pesanan Terbaru</h2>
            <Link href="/admin/orders"
              className="flex items-center gap-1 text-xs text-amber-500 hover:text-amber-400 font-medium transition-colors"
            >
              Semua <ArrowUpRight size={11} />
            </Link>
          </div>

          <div className="px-4">
            {recentOrders.length === 0 ? (
              <div className="py-10 text-center text-stone-600 text-sm">Belum ada pesanan</div>
            ) : (
              recentOrders.map(order => (
                <OrderRow key={order.id} order={order} onAdvance={handleAdvance} updating={updating} />
              ))
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">

          {/* Quick actions */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4">
            <h2 className="text-sm font-bold text-stone-200 mb-3">Aksi Cepat</h2>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Tambah Produk', href: '/admin/products/new', icon: Package, color: 'text-amber-400' },
                { label: 'Kelola Pesanan', href: '/admin/orders', icon: ShoppingBag, color: 'text-blue-400' },
                { label: 'Live Queue', href: '/admin/live-queue', icon: CheckCircle2, color: 'text-emerald-400' },
              ].map(({ label, href, icon: Icon, color }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl bg-stone-800/50 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-stone-100 transition-all group"
                >
                  <Icon size={15} className={color} />
                  <span className="text-sm font-medium">{label}</span>
                  <ArrowUpRight size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-stone-500" />
                </Link>
              ))}
            </div>
          </div>

          {/* Products summary */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-stone-200">Produk</h2>
              <Link href="/admin/products" className="text-xs text-amber-500 hover:text-amber-400 font-medium">
                Kelola →
              </Link>
            </div>
            <div className="space-y-2.5">
              {products.slice(0, 4).map(p => (
                <div key={p.id} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-stone-800 shrink-0">
                    <Image src={p.image_url} alt={p.name} width={32} height={32} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-stone-300 truncate">{p.name}</p>
                    <p className="text-[10px] text-stone-600" suppressHydrationWarning>{formatIDR(p.price)}</p>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${p.is_available ? 'bg-emerald-500' : 'bg-stone-600'}`} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}