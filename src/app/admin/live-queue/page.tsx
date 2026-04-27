/* ==========================================================================
 * src/app/admin/live-queue/page.tsx
 * PREMIUM LIVE ORDER QUEUE (KITCHEN & CUSTOMER DISPLAY)
 * Fitur: Real-time clock, Split-screen Status, Auto-Animations
 * ========================================================================== */

'use client';

import React, { useState, useEffect } from 'react';
import { Clock, ChefHat, BellRing, CheckCircle2, ArrowRight } from 'lucide-react';

// Tipe data order
type OrderStatus = 'preparing' | 'ready';

interface Order {
  id: string;
  customerName: string;
  items: string[];
  status: OrderStatus;
  timestamp: Date;
}

// Data Simulasi Awal
const INITIAL_ORDERS: Order[] = [
  { id: '1042', customerName: 'Kak Sarah', items: ['2x Matcha Oreo', '1x Donat Gula'], status: 'ready', timestamp: new Date() },
  { id: '1043', customerName: 'Bima', items: ['1x Vanilla Popcorn', '1x Kopi Susu'], status: 'ready', timestamp: new Date() },
  { id: '1044', customerName: 'Kak Nisa', items: ['6x Buttercream Meses (Box)'], status: 'preparing', timestamp: new Date() },
  { id: '1045', customerName: 'Gojek - Anton', items: ['12x Mix Moderne Collection'], status: 'preparing', timestamp: new Date() },
  { id: '1046', customerName: 'Dina', items: ['1x Strawberry Crunch'], status: 'preparing', timestamp: new Date() },
];

export default function LiveQueuePage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Update jam real-time setiap detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter Order berdasarkan status
  const preparingOrders = orders.filter((o) => o.status === 'preparing');
  const readyOrders = orders.filter((o) => o.status === 'ready');

  // Fungsi untuk memindahkan order dari "Preparing" ke "Ready"
  const markAsReady = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: 'ready', timestamp: new Date() } : order
      )
    );
  };

  // Fungsi untuk menyelesaikan order (Dihapus dari layar karena sudah diambil)
  const completeOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8 font-sans">
      
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-center bg-stone-900 text-white rounded-3xl p-6 mb-8 shadow-lg">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
            <BellRing className="text-amber-400 animate-bounce" />
            DOUGH & CO. <span className="font-light italic opacity-80">Live Queue</span>
          </h1>
          <p className="text-stone-400 text-sm mt-1">Sistem Antrean Pesanan Real-time</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3 bg-stone-800/50 px-6 py-3 rounded-2xl border border-stone-700">
          <Clock className="text-amber-400 w-5 h-5" />
          <span className="text-xl md:text-2xl font-mono font-bold tracking-widest text-amber-50">
            {currentTime || '00:00:00'}
          </span>
        </div>
      </header>

      {/* --- MAIN GRID (SPLIT SCREEN) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        
        {/* KOLOM KIRI: PREPARING (Sedang Disiapkan) */}
        <section className="flex flex-col h-full bg-white rounded-[2rem] border border-stone-200 shadow-sm overflow-hidden">
          <div className="bg-amber-100 p-6 border-b border-amber-200">
            <h2 className="text-2xl font-black text-amber-900 flex items-center gap-3 uppercase tracking-wider">
              <ChefHat className="w-8 h-8 text-amber-600" />
              Sedang Disiapkan
              <span className="ml-auto bg-amber-900 text-white text-sm py-1 px-3 rounded-full">
                {preparingOrders.length}
              </span>
            </h2>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto space-y-4 max-h-[600px] hide-scrollbar">
            {preparingOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-stone-400 opacity-70">
                <ChefHat className="w-16 h-16 mb-4" />
                <p className="font-medium text-lg">Tidak ada antrean dapur</p>
              </div>
            ) : (
              preparingOrders.map((order) => (
                <div key={order.id} className="group relative bg-stone-50 rounded-2xl p-5 border border-stone-100 flex justify-between items-center hover:border-amber-300 transition-colors duration-300">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl font-black text-stone-900">#{order.id}</span>
                      <span className="text-sm font-semibold text-stone-500 bg-stone-200 px-3 py-1 rounded-full">
                        {order.customerName}
                      </span>
                    </div>
                    <ul className="text-stone-600 text-sm font-medium space-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Tombol Aksi Admin: Pindah ke Ready */}
                  <button 
                    onClick={() => markAsReady(order.id)}
                    className="shrink-0 w-14 h-14 bg-white border-2 border-stone-200 rounded-full flex items-center justify-center text-stone-400 hover:border-emerald-500 hover:text-emerald-500 hover:bg-emerald-50 transition-all duration-300 shadow-sm"
                    title="Tandai Siap"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* KOLOM KANAN: READY (Siap Diambil) */}
        <section className="flex flex-col h-full bg-white rounded-[2rem] border border-stone-200 shadow-xl overflow-hidden">
          <div className="bg-emerald-500 p-6 border-b border-emerald-600">
            <h2 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-wider">
              <CheckCircle2 className="w-8 h-8 text-emerald-200" />
              Siap Diambil
              <span className="ml-auto bg-white text-emerald-800 text-sm py-1 px-3 rounded-full font-bold">
                {readyOrders.length}
              </span>
            </h2>
          </div>

          <div className="p-6 flex-1 overflow-y-auto max-h-[600px] hide-scrollbar">
            {readyOrders.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-stone-400 opacity-70">
                <CheckCircle2 className="w-16 h-16 mb-4" />
                <p className="font-medium text-lg">Belum ada pesanan yang siap</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {readyOrders.map((order) => (
                  <div 
                    key={order.id} 
                    onClick={() => completeOrder(order.id)}
                    className="relative cursor-pointer bg-emerald-50 rounded-2xl p-6 border-2 border-emerald-200 flex flex-col items-center justify-center text-center hover:bg-emerald-100 hover:scale-[1.02] transition-all duration-300 animate-in zoom-in-95"
                    title="Klik untuk menyelesaikan order"
                  >
                    <span className="text-5xl font-black text-emerald-800 tracking-tighter mb-2">
                      {order.id}
                    </span>
                    <span className="text-sm font-bold text-emerald-600 bg-white px-3 py-1 rounded-full shadow-sm">
                      {order.customerName}
                    </span>
                    
                    {/* Badge "NEW" Animasi Pulse untuk Order Baru Siap */}
                    <div className="absolute -top-3 -right-3 bg-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-full animate-pulse shadow-md border-2 border-white">
                      AMBIL
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}