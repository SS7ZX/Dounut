// src/app/(admin)/admin/dashboard/page.tsx — NOSTIMO Admin Dashboard

'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingBag, Package, Clock, CheckCircle2, XCircle, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { OrderService, ProductService } from '@/lib/supabase';
import { formatIDR, formatDate, STATUS_CONFIG } from '@/lib/utils';
import type { OrderWithItems, Product } from '@/types';

export default function AdminDashboard() {
  const [orders, setOrders]   = useState<OrderWithItems[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      OrderService.getAll(),
      ProductService.getAllAdmin(),
    ]).then(([{ data: o }, { data: p }]) => {
      setOrders(o ?? []);
      setProducts(p ?? []);
      setLoading(false);
    });
  }, []);

  // Computed stats
  const todayOrders  = orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString());
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.grand_total, 0);
  const pending      = orders.filter(o => o.status === 'pending').length;
  const delivered    = orders.filter(o => o.status === 'delivered').length;

  const STATS = [
    {
      label: 'Total Revenue',
      value: formatIDR(totalRevenue),
      icon: TrendingUp,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      sub: `${orders.length} order total`,
    },
    {
      label: 'Order Hari Ini',
      value: todayOrders.length.toString(),
      icon: ShoppingBag,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
      sub: `${todayOrders.filter(o => o.status !== 'cancelled').length} berhasil`,
    },
    {
      label: 'Menunggu Proses',
      value: pending.toString(),
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      sub: 'Perlu tindakan',
    },
    {
      label: 'Produk Aktif',
      value: products.filter(p => p.is_available).length.toString(),
      icon: Package,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      sub: `dari ${products.length} total`,
    },
  ];

  const recentOrders = orders.slice(0, 8);

  return (
    <div className="p-5 sm:p-7 space-y-7">

      {/* Page title */}
      <div>
        <h1 className="text-xl font-bold text-stone-100">Dashboard</h1>
        <p className="text-sm text-stone-500 mt-0.5">Selamat datang kembali. Berikut ringkasan toko Nostimo.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, color, bg, sub }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`bg-stone-900 border rounded-2xl p-4 sm:p-5 ${bg}`}
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-stone-500 font-medium">{label}</p>
              <div className={`p-2 rounded-lg ${bg}`}>
                <Icon size={14} className={color} />
              </div>
            </div>
            <p className={`text-2xl font-black ${color}`} suppressHydrationWarning>{value}</p>
            <p className="text-xs text-stone-600 mt-1.5">{sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent orders table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between border-b border-stone-800">
          <h2 className="text-sm font-bold text-stone-200">Pesanan Terbaru</h2>
          <Link href="/admin/orders" className="text-xs text-amber-500 hover:text-amber-400 font-medium flex items-center gap-1">
            Lihat semua <ArrowUpRight size={12} />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-stone-600 text-sm">Memuat data...</div>
        ) : recentOrders.length === 0 ? (
          <div className="p-8 text-center text-stone-600 text-sm">Belum ada pesanan</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-800">
                  {['Order ID', 'Customer', 'Total', 'Items', 'Status', 'Waktu'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-stone-600 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const sc = STATUS_CONFIG[order.status];
                  return (
                    <tr key={order.id} className="border-b border-stone-800/50 hover:bg-stone-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/admin/orders/${order.id}`}
                          className="font-mono text-xs text-amber-400 hover:text-amber-300 font-bold"
                        >
                          #{order.id.slice(0, 8).toUpperCase()}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-stone-200 font-medium truncate max-w-120px">{order.customer_name}</p>
                        <p className="text-stone-600 text-xs">{order.customer_whatsapp}</p>
                      </td>
                      <td className="px-4 py-3 text-stone-200 font-semibold whitespace-nowrap" suppressHydrationWarning>
                        {formatIDR(order.grand_total)}
                      </td>
                      <td className="px-4 py-3 text-stone-400">
                        {order.order_items.length} item
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${sc.bg} ${sc.color}`}>
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-stone-600 text-xs whitespace-nowrap">
                        {formatDate(order.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Tambah Produk Baru', href: '/admin/products/new', icon: Package, color: 'border-amber-500/30 hover:border-amber-500/60' },
          { label: 'Kelola Pesanan',     href: '/admin/orders',       icon: ShoppingBag, color: 'border-stone-700 hover:border-stone-600' },
          { label: 'Live Queue',         href: '/admin/live-queue',   icon: CheckCircle2, color: 'border-emerald-500/30 hover:border-emerald-500/60' },
        ].map(({ label, href, icon: Icon, color }) => (
          <Link key={href} href={href}
            className={`
              flex items-center gap-3 p-4 rounded-xl
              bg-stone-900 border transition-all duration-150
              text-stone-300 hover:text-stone-100 group ${color}
            `}
          >
            <Icon size={18} className="text-stone-500 group-hover:text-amber-400 transition-colors" />
            <span className="text-sm font-medium">{label}</span>
            <ArrowUpRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </div>
  );
}