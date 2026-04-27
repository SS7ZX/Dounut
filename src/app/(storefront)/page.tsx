// src/app/(storefront)/page.tsx — NOSTIMO Storefront Homepage
// This is the page that loads at localhost:3000

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroPromo }   from '@/components/HeroPromo';
import { ProductGrid } from '@/components/ProductGrid';

// ── Cinematic Preloader ──────────────────────────────────────────────────────
function Preloader() {
  return (
    <motion.div
      key="preloader"
      className="fixed inset-0 z-[200] bg-stone-950 flex flex-col items-center justify-center gap-4"
      exit={{ y: '-100%', transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
    >
      {/* Dot grid background */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-3 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[10px] font-semibold text-stone-600 tracking-[0.5em] uppercase"
        >
          Jakarta Selatan
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-playfair text-5xl md:text-6xl font-black italic text-stone-50 leading-none tracking-tight"
        >
          Nostimo
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex items-center gap-3"
        >
          <span className="block w-10 h-[1px] bg-stone-800" />
          <span className="text-[10px] font-bold text-stone-600 tracking-[0.3em] uppercase">
            Artisan Donut
          </span>
          <span className="block w-10 h-[1px] bg-stone-800" />
        </motion.div>

        {/* Animated loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="flex gap-1.5 mt-2"
        >
          {[0, 0.2, 0.4].map((delay, i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-amber-500"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay }}
            />
          ))}
        </motion.div>
      </div>

      {/* Est. year — bottom right */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 right-6 text-[10px] text-stone-800 font-semibold tracking-widest uppercase"
      >
        Est. 2019
      </motion.p>
    </motion.div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <HeroPromo />
        <ProductGrid />
      </motion.div>
    </>
  );
}