// src/app/admin/orders/page.tsx — NOSTIMO Admin Orders

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, RefreshCw, ChevronRight, Loader2, X } from 'lucide-react';
import { OrderService } from '@/lib/supabase';
import { formatIDR, formatDate, STATUS_CONFIG, STATUS_FLOW } from '@/lib/utils';
import type { OrderWithItems, OrderStatus } from '@/types';

const STATUS_TABS: { value: string; label: string }[] = [
  { value: 'all',        label: 'Semua'     },
  { value: 'pending',    label: 'Pending'   },
  { value: 'confirmed',  label: 'Konfirm'   },
  { value: 'processing', label: 'Proses'    },
  { value: 'ready',      label: 'Siap'      },
  { value: 'delivered',  label: 'Selesai'   },
  { value: 'cancelled',  label: 'Batal'     },
];

export default function AdminOrdersPage() {
  const [orders, setOrders]     = useState<OrderWithItems[]>([]);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRef]    = useState(false);
  const [search, setSearch]     = useState('');
  const [tab, setTab]           = useState('all');
  const [updating, setUpdating] = useState<string | null>(null);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRef(true);
    const { data } = await OrderService.getAll();
    setOrders(data ?? []);
    setLoading(false);
    setRef(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdvance = async (order: OrderWithItems) => {
    const next = STATUS_FLOW[order.status];
    if (!next) return;
    setUpdating(order.id);
    await OrderService.updateStatus(order.id, next);
    await load();
    setUpdating(null);
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Batalkan pesanan ini?')) return;
    setUpdating(id);
    await OrderService.updateStatus(id, 'cancelled');
    await load();
    setUpdating(null);
  };

  const filtered = orders.filter(o => {
    const matchTab = tab === 'all' || o.status === tab;
    const q = search.toLowerCase();
    const matchSearch = !q
      || o.customer_name.toLowerCase().includes(q)
      || o.id.toLowerCase().includes(q)
      || o.customer_whatsapp.includes(q);
    return matchTab && matchSearch;
  });

  const countByStatus = (s: string) => s === 'all' ? orders.length : orders.filter(o => o.status === s).length;

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold text-stone-100">Pesanan</h1>
          <p className="text-xs text-stone-500 mt-0.5">{orders.length} total order</p>
        </div>
        <button onClick={() => load(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 text-xs font-medium transition-all"
        >
          <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600 pointer-events-none" />
        <input
          type="text"
          placeholder="Cari nama, order ID, atau WA..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-10 bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-9 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 transition-colors"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-400">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Status tabs — scrollable on mobile */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4 scrollbar-hide">
        {STATUS_TABS.map(({ value, label }) => (
          <button key={value} onClick={() => setTab(value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
              tab === value
                ? 'bg-amber-500 text-stone-950'
                : 'bg-stone-900 border border-stone-800 text-stone-500 hover:text-stone-300'
            }`}
          >
            {label}
            <span className={`text-[10px] font-bold ${tab === value ? 'text-stone-800' : 'text-stone-700'}`}>
              {countByStatus(value)}
            </span>
          </button>
        ))}
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={22} className="text-amber-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-stone-900 border border-stone-800 rounded-2xl">
          <p className="text-sm text-stone-600">Tidak ada pesanan ditemukan</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          <AnimatePresence>
            {filtered.map((order, i) => {
              const sc   = STATUS_CONFIG[order.status];
              const next = STATUS_FLOW[order.status];
              const busy = updating === order.id;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-stone-900 border border-stone-800 rounded-2xl p-4 hover:border-stone-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-mono text-xs font-bold text-amber-400">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sc.bg} ${sc.color}`}>
                          {sc.label}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">{formatDate(order.created_at)}</p>
                    </div>
                    <p className="text-sm font-black text-stone-100 shrink-0" suppressHydrationWarning>
                      {formatIDR(order.grand_total)}
                    </p>
                  </div>

                  {/* Customer info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex -space-x-2">
                      {order.order_items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="w-7 h-7 rounded-lg border-2 border-stone-900 overflow-hidden bg-stone-800">
                          <Image src={item.product_image} alt={item.product_name} width={28} height={28} className="object-cover w-full h-full" />
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-stone-300 truncate">{order.customer_name}</p>
                      <p className="text-[10px] text-stone-600 truncate">{order.customer_whatsapp} · {order.order_items.length} item</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {next && (
                      <button onClick={() => handleAdvance(order)} disabled={busy}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-500/12 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-colors disabled:opacity-50"
                      >
                        {busy ? <Loader2 size={12} className="animate-spin" /> : null}
                        {busy ? '...' : `Proses → ${STATUS_CONFIG[next as OrderStatus]?.label}`}
                      </button>
                    )}
                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <button onClick={() => handleCancel(order.id)} disabled={busy}
                        className="px-3 py-2 rounded-xl bg-rose-500/10 text-rose-400 text-xs font-medium hover:bg-rose-500/15 transition-colors disabled:opacity-50"
                      >
                        Batal
                      </button>
                    )}
                    <Link href={`/admin/orders/${order.id}`}
                      className="p-2 rounded-xl bg-stone-800 text-stone-500 hover:text-stone-300 transition-colors"
                    >
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}