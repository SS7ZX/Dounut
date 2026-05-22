// src/app/admin/products/page.tsx — NOSTIMO Admin Products

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Loader2, RefreshCw, Eye, EyeOff, Pencil, Package } from 'lucide-react';
import { ProductService } from '@/lib/supabase';
import { formatIDR, BADGE_CONFIG } from '@/lib/utils';
import type { Product } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [toggling, setToggle]   = useState<number | null>(null);

  const load = useCallback(async () => {
    const { data } = await ProductService.getAllAdmin();
    setProducts(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleToggle = async (p: Product) => {
    setToggle(p.id);
    await ProductService.toggle(p.id, !p.is_available);
    await load();
    setToggle(null);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold text-stone-100">Produk</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            {products.filter(p => p.is_available).length} aktif dari {products.length} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setLoading(true); load(); }}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-500 hover:text-stone-300 transition-all"
          >
            <RefreshCw size={14} />
          </button>
          <Link href="/admin/products/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm font-bold transition-colors"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Produk Baru</span>
            <span className="sm:hidden">Baru</span>
          </Link>
        </div>
      </div>

      {/* Product list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={22} className="text-amber-500 animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-stone-900 border border-stone-800 rounded-2xl">
          <Package size={36} className="text-stone-700 mx-auto mb-3" />
          <p className="text-sm text-stone-600 mb-4">Belum ada produk</p>
          <Link href="/admin/products/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 text-sm font-bold hover:bg-amber-400 transition-colors"
          >
            <Plus size={15} />
            Tambah Produk Pertama
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {products.map((product, i) => {
            const badge = product.badge ? BADGE_CONFIG[product.badge] : null;
            const busy  = toggling === product.id;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`
                  flex items-center gap-3 bg-stone-900 border rounded-2xl p-3.5
                  transition-all duration-200
                  ${product.is_available ? 'border-stone-800' : 'border-stone-800/50 opacity-60'}
                `}
              >
                {/* Image */}
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-800 shrink-0">
                  <Image src={product.image_url} alt={product.name} fill sizes="48px" className="object-cover" />
                  {!product.is_available && (
                    <div className="absolute inset-0 bg-stone-950/60 flex items-center justify-center">
                      <EyeOff size={12} className="text-stone-400" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-playfair text-sm font-black italic text-stone-100 truncate">
                      {product.name}
                    </p>
                    {badge && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-amber-400" suppressHydrationWarning>
                      {formatIDR(product.price)}
                    </p>
                    <span className="text-stone-700">·</span>
                    <p className="text-xs text-stone-600 capitalize">{product.category}</p>
                    <span className="text-stone-700">·</span>
                    <p className="text-xs text-stone-600">Stok: {product.stock}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Toggle available */}
                  <button
                    onClick={() => handleToggle(product)}
                    disabled={busy}
                    className={`
                      flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold
                      transition-all disabled:opacity-50
                      ${product.is_available
                        ? 'bg-emerald-500/12 text-emerald-400 hover:bg-emerald-500/20'
                        : 'bg-stone-800 text-stone-500 hover:bg-stone-700'}
                    `}
                    aria-label={product.is_available ? 'Nonaktifkan' : 'Aktifkan'}
                  >
                    {busy
                      ? <Loader2 size={12} className="animate-spin" />
                      : product.is_available
                        ? <Eye size={12} />
                        : <EyeOff size={12} />
                    }
                    <span className="hidden sm:inline">
                      {product.is_available ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </button>

                  {/* Edit */}
                  <Link href={`/admin/products/${product.id}/edit`}
                    className="p-2 rounded-lg bg-stone-800 text-stone-500 hover:text-stone-200 hover:bg-stone-700 transition-all"
                    aria-label="Edit produk"
                  >
                    <Pencil size={13} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}