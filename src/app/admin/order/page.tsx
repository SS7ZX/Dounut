// src/app/(admin)/admin/orders/page.tsx — NOSTIMO Admin Orders

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Search, Filter, ChevronRight, Loader2, RefreshCw } from 'lucide-react';
import { OrderService } from '@/lib/supabase';
import { formatIDR, formatDate, STATUS_CONFIG, STATUS_FLOW } from '@/lib/utils';
import type { OrderWithItems, OrderStatus } from '@/types';

const ALL_STATUSES: { value: string; label: string }[] = [
  { value: 'all',        label: 'Semua'    },
  { value: 'pending',    label: 'Pending'  },
  { value: 'confirmed',  label: 'Konfirmasi'},
  { value: 'processing', label: 'Proses'   },
  { value: 'ready',      label: 'Siap'     },
  { value: 'delivered',  label: 'Selesai'  },
  { value: 'cancelled',  label: 'Batal'    },
];

export default function AdminOrdersPage() {
  const [orders, setOrders]     = useState<OrderWithItems[]>([]);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter]     = useState('all');
  const [search, setSearch]     = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  const loadOrders = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    const { data } = await OrderService.getAll();
    setOrders(data ?? []);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const handleAdvanceStatus = async (order: OrderWithItems) => {
    const next = STATUS_FLOW[order.status];
    if (!next) return;
    setUpdating(order.id);
    await OrderService.updateStatus(order.id, next);
    await loadOrders();
    setUpdating(null);
  };

  const handleCancel = async (orderId: string) => {
    if (!confirm('Batalkan pesanan ini?')) return;
    setUpdating(orderId);
    await OrderService.updateStatus(orderId, 'cancelled');
    await loadOrders();
    setUpdating(null);
  };

  const filtered = orders.filter(o => {
    const matchStatus = filter === 'all' || o.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q
      || o.customer_name.toLowerCase().includes(q)
      || o.id.toLowerCase().includes(q)
      || o.customer_whatsapp.includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="p-5 sm:p-7 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-100">Pesanan</h1>
          <p className="text-sm text-stone-500 mt-0.5">{orders.length} total order</p>
        </div>
        <button onClick={() => loadOrders(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-sm font-medium transition-colors"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600 pointer-events-none" />
          <input type="text" placeholder="Cari nama, order ID, atau WA..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-900 border border-stone-800 rounded-xl overflow-x-auto">
          {ALL_STATUSES.map(({ value, label }) => (
            <button key={value} onClick={() => setFilter(value)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all
                ${filter === value ? 'bg-amber-500 text-stone-950' : 'text-stone-500 hover:text-stone-300'}
              `}
            >
              {label}
              {value !== 'all' && (
                <span className="ml-1.5 opacity-60">
                  {orders.filter(o => o.status === value).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="text-amber-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-stone-600">
            <p className="text-sm">Tidak ada pesanan ditemukan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-800">
                  {['Order ID','Customer','Items','Total','Status','Waktu','Aksi'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-stone-600 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const sc   = STATUS_CONFIG[order.status];
                  const next = STATUS_FLOW[order.status];
                  const isUpdating = updating === order.id;

                  return (
                    <tr key={order.id} className="border-b border-stone-800/40 hover:bg-stone-800/20 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/admin/orders/${order.id}`}
                          className="font-mono text-xs text-amber-400 hover:underline font-bold"
                        >
                          #{order.id.slice(0,8).toUpperCase()}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-stone-200 font-medium truncate max-w-[120px]">{order.customer_name}</p>
                        <p className="text-stone-600 text-xs">{order.customer_whatsapp}</p>
                      </td>
                      <td className="px-4 py-3 text-stone-400">
                        {order.order_items.length} item
                      </td>
                      <td className="px-4 py-3 text-stone-200 font-semibold whitespace-nowrap" suppressHydrationWarning>
                        {formatIDR(order.grand_total)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold border ${sc.bg} ${sc.color}`}>
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-stone-600 text-xs whitespace-nowrap">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {next && (
                            <button onClick={() => handleAdvanceStatus(order)} disabled={isUpdating}
                              className="px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-400 text-xs font-semibold hover:bg-amber-500/25 transition-colors disabled:opacity-50 whitespace-nowrap"
                            >
                              {isUpdating ? '...' : `→ ${STATUS_CONFIG[next as OrderStatus].label}`}
                            </button>
                          )}
                          {order.status !== 'cancelled' && order.status !== 'delivered' && (
                            <button onClick={() => handleCancel(order.id)} disabled={isUpdating}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-medium hover:bg-rose-500/20 transition-colors"
                            >
                              Batal
                            </button>
                          )}
                          <Link href={`/admin/orders/${order.id}`}
                            className="p-1.5 rounded-lg text-stone-600 hover:text-stone-300 hover:bg-stone-700 transition-colors"
                          >
                            <ChevronRight size={14} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}