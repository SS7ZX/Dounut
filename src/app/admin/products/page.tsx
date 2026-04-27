// src/app/(admin)/admin/products/page.tsx — NOSTIMO Admin Products

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, ToggleLeft, ToggleRight, Pencil, Loader2 } from 'lucide-react';
import { ProductService } from '@/lib/supabase';
import { formatIDR, BADGE_CONFIG } from '@/lib/utils';
import type { Product } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [toggling, setToggling] = useState<number | null>(null);

  const load = useCallback(async () => {
    const { data } = await ProductService.getAllAdmin();
    setProducts(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleToggle = async (product: Product) => {
    setToggling(product.id);
    await ProductService.toggle(product.id, !product.is_available);
    await load();
    setToggling(null);
  };

  return (
    <div className="p-5 sm:p-7 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-100">Produk</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            {products.filter(p => p.is_available).length} aktif dari {products.length} total
          </p>
        </div>
        <Link href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm font-bold transition-colors"
        >
          <Plus size={16} />
          Produk Baru
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="text-amber-500 animate-spin" />
        </div>
      ) : (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-800">
                  {['Produk','Kategori','Harga','Stok','Badge','Status','Aksi'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-stone-600 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const badge = p.badge ? BADGE_CONFIG[p.badge] : null;
                  return (
                    <tr key={p.id} className="border-b border-stone-800/40 hover:bg-stone-800/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-stone-800 flex-shrink-0">
                            <Image src={p.image_url} alt={p.name} fill sizes="40px" className="object-cover" />
                          </div>
                          <div>
                            <p className="text-stone-200 font-medium font-playfair italic">{p.name}</p>
                            <p className="text-stone-600 text-xs line-clamp-1 max-w-[180px]">{p.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-stone-400 bg-stone-800 px-2 py-1 rounded-full capitalize">{p.category}</span>
                      </td>
                      <td className="px-4 py-3 text-stone-200 font-semibold whitespace-nowrap" suppressHydrationWarning>
                        {formatIDR(p.price)}
                      </td>
                      <td className="px-4 py-3 text-stone-400">{p.stock}</td>
                      <td className="px-4 py-3">
                        {badge ? (
                          <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${badge.bg} ${badge.text}`}>
                            {badge.label}
                          </span>
                        ) : <span className="text-stone-700 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleToggle(p)} disabled={toggling === p.id}
                          className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                            p.is_available ? 'text-emerald-400' : 'text-stone-600'
                          }`}
                        >
                          {toggling === p.id
                            ? <Loader2 size={14} className="animate-spin" />
                            : p.is_available
                              ? <ToggleRight size={16} />
                              : <ToggleLeft size={16} />
                          }
                          {p.is_available ? 'Aktif' : 'Nonaktif'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/products/${p.id}/edit`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-stone-200 text-xs font-medium transition-colors"
                        >
                          <Pencil size={12} />
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}