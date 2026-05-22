// src/components/PromoBanner.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function PromoBanner() {
  return (
    <section className="w-full bg-amber-500 py-16 px-6 overflow-hidden relative">
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, black 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />
      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-playfair text-4xl md:text-5xl font-black text-stone-950 mb-4 tracking-tight">
            Spesial Bulan Ini: <span className="italic">Buy 1 Get 1</span>
          </h2>
          <p className="text-stone-900 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-8">
            Nikmati kelezatan donat artisan kami dengan promo spesial. Berlaku untuk semua varian rasa favoritmu.
          </p>
          <button className="bg-stone-950 text-stone-50 px-8 py-4 rounded-xl font-bold hover:bg-stone-800 transition-colors shadow-xl shadow-stone-950/20">
            Klaim Promo Sekarang
          </button>
        </motion.div>
      </div>
    </section>
  );
}
