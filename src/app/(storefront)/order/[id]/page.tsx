/* ==========================================================================
 * src/app/order/page.tsx
 * PREMIUM ORDER TRACKING & RECEIPT PAGE
 * Fitur: Status Stepper, Digital Receipt, Smooth Animations
 * ========================================================================== */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  ShoppingBag, 
  ChevronLeft, 
  RefreshCcw,
  MapPin,
  Receipt
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Simulasi Data Pesanan Pelanggan (Nanti ini diganti dengan data dari Database/API)
const MOCK_ORDER = {
  id: '1043',
  customerName: 'Bima',
  status: 'preparing', // Bisa: 'placed', 'preparing', 'ready', 'completed'
  time: '14:30 WIB',
  items: [
    { name: 'Vanilla Popcorn Caramel', qty: 1, price: 4000 },
    { name: 'Matcha Oreo', qty: 2, price: 8000 },
    { name: 'Donat Gula', qty: 1, price: 2500 }
  ],
  subtotal: 14500,
  tax: 1450,
  total: 15950,
};

export default function OrderTrackingPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [orderStatus, setOrderStatus] = useState(MOCK_ORDER.status);

  // Simulasi refresh status
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // Animasi simulasi: jika tadinya preparing, ubah jadi ready saat di-refresh
      if (orderStatus === 'preparing') setOrderStatus('ready');
    }, 1000);
  };

  // Logika UI untuk Progress Bar
  const steps = [
    { id: 'placed', label: 'Pesanan Diterima', icon: Receipt },
    { id: 'preparing', label: 'Sedang Disiapkan', icon: ChefHat },
    { id: 'ready', label: 'Siap Diambil', icon: ShoppingBag },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === orderStatus) !== -1 
    ? steps.findIndex(s => s.id === orderStatus) 
    : 1;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 font-sans selection:bg-amber-200">
      
      {/* --- TOP NAVIGATION --- */}
      <nav className="bg-white px-4 md:px-8 py-4 border-b border-stone-200 sticky top-0 z-50 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-semibold hidden md:inline">Kembali ke Menu</span>
        </Link>
        <h1 className="text-lg font-black text-stone-900 italic tracking-tight">Dough & Co.</h1>
        <div className="w-20" /> {/* Spacer untuk menyeimbangkan flexbox */}
      </nav>

      <main className="max-w-3xl mx-auto px-4 mt-8 md:mt-12 space-y-6 md:space-y-8">
        
        {/* --- ORDER STATUS HEADER --- */}
        <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-stone-100 text-center animate-in slide-in-from-bottom-4 duration-500">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-stone-50 rounded-full mb-6 shadow-inner border border-stone-100">
            {orderStatus === 'ready' ? (
              <CheckCircle2 className="w-10 h-10 text-emerald-500 animate-in zoom-in duration-500" />
            ) : (
              <Clock className="w-10 h-10 text-amber-500 animate-pulse" />
            )}
          </div>
          
          <h2 className="text-2xl md:text-3xl font-black text-stone-900 mb-2">
            {orderStatus === 'ready' ? 'Pesananmu Siap!' : 'Pesanan Sedang Diproses'}
          </h2>
          <p className="text-stone-500 text-sm md:text-base font-medium max-w-md mx-auto">
            {orderStatus === 'ready' 
              ? `Silakan ambil donatmu di meja kasir menggunakan nomor pesanan di bawah.` 
              : `Terima kasih ${MOCK_ORDER.customerName}, koki kami sedang menyiapkan donatmu agar *fresh* saat disajikan.`}
          </p>

          <div className="mt-8 inline-block bg-stone-900 text-white px-8 py-4 rounded-2xl shadow-lg border-4 border-stone-100">
            <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-1">Nomor Pesanan</p>
            <p className="text-5xl font-black tracking-tighter">#{MOCK_ORDER.id}</p>
          </div>
        </div>

        {/* --- TRACKING STEPPER --- */}
        <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-stone-100 animate-in slide-in-from-bottom-8 duration-700 delay-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-stone-900">Status Pesanan</h3>
            <button 
              onClick={handleRefresh}
              className={`flex items-center gap-2 text-sm font-semibold text-amber-600 bg-amber-50 px-4 py-2 rounded-full transition-all hover:bg-amber-100 ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          <div className="relative">
            {/* Garis konektor background */}
            <div className="absolute left-[22px] md:left-[28px] top-4 bottom-4 w-1 bg-stone-100 rounded-full"></div>
            
            <div className="space-y-8">
              {steps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isActive = index === currentStepIndex;
                
                return (
                  <div key={step.id} className="relative flex items-start gap-4 md:gap-6 z-10">
                    {/* Lingkaran Ikon */}
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500 border-4 border-white ${
                      isCompleted ? 'bg-stone-900 text-white shadow-md' : 'bg-stone-100 text-stone-400'
                    } ${isActive && orderStatus !== 'ready' ? 'animate-pulse bg-amber-500 text-white' : ''}`}>
                      <step.icon className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    
                    {/* Teks Status */}
                    <div className="pt-3 md:pt-4">
                      <h4 className={`text-base md:text-lg font-bold ${isCompleted ? 'text-stone-900' : 'text-stone-400'}`}>
                        {step.label}
                      </h4>
                      {isActive && (
                        <p className="text-sm text-stone-500 mt-1 font-medium">
                          {step.id === 'preparing' ? 'Kami sedang mengemas donatmu...' : 'Silakan tunjukkan nomor pesanan ke kasir.'}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- ORDER RECEIPT --- */}
        <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-stone-100 animate-in slide-in-from-bottom-12 duration-700 delay-200">
          <h3 className="text-lg font-bold text-stone-900 mb-6 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-stone-400" />
            Rincian Pesanan
          </h3>

          {/* List Item */}
          <div className="space-y-4 mb-6">
            {MOCK_ORDER.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start text-sm md:text-base">
                <div className="flex gap-3">
                  <span className="font-bold text-stone-900">{item.qty}x</span>
                  <span className="font-medium text-stone-600">{item.name}</span>
                </div>
                <span className="font-semibold text-stone-900">
                  Rp {item.price.toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>

          {/* Garis putus-putus ala struk */}
          <div className="border-t-2 border-dashed border-stone-200 my-6"></div>

          {/* Total */}
          <div className="space-y-3 text-sm md:text-base">
            <div className="flex justify-between text-stone-500 font-medium">
              <span>Subtotal</span>
              <span>Rp {MOCK_ORDER.subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-stone-500 font-medium">
              <span>Pajak Resto (10%)</span>
              <span>Rp {MOCK_ORDER.tax.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center pt-4 mt-2 border-t border-stone-100">
              <span className="font-bold text-stone-900">Total Pembayaran</span>
              <span className="text-xl font-black text-rose-600">
                Rp {MOCK_ORDER.total.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}