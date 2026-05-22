// src/components/storefront/HeroPromo.tsx — NOSTIMO Hero

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Star } from 'lucide-react';

const STATS = [
  { value: '4.9',  label: 'Rating'   },
  { value: '2K+',  label: 'Pelanggan'},
  { value: '12',   label: 'Varian'   },
] as const;

export function HeroPromo() {
  return (
    <section
      id="hero"
      className="
        relative min-h-[92vh] flex items-center
        bg-stone-950 overflow-hidden
        pt-4 pb-16 px-4 sm:px-6
      "
    >
      {/* Background texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Glow blobs */}
      <div aria-hidden="true" className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-amber-500/10 blur-[120px]" />
      <div aria-hidden="true" className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-rose-500/10 blur-[120px]" />

      <div className="relative z-10 max-w-4xl mx-auto w-full text-center">
        <div className="flex flex-col items-center justify-center gap-6">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="
              inline-flex items-center gap-2 px-4 py-2 rounded-full
              bg-amber-500/10 border border-amber-500/30
              text-amber-400 text-xs font-semibold
            ">
              <Sparkles size={12} />
              Featured this week
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="font-playfair text-5xl sm:text-6xl xl:text-7xl font-black text-stone-50 leading-[1.05] tracking-tight">
              Crafted with
              <br />
              <span className="italic text-amber-400">Love &</span>
              <br />
              Flour.
            </h1>
          </motion.div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-stone-400 text-base sm:text-lg leading-relaxed max-w-md mx-auto"
          >
            Nostimo donuts handcrafted every morning. Premium ingredients,
            unforgettable flavors — delivered fresh to your door.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <Link href="/menu"
              className="
                flex items-center gap-2 px-7 py-3.5 rounded-xl
                bg-amber-500 hover:bg-amber-400 active:bg-amber-600
                text-stone-950 font-bold text-sm
                transition-all duration-150
                shadow-lg shadow-amber-500/25
              "
            >
              Lihat Menu
              <ArrowRight size={16} />
            </Link>
            <Link href="/register"
              className="
                px-7 py-3.5 rounded-xl text-sm font-semibold
                text-stone-400 hover:text-stone-200
                border border-stone-800 hover:border-stone-600
                transition-all duration-150
              "
            >
              Daftar Gratis
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-center gap-8 pt-6 border-t border-stone-900 w-full max-w-md mx-auto mt-4"
          >
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-black text-stone-50">{value}</p>
                <p className="text-xs text-stone-600 font-medium mt-0.5">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}