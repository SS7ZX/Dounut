/* ==========================================================================
 * src/app/(storefront)/page.tsx (ATAU src/app/page.tsx)
 * * STOREFRONT ENTRY POINT — "The Director"
 * ========================================================================== */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
// IMPORT 'Variants' DITAMBAHKAN DI SINI
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Navbar }      from '@/components/Navbar';
import { HeroPromo }   from '@/components/HeroPromo';
import { ProductGrid } from '@/components/ProductGrid';

// --------------------------------------------------------------------------
// CONSTANTS
// --------------------------------------------------------------------------
const BRAND = {
  name:     'Dough & Co.',
  tagline:  'Artisan Bakery',
  location: 'Jakarta Selatan',
  founded:  '2019',
  whatsapp: '0812-3456-7890',
  instagram: '@doughandco.jkt',
  hours:    '10:00 – 21:00 WIB',
} as const;

const NAV_LINKS = [
  { label: 'Semua Donat',  href: '#products'  },
  { label: 'Promo Hari Ini', href: '#promo'    },
  { label: 'Paket Box',      href: '#packages' },
  { label: 'Tentang Kami',   href: '/about'    },
] as const;

const PRELOADER_DURATION_MS = 1400;

// --------------------------------------------------------------------------
// SUB-COMPONENT: CinematicPreloader
// --------------------------------------------------------------------------
function CinematicPreloader() {
  // TYPE : Variants DITAMBAHKAN UNTUK MEMBUNGKAM TYPESCRIPT
  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
    exit: {
      y: '-100%',
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] }, 
    },
  };

  const itemVariants: Variants = {
    hidden:  { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const dotVariants: Variants = {
    hidden:  { opacity: 0.2 },
    visible: {
      opacity: [0.2, 1, 0.2],
      transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  return (
    <motion.div
      key="preloader"
      className="fixed inset-0 z-200 bg-stone-950 flex items-center justify-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1px bg-stone-800"
        variants={itemVariants}
      />

      <div className="relative z-10 flex flex-col items-center gap-3 text-center px-8">
        <motion.p
          variants={itemVariants}
          className="text-[10px] font-semibold text-stone-600 tracking-[0.4em] uppercase"
        >
          {BRAND.location}
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-6xl font-black text-stone-50 tracking-tight leading-none"
          style={{ fontStyle: 'italic' }}
        >
          {BRAND.tagline}
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3"
        >
          <span className="block w-12 h-1px bg-stone-700" />
          <span className="text-[10px] font-bold text-stone-500 tracking-[0.3em] uppercase">
            {BRAND.name}
          </span>
          <span className="block w-12 h-1px bg-stone-700" />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex gap-6px mt-2"
        >
          {[0, 0.4, 0.8].map((delay, i) => (
            <motion.span
              key={i}
              className="w-5px h-5px  rounded-full bg-amber-600"
              variants={dotVariants}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay }}
            />
          ))}
        </motion.div>
      </div>

      <motion.p
        variants={itemVariants}
        className="absolute bottom-6 right-8 text-[10px] text-stone-700 font-semibold tracking-widest uppercase"
      >
        Est. {BRAND.founded}
      </motion.p>
    </motion.div>
  );
}

// --------------------------------------------------------------------------
// SUB-COMPONENT: SiteFooter
// --------------------------------------------------------------------------
function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full bg-stone-950 mt-24 border-t border-stone-900"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12">

        <div className="flex flex-col gap-5">
          <div>
            <p className="text-2xl font-black text-stone-50 italic leading-none">
              {BRAND.tagline}
            </p>
            <p className="text-xs text-stone-500 tracking-widest uppercase mt-1">
              {BRAND.name}
            </p>
          </div>

          <p className="text-sm text-stone-500 leading-relaxed max-w-xs">
            Dibuat dengan tangan setiap pagi. Disajikan segar untuk kamu
            di {BRAND.location} dan sekitarnya.
          </p>

          <div className="flex gap-3">
            {(['ig', 'wa'] as const).map((platform) => (
              <a 
                key={platform}
                href={platform === 'ig' ? `https://instagram.com/${BRAND.instagram}` : `https://wa.me/${BRAND.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-stone-800 flex items-center justify-center text-xs font-semibold text-stone-500 hover:border-stone-600 hover:text-stone-300 transition-all duration-200"
                aria-label={platform === 'ig' ? 'Instagram' : 'WhatsApp'}
              >
                {platform}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-[11px] font-semibold text-stone-600 tracking-[0.15em] uppercase">
            Menu
          </p>
          <nav aria-label="Footer menu navigation">
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a 
                    href={href}
                    className="text-sm text-stone-500 hover:text-stone-300 transition-colors duration-150"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-[11px] font-semibold text-stone-600 tracking-[0.15em] uppercase">
            Info
          </p>
          <ul className="flex flex-col gap-3 text-sm text-stone-500">
            <li>Cara Order</li>
            <li>Kebijakan Pengiriman</li>
            <li>FAQ</li>
            <li>
              <a href="/admin" className="hover:text-stone-300 transition-colors">
                Admin ↗
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-[11px] font-semibold text-stone-600 tracking-[0.15em] uppercase">
            Kontak
          </p>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="text-stone-500">
              <span className="block text-stone-600 text-xs">WhatsApp</span>
              <a 
                href={`https://wa.me/${BRAND.whatsapp.replace(/-/g, '')}`}
                className="hover:text-stone-300 transition-colors"
              >
                {BRAND.whatsapp}
              </a>
            </li>
            <li className="text-stone-500">
              <span className="block text-stone-600 text-xs">Jam Buka</span>
              {BRAND.hours}
            </li>
            <li className="text-stone-500">
              <span className="block text-stone-600 text-xs">Lokasi</span>
              {BRAND.location}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-900">
        <div className="max-w-7xl mx-auto px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-stone-700">
            © {currentYear} {BRAND.name} · {BRAND.location}
          </p>
          <p className="text-xs text-stone-800">
            Powered by Vercel · Built with Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}

// --------------------------------------------------------------------------
// MAIN COMPONENT: Home
// --------------------------------------------------------------------------
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(handleLoadComplete, PRELOADER_DURATION_MS);
    return () => clearTimeout(timer);
  }, [handleLoadComplete]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <CinematicPreloader />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{
          duration: 0.8,
          delay: isLoading ? 1.4 : 0,
          ease: 'easeOut',
        }}
        className="min-h-screen bg-[#FDFCFA]" 
      >
        <Navbar />

        <main className="w-full flex flex-col relative">
          <HeroPromo />
          <ProductGrid />
        </main>

        <SiteFooter />
      </motion.div>
    </>
  );
}