'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cart, updateQty, removeFromCart, totalPrice } = useCart();

  const formatPrice = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

  return (
    <div className="min-h-screen bg-[#FDFCFA] flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20 w-full">
        <h1 className="font-playfair text-4xl md:text-5xl font-black text-stone-900 mb-8">
          Your <span className="italic text-amber-500">Cart</span>
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-100">
            <ShoppingBag size={48} className="mx-auto text-stone-300 mb-4" />
            <h2 className="text-xl font-bold text-stone-900 mb-2">Keranjang masih kosong</h2>
            <p className="text-stone-500 mb-6">Yuk, pilih donat favoritmu dulu!</p>
            <Link href="/menu" className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-xl font-bold text-sm hover:bg-stone-800 transition-colors">
              Lihat Menu Menu
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Bagian Kiri: List Item */}
            <div className="flex-grow space-y-4 md:space-y-6">
              {cart.map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  key={item.id} 
                  className="flex items-center gap-4 md:gap-6 bg-white p-4 md:p-6 rounded-3xl border border-stone-100 shadow-sm"
                >
                  <div className="relative w-20 h-20 md:w-28 md:h-28 bg-stone-50 rounded-2xl shrink-0">
                    <Image src={item.img} alt={item.name} fill className="object-contain p-2" />
                  </div>
                  
                  <div className="flex-grow flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-stone-900 md:text-lg mb-1">{item.name}</h3>
                      <p className="text-amber-600 font-black">{formatPrice(item.price)}</p>
                    </div>

                    <div className="flex items-center gap-4 md:gap-8">
                      {/* Control Qty */}
                      <div className="flex items-center gap-3 bg-stone-50 border border-stone-200 rounded-xl p-1">
                        <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-stone-600 hover:text-stone-900">
                          <Minus size={14} />
                        </button>
                        <span className="w-4 text-center font-bold text-sm text-stone-900">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-stone-600 hover:text-stone-900">
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Remove */}
                      <button onClick={() => removeFromCart(item.id)} className="w-10 h-10 flex items-center justify-center rounded-full text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bagian Kanan: Summary Kertas Struk */}
            <div className="lg:w-[400px] shrink-0">
              <div className="bg-stone-950 text-white p-6 md:p-8 rounded-[2rem] sticky top-28">
                <h3 className="font-playfair text-2xl font-black mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6 text-sm text-stone-400">
                  <div className="flex justify-between">
                    <span>Subtotal ({cart.length} items)</span>
                    <span className="text-stone-100 font-bold">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%)</span>
                    <span className="text-stone-100 font-bold">{formatPrice(totalPrice * 0.1)}</span>
                  </div>
                </div>

                <hr className="border-stone-800 mb-6" />

                <div className="flex justify-between items-center mb-8">
                  <span className="text-stone-400 font-medium">Total</span>
                  <span className="text-2xl font-black text-amber-500">{formatPrice(totalPrice + (totalPrice * 0.1))}</span>
                </div>

                <Link href="/checkout" className="w-full flex items-center justify-center gap-2 bg-amber-500 text-stone-950 py-4 rounded-xl font-bold hover:bg-amber-400 transition-colors">
                  Proceed to Checkout <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}