// src/app/admin/live-queue/page.tsx — NOSTIMO Live Queue

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Loader2, ChevronRight } from 'lucide-react';
import { OrderService } from '@/lib/supabase';
import { formatIDR, STATUS_CONFIG, STATUS_FLOW } from '@/lib/utils';
import type { OrderWithItems, OrderStatus } from '@/types';

const QUEUE_COLS: { status: OrderStatus; label: string; dot: string }[] = [
  { status: 'pending',    label: 'Masuk',     dot: 'bg-amber-500'   },
  { status: 'confirmed',  label: 'Konfirmasi',dot: 'bg-blue-500'    },
  { status: 'processing', label: 'Diproses',  dot: 'bg-purple-500'  },
  { status: 'ready',      label: 'Siap Kirim',dot: 'bg-emerald-500' },
];

function QueueCard({ order, onAdvance, updating }: {
  order: OrderWithItems;
  onAdvance: (id: string, next: string) => void;
  updating: string | null;
}) {
  const next = STATUS_FLOW[order.status];
  const busy = updating === order.id;
  const nextLabel = next ? STATUS_CONFIG[next as OrderStatus]?.label : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-stone-900 border border-stone-800 rounded-xl p-3.5 mb-2.5 last:mb-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <p className="font-mono text-xs font-bold text-amber-400">
          #{order.id.slice(0, 7).toUpperCase()}
        </p>
        <p className="text-[10px] text-stone-600">{order.order_items.length} item</p>
      </div>

      {/* Customer */}
      <p className="text-xs font-semibold text-stone-200 truncate mb-1">{order.customer_name}</p>
      <p className="text-[10px] text-stone-600 mb-2.5">{order.customer_whatsapp}</p>

      {/* Items preview */}
      <div className="flex -space-x-1.5 mb-2.5">
        {order.order_items.slice(0, 4).map((item, i) => (
          <div key={i} className="w-7 h-7 rounded-lg border-2 border-stone-900 overflow-hidden bg-stone-800">
            <Image src={item.product_image} alt={item.product_name} width={28} height={28} className="object-cover w-full h-full" />
          </div>
        ))}
        {order.order_items.length > 4 && (
          <div className="w-7 h-7 rounded-lg border-2 border-stone-900 bg-stone-800 flex items-center justify-center">
            <span className="text-[9px] font-bold text-stone-500">+{order.order_items.length - 4}</span>
          </div>
        )}
      </div>

      {/* Total + advance button */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-black text-stone-100" suppressHydrationWarning>
          {formatIDR(order.grand_total)}
        </p>
        {next && (
          <button
            onClick={() => onAdvance(order.id, next)}
            disabled={busy}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-stone-700 text-stone-950 text-[10px] font-black transition-all active:scale-95"
          >
            {busy ? <Loader2 size={10} className="animate-spin text-stone-700" /> : null}
            {nextLabel} <ChevronRight size={10} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function LiveQueuePage() {
  const [orders, setOrders]     = useState<OrderWithItems[]>([]);
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [lastRefresh, setLastR] = useState(new Date());

  const load = useCallback(async () => {
    const { data } = await OrderService.getAll();
    setOrders((data ?? []).filter(o => !['delivered','cancelled'].includes(o.status)));
    setLoading(false);
    setLastR(new Date());
  }, []);

  useEffect(() => { load(); }, [load]);

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(() => load(), 30000);
    return () => clearInterval(interval);
  }, [load]);

  const handleAdvance = async (id: string, next: string) => {
    setUpdating(id);
    await OrderService.updateStatus(id, next);
    await load();
    setUpdating(null);
  };

  const getColOrders = (status: OrderStatus) =>
    orders.filter(o => o.status === status);

  return (
    <div className="p-4 sm:p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-stone-100">Live Queue</h1>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            {orders.length} aktif · Refresh otomatis tiap 30 detik
          </p>
        </div>
        <button onClick={() => load()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 text-xs font-medium transition-all"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={22} className="text-amber-500 animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-stone-900 border border-stone-800 rounded-2xl">
          <p className="text-2xl mb-3">🎉</p>
          <p className="text-sm font-bold text-stone-300 mb-1">Queue Kosong!</p>
          <p className="text-xs text-stone-600">Semua pesanan telah diproses</p>
        </div>
      ) : (
        /* Horizontal scroll on mobile, grid on desktop */
        <div className="flex gap-3 overflow-x-auto pb-3 md:grid md:grid-cols-4">
          {QUEUE_COLS.map(({ status, label, dot }) => {
            const colOrders = getColOrders(status);
            return (
              <div key={status} className="shrink-0 w-65 md:w-auto">
                {/* Column header */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-2 h-2 rounded-full ${dot} shrink-0`} />
                  <span className="text-xs font-bold text-stone-400">{label}</span>
                  <span className="ml-auto text-xs font-black text-stone-500 bg-stone-800 px-2 py-0.5 rounded-full">
                    {colOrders.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="min-h-20">
                  {colOrders.length === 0 ? (
                    <div className="border border-dashed border-stone-800 rounded-xl py-6 text-center">
                      <p className="text-xs text-stone-700">Kosong</p>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {colOrders.map(order => (
                        <QueueCard
                          key={order.id}
                          order={order}
                          onAdvance={handleAdvance}
                          updating={updating}
                        />
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}