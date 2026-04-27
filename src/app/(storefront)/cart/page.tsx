'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ArrowRight, ShoppingBag, Plus, Minus, ArrowLeft, Ticket } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const { cart, removeItem, updateQuantity } = useCartStore();
  
  // Mencegah masalah Hydration dengan memastikan komponen dirender di client
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Kalkulasi Harga
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.11; // PPN 11%
  const grandTotal = subtotal + tax;

  // Render layar kosong (blank) sebentar sebelum client siap (Fix absolute untuk Hydration)
  if (!mounted) return null;

  // --- TAMPILAN JIKA KERANJANG KOSONG ---
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
        <div className="w-32 h-32 bg-stone-100 rounded-full flex items-center justify-center mb-8 shadow-inner">
          <ShoppingBag className="w-12 h-12 text-stone-300" />
        </div>
        <h1 className="text-4xl font-black text-stone-900 tracking-tighter italic uppercase mb-4 text-center">
          Kotakmu Masih Kosong
        </h1>
        <p className="text-stone-500 font-medium mb-10 text-center max-w-md text-lg">
          Sepertinya kamu belum memilih donat satupun. Yuk, lihat menu Nostimo dan penuhi kotakmu!
        </p>
        <Link href="/">
          <Button className="bg-stone-900 hover:bg-amber-600 text-white rounded-full px-8 py-7 font-bold transition-all shadow-xl hover:shadow-amber-600/20 text-lg hover:scale-105">
            <ArrowLeft className="w-5 h-5 mr-2" /> Kembali Pilih Donat
          </Button>
        </Link>
      </div>
    );
  }

  // --- TAMPILAN JIKA KERANJANG ADA ISINYA ---
  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-24 font-sans px-4 md:px-8 py-12 max-w-7xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Cart */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <Link href="/">
            <button className="w-12 h-12 flex items-center justify-center bg-white border border-stone-200 hover:bg-stone-100 rounded-full transition-all shadow-sm hover:scale-105">
              <ArrowLeft className="w-5 h-5 text-stone-900" />
            </button>
          </Link>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tighter italic uppercase">
              Kotak Pesanan.
            </h1>
            <p className="text-stone-500 font-medium mt-1">
              Kamu punya {cart.length} macam donat di kotak ini.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Kolom Kiri: Daftar Item */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-5">
          {cart.map((item) => (
            <div key={item.id} className="bg-white p-4 sm:p-5 rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-6 group relative overflow-hidden">
              
              {/* Gambar Produk */}
              <div className="w-full sm:w-28 h-28 bg-stone-50 rounded-3xl relative flex-shrink-0 flex items-center justify-center p-2">
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  fill 
                  className="object-contain group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Info & Kontrol */}
              <div className="flex-1 w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-xl font-black text-stone-900 italic uppercase tracking-tight">{item.name}</h3>
                  <p suppressHydrationWarning className="font-bold text-amber-600 mt-1">
                    IDR {item.price.toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Quantity Control di Cart */}
                  <div className="flex items-center bg-stone-50 rounded-full p-1 border border-stone-100">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-full transition-all text-stone-500 shadow-sm"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-black text-stone-900">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-full transition-all text-stone-500 shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Tombol Hapus */}
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-500 hover:text-white hover:bg-rose-500 rounded-full transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Kolom Kanan: Order Summary */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-stone-900 text-white rounded-[2rem] p-8 shadow-2xl sticky top-8">
            <h2 className="text-2xl font-black italic uppercase mb-6 flex items-center gap-2">
              <Ticket className="w-6 h-6 text-amber-500" /> Ringkasan
            </h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-stone-300 items-center">
                <span className="font-medium">Subtotal ({cart.length} item)</span>
                <span suppressHydrationWarning className="font-bold text-white text-lg">
                  IDR {subtotal.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between text-stone-300 items-center">
                <span className="font-medium">Tax & Service (11%)</span>
                <span suppressHydrationWarning className="font-bold text-white text-lg">
                  IDR {tax.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="border-t border-stone-700 pt-6 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-lg font-medium text-stone-300">Total Pembayaran</span>
                <span suppressHydrationWarning className="text-3xl font-black italic text-amber-500">
                  IDR {grandTotal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <Button className="w-full bg-amber-500 hover:bg-amber-600 text-stone-900 rounded-2xl py-7 font-black text-lg transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:scale-[1.02]">
              Lanjut Checkout <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <p className="text-center text-stone-500 text-xs font-medium mt-4">
              Pembayaran aman dengan standar enkripsi industri.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}