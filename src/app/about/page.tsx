/* ==========================================================================
 * src/app/about/page.tsx — NOSTIMO About Page
 * Premium brand story, values, team, and behind-the-scenes.
 * ========================================================================== */

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Heart, Sparkles, Leaf, Clock, Award, Users,
  ArrowRight, MapPin, Star, Coffee, UtensilsCrossed,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

// ── Constants ────────────────────────────────────────────────────────────────
const VALUES = [
  {
    icon: <Leaf size={24} />,
    title: 'Bahan Premium',
    desc: 'Kami hanya menggunakan bahan-bahan pilihan terbaik: mentega Prancis, cokelat Belgia, dan matcha grade saji dari Kyoto.',
    color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  },
  {
    icon: <Clock size={24} />,
    title: 'Fresh Setiap Hari',
    desc: 'Tidak ada stok kemarin. Setiap donat dibuat dari awal setiap pagi oleh tim pastry kami yang berdedikasi.',
    color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  },
  {
    icon: <Heart size={24} />,
    title: 'Handcrafted with Love',
    desc: 'Setiap glazing, topping, dan filling dikerjakan dengan tangan — bukan mesin. Karena rasa dimulai dari hati.',
    color: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  },
  {
    icon: <Award size={24} />,
    title: 'Kualitas Tanpa Kompromi',
    desc: 'Dari dapur sampai ke tangan kamu, kami memastikan setiap donat melewati standar kualitas tertinggi kami.',
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  },
  {
    icon: <Users size={24} />,
    title: 'Komunitas Lokal',
    desc: 'Kami mendukung petani dan supplier lokal Indonesia. Setiap pembelian membantu membangun ekonomi komunitas.',
    color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  },
  {
    icon: <Sparkles size={24} />,
    title: 'Inovasi Tiada Henti',
    desc: 'Tim R&D kami selalu bereksperimen dengan rasa dan teknik baru untuk menghadirkan pengalaman donat yang unik.',
    color: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  },
];

const MILESTONES = [
  { year: '2019', title: 'Awal Mula',        desc: 'Dimulai dari dapur rumah di Jakarta Selatan dengan resep warisan keluarga.' },
  { year: '2020', title: 'Viral di Medsos',   desc: 'Matcha Remastered menjadi viral di Instagram, pesanan membludak.' },
  { year: '2021', title: 'Toko Pertama',      desc: 'Membuka toko flagship pertama di Kemang, Jakarta Selatan.' },
  { year: '2022', title: '1000+ Pelanggan',   desc: 'Mencapai milestone 1000 pelanggan setia dan meluncurkan 12 varian.' },
  { year: '2023', title: 'Ekspansi Menu',     desc: 'Menambah koleksi Chocolate dan Fruit series, total 20 varian.' },
  { year: '2024', title: 'Awards & Beyond',   desc: 'Meraih penghargaan "Best Artisan Bakery Jakarta" dan terus berkembang.' },
];

const STATS = [
  { value: '2K+',  label: 'Happy Customers', icon: <Users size={20} /> },
  { value: '20',   label: 'Flavor Variants',  icon: <Coffee size={20} /> },
  { value: '5+',   label: 'Tahun Berkarya',   icon: <Clock size={20} /> },
  { value: '4.9',  label: 'Average Rating',   icon: <Star size={20} /> },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (d: number) => ({ opacity: 1, y: 0, transition: { delay: d * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } }),
};

// ── Component ────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Navbar />

      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="relative bg-stone-950 overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />
        <div aria-hidden="true" className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full bg-amber-500/8 blur-[160px]" />
        <div aria-hidden="true" className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-rose-500/6 blur-[140px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-20 md:pt-28 md:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text side */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="order-2 lg:order-1"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-6">
                <Heart size={12} />
                Our Story
              </span>
              <h1 className="font-playfair text-4xl sm:text-5xl xl:text-6xl font-black text-stone-50 tracking-tight leading-[1.1] mb-6">
                The <span className="italic text-amber-400">Nostimo</span>
                <br />Story
              </h1>
              <p className="text-stone-400 text-base sm:text-lg leading-relaxed max-w-lg mb-8">
                Berawal dari passion sederhana: membuat donat yang benar-benar spesial. Bukan sekadar manis — tapi pengalaman rasa yang tidak terlupakan. Setiap gigitan bercerita tentang dedikasi, kreativitas, dan cinta.
              </p>
              <div className="flex items-center gap-4">
                <Link href="/menu"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/25"
                >
                  Lihat Menu
                  <ArrowRight size={16} />
                </Link>
                <div className="flex items-center gap-2 text-stone-500 text-sm">
                  <MapPin size={14} />
                  Jakarta Selatan
                </div>
              </div>
            </motion.div>

            {/* Image collage */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative order-1 lg:order-2"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-800">
                    <Image src="/donat1.png" alt="Matcha Remastered" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                  </div>
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-800">
                    <Image src="/donat4.png" alt="Double Choco Lava" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-800">
                    <Image src="/donat18.png" alt="Vanilla Popcorn Caramel" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                  </div>
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-800">
                    <Image src="/donat22.png" alt="Strawberry Crunch" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -left-4 sm:-left-6 bg-stone-900 border border-stone-800 rounded-2xl px-5 py-3 shadow-xl shadow-black/40"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <UtensilsCrossed size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-200">Handcrafted</p>
                    <p className="text-[10px] text-stone-500">Since 2019</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 56" fill="none" className="w-full h-auto">
            <path d="M0 56V28C240 0 480 0 720 28C960 56 1200 56 1440 28V56H0Z" fill="#FDFCFA" />
          </svg>
        </div>
      </section>

      {/* ─── Stats Bar ────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-2 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 p-6 md:p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {STATS.map(({ value, label, icon }, i) => (
              <motion.div
                key={label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto mb-3">
                  {icon}
                </div>
                <p className="text-2xl md:text-3xl font-black text-stone-900">{value}</p>
                <p className="text-xs text-stone-500 font-medium mt-1">{label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── Values ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 text-stone-600 text-xs font-semibold mb-4">
            <Sparkles size={12} />
            Kenapa Nostimo?
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight">
            Yang Membuat Kami <span className="italic text-amber-500">Berbeda</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {VALUES.map(({ icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group bg-white rounded-2xl border border-stone-100 p-6 md:p-8 transition-all duration-300 hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.08)] hover:-translate-y-1"
            >
              <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${color}`}>
                {icon}
              </div>
              <h3 className="text-lg font-black text-stone-900 mb-2">{title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Timeline ─────────────────────────────────────────────── */}
      <section className="bg-stone-950 py-20 md:py-28 relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />
        <div aria-hidden="true" className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-amber-500/6 blur-[140px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-4">
              <Clock size={12} />
              Our Journey
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-black text-stone-50 tracking-tight">
              Perjalanan <span className="italic text-amber-400">Kami</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Center line */}
            <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-stone-800" aria-hidden="true" />

            <div className="space-y-10 md:space-y-12">
              {MILESTONES.map(({ year, title, desc }, i) => (
                <motion.div
                  key={year}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-amber-500 border-4 border-stone-950 z-10 mt-1.5" />

                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <span className="text-amber-500 text-sm font-black">{year}</span>
                    <h3 className="text-lg font-black text-stone-50 mt-1">{title}</h3>
                    <p className="text-sm text-stone-400 leading-relaxed mt-2">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Behind the Scenes ────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 text-stone-600 text-xs font-semibold mb-4">
            <UtensilsCrossed size={12} />
            Behind the Scenes
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight">
            Dari Dapur <span className="italic text-amber-500">ke Hatimu</span>
          </h2>
          <p className="text-stone-500 text-sm sm:text-base mt-4 max-w-lg mx-auto leading-relaxed">
            Intip proses pembuatan donat artisan kami yang penuh cinta dan dedikasi.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { img: '/donat5.png',  label: 'Adonan Premium' },
            { img: '/donat6.png',  label: 'Handmade Glaze' },
            { img: '/donat7.png',  label: 'Artisan Topping' },
            { img: '/donat8.png',  label: 'Ready to Serve' },
          ].map(({ img, label }, i) => (
            <motion.div
              key={label}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden bg-stone-100"
            >
              <Image
                src={img}
                alt={label}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white text-sm font-bold">{label}</p>
                <p className="text-stone-300 text-[10px] uppercase tracking-widest font-semibold mt-0.5">Step {i + 1}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl overflow-hidden p-8 md:p-14 text-center"
        >
          <div aria-hidden="true" className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}
          />

          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="font-playfair text-3xl md:text-4xl font-black text-stone-950 tracking-tight mb-4">
              Siap Mencoba <span className="italic">Donat Terbaik</span> di Jakarta?
            </h2>
            <p className="text-stone-900/80 text-sm md:text-base leading-relaxed mb-8">
              Kunjungi menu kami dan temukan rasa favoritmu. Pesan sekarang dan rasakan bedanya.
            </p>
            <Link href="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-sm transition-all shadow-xl"
            >
              Jelajahi Menu
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
