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

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — Text content */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">

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
              className="text-stone-400 text-base sm:text-lg leading-relaxed max-w-md"
            >
              Artisan donuts handcrafted every morning. Premium ingredients,
              unforgettable flavors — delivered fresh to your door.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3"
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
              className="flex items-center gap-8 pt-4 border-t border-stone-900"
            >
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-black text-stone-50">{value}</p>
                  <p className="text-xs text-stone-600 font-medium mt-0.5">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Product showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative order-1 lg:order-2 flex justify-center"
          >
            {/* Main product card */}
            <div className="
              relative w-full max-w-sm
              bg-gradient-to-br from-stone-900 to-stone-950
              border border-stone-800 rounded-3xl
              p-6 overflow-hidden
            ">
              {/* Card glow */}
              <div aria-hidden="true" className="absolute inset-0 bg-amber-500/5 rounded-3xl" />

              {/* Badge */}
              <div className="relative flex items-center justify-between mb-5">
                <span className="
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full
                  bg-amber-500 text-stone-950 text-xs font-black
                ">
                  <Star size={11} fill="currentColor" />
                  Best Seller
                </span>
                <span className="text-xs text-stone-500 font-medium">Minggu ini</span>
              </div>

              {/* Product image */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-stone-800 mb-5">
                <Image
                  src="/donat1.png"
                  alt="Matcha Remastered — Nostimo featured donut"
                  fill sizes="(max-width: 768px) 80vw, 360px"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Product info */}
              <div className="relative">
                <h2 className="font-playfair text-xl font-black italic text-stone-50">
                  Matcha Remastered
                </h2>
                <p className="text-sm text-stone-500 mt-1 leading-relaxed">
                  Double matcha glaze, white chocolate drizzle
                </p>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-2xl font-black text-amber-400" suppressHydrationWarning>
                    Rp 18.000
                  </p>
                  <Link href="/menu"
                    className="
                      px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30
                      text-amber-400 text-sm font-bold
                      hover:bg-amber-500/25 transition-colors
                    "
                  >
                    Order →
                  </Link>
                </div>
              </div>
            </div>

            {/* Floating mini cards */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="
                absolute -top-4 -right-4 sm:-right-8
                bg-stone-900 border border-stone-800
                rounded-2xl px-4 py-3
                flex items-center gap-3 shadow-xl shadow-black/40
              "
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <span className="text-emerald-400 text-sm">🍩</span>
              </div>
              <div>
                <p className="text-xs font-bold text-stone-200">Fresh daily</p>
                <p className="text-[10px] text-stone-500">Setiap pagi</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="
                absolute -bottom-4 -left-4 sm:-left-8
                bg-stone-900 border border-stone-800
                rounded-2xl px-4 py-3
                shadow-xl shadow-black/40
              "
            >
              <p className="text-[10px] text-stone-500 mb-0.5">Rata-rata rating</p>
              <div className="flex items-center gap-1.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={10} className="text-amber-400" fill="currentColor" />
                ))}
                <span className="text-xs font-bold text-stone-200 ml-1">4.9</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}