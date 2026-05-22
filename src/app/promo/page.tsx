/* ==========================================================================
 * src/app/promo/page.tsx — NOSTIMO Promo Page
 * Exclusive offers, bundle deals, and seasonal promotions.
 * ========================================================================== */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Gift, Zap, Clock, ArrowRight, Tag,
  Percent, Star, ChevronDown, ChevronUp, PartyPopper,
  ShoppingBag, Crown, Flame, Calendar, CheckCircle2,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

// ── Types ────────────────────────────────────────────────────────────────────
type Promo = {
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  badge: string;
  badgeColor: string;
  discount: string;
  validUntil: string;
  terms: string[];
  img: string;
  accent: string;
  icon: React.ReactNode;
};

// ── Promos Data ──────────────────────────────────────────────────────────────
const PROMOS: Promo[] = [
  {
    id: 1,
    title: 'Buy 1 Get 1 Free',
    subtitle: 'Promo Spesial Bulan Ini',
    desc: 'Beli satu donat, gratis satu lagi! Berlaku untuk semua varian rasa premium kami. Nikmati kelezatan berlipat ganda.',
    badge: 'HOT DEAL',
    badgeColor: 'bg-rose-500 text-white',
    discount: 'BOGO',
    validUntil: '31 Mei 2026',
    terms: [
      'Berlaku untuk semua varian donat',
      'Gratis untuk donat dengan harga sama atau lebih rendah',
      'Tidak bisa digabung dengan promo lain',
      'Berlaku di toko dan delivery',
    ],
    img: '/donat1.png',
    accent: 'from-rose-500/20 to-orange-500/20',
    icon: <Gift size={20} />,
  },
  {
    id: 2,
    title: 'Paket Box 6 — Hemat 25%',
    subtitle: 'Bundle Deal',
    desc: 'Pilih 6 donat favoritmu dalam satu box premium dan hemat 25%. Cocok untuk sharing, hadiah, atau hanya memanjakan diri.',
    badge: 'BEST VALUE',
    badgeColor: 'bg-amber-500 text-stone-950',
    discount: '-25%',
    validUntil: '30 Juni 2026',
    terms: [
      'Pilih 6 varian donat apapun',
      'Termasuk box premium gratis',
      'Discount dihitung dari total harga satuan',
      'Berlaku setiap hari',
    ],
    img: '/donat4.png',
    accent: 'from-amber-500/20 to-yellow-500/20',
    icon: <ShoppingBag size={20} />,
  },
  {
    id: 3,
    title: 'Paket Box 12 — Hemat 35%',
    subtitle: 'Party Package',
    desc: 'Ideal untuk arisan, kantor, atau acara spesial. 12 donat artisan dalam box eksklusif dengan hemat 35% dari harga normal.',
    badge: 'PARTY DEAL',
    badgeColor: 'bg-purple-500 text-white',
    discount: '-35%',
    validUntil: '30 Juni 2026',
    terms: [
      'Pilih 12 varian donat apapun',
      'Termasuk box premium jumbo gratis',
      'Free greeting card',
      'Berlaku setiap hari, pre-order H-1',
    ],
    img: '/donat18.png',
    accent: 'from-purple-500/20 to-pink-500/20',
    icon: <PartyPopper size={20} />,
  },
  {
    id: 4,
    title: 'Weekend Matcha Mania',
    subtitle: 'Setiap Sabtu & Minggu',
    desc: 'Semua varian Matcha diskon 20% setiap weekend! Dari Matcha Remastered hingga Matcha Coconut Bliss.',
    badge: 'WEEKEND ONLY',
    badgeColor: 'bg-emerald-500 text-white',
    discount: '-20%',
    validUntil: 'Setiap Weekend',
    terms: [
      'Berlaku hanya Sabtu & Minggu',
      'Diskon untuk semua varian Matcha',
      'Bisa digabung dengan member points',
      'Dine-in dan delivery',
    ],
    img: '/donat24.png',
    accent: 'from-emerald-500/20 to-teal-500/20',
    icon: <Crown size={20} />,
  },
  {
    id: 5,
    title: 'First Order Discount 15%',
    subtitle: 'Khusus Member Baru',
    desc: 'Daftar sebagai member Nostimo dan dapatkan diskon 15% untuk pesanan pertamamu. Gratis, tanpa syarat ribet!',
    badge: 'NEW MEMBER',
    badgeColor: 'bg-blue-500 text-white',
    discount: '-15%',
    validUntil: 'Selalu berlaku',
    terms: [
      'Khusus pengguna baru yang baru mendaftar',
      'Berlaku untuk seluruh menu',
      'Minimum order 2 donat',
      'Tidak bisa digabung dengan promo lain',
    ],
    img: '/donat22.png',
    accent: 'from-blue-500/20 to-indigo-500/20',
    icon: <Zap size={20} />,
  },
  {
    id: 6,
    title: 'Happy Hour: 16.00 – 18.00',
    subtitle: 'Setiap Hari Kerja',
    desc: 'Donat + minuman mulai dari Rp 20.000 saja! Waktu yang pas untuk nge-donat bareng teman setelah seharian bekerja.',
    badge: 'DAILY',
    badgeColor: 'bg-orange-500 text-white',
    discount: 'Rp 20K',
    validUntil: 'Setiap hari kerja',
    terms: [
      'Senin – Jumat, jam 16.00 – 18.00 WIB',
      'Paket: 1 donat + 1 minuman pilihan',
      'Dine-in only',
      'Selama persediaan masih ada',
    ],
    img: '/donat6.png',
    accent: 'from-orange-500/20 to-red-500/20',
    icon: <Clock size={20} />,
  },
];

const PERKS = [
  { icon: <Tag size={20} />,      title: 'Diskon Member',        desc: 'Akses promo eksklusif dan diskon khusus member.' },
  { icon: <Star size={20} />,     title: 'Points Reward',        desc: 'Kumpulkan poin setiap pembelian, tukar dengan donat gratis.' },
  { icon: <Gift size={20} />,     title: 'Birthday Special',     desc: 'Gratis 1 box donat di hari ulang tahunmu.' },
  { icon: <Flame size={20} />,    title: 'Early Access',         desc: 'Coba varian baru sebelum siapapun.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (d: number) => ({
    opacity: 1, y: 0,
    transition: { delay: d * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

// ── Expandable Terms Component ───────────────────────────────────────────────
function TermsAccordion({ terms }: { terms: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-700 transition-colors"
      >
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        Syarat & Ketentuan
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden mt-2 space-y-1.5"
          >
            {terms.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-stone-500 leading-relaxed">
                <CheckCircle2 size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                {t}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function PromoPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Navbar />

      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="relative bg-stone-950 overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />
        <div aria-hidden="true" className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full bg-rose-500/8 blur-[180px]" />
        <div aria-hidden="true" className="absolute bottom-0 right-1/3 w-[500px] h-[500px] rounded-full bg-amber-500/8 blur-[160px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16 md:pt-28 md:pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block mb-6"
            >
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold">
                <Percent size={14} />
                Exclusive Offers
              </span>
            </motion.div>

            <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black text-stone-50 tracking-tight leading-[1.05]">
              Promo &
              <br />
              <span className="italic text-amber-400">Penawaran</span>
              <br />
              Spesial
            </h1>
            <p className="text-stone-400 text-base sm:text-lg mt-5 max-w-lg mx-auto leading-relaxed">
              Jangan lewatkan penawaran eksklusif dari Nostimo. Hemat lebih banyak, nikmati lebih banyak!
            </p>
          </motion.div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 56" fill="none" className="w-full h-auto">
            <path d="M0 56V28C240 0 480 0 720 28C960 56 1200 56 1440 28V56H0Z" fill="#FDFCFA" />
          </svg>
        </div>
      </section>

      {/* ─── Featured Promo (First card large) ────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-2 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-white rounded-3xl shadow-xl shadow-stone-200/60 border border-stone-100 overflow-hidden"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${PROMOS[0].accent} opacity-50`} />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
            {/* Text */}
            <div className="flex flex-col justify-center">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black w-fit mb-4 ${PROMOS[0].badgeColor}`}>
                <Flame size={11} />
                {PROMOS[0].badge}
              </span>
              <h2 className="font-playfair text-3xl md:text-4xl font-black text-stone-900 tracking-tight mb-2">
                {PROMOS[0].title}
              </h2>
              <p className="text-sm text-amber-600 font-bold uppercase tracking-wider mb-3">{PROMOS[0].subtitle}</p>
              <p className="text-sm text-stone-500 leading-relaxed mb-6 max-w-md">{PROMOS[0].desc}</p>

              <div className="flex items-center gap-4 mb-4">
                <div className="bg-stone-950 text-amber-400 px-4 py-2 rounded-xl text-xl font-black">{PROMOS[0].discount}</div>
                <div className="text-xs text-stone-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    Berlaku s/d {PROMOS[0].validUntil}
                  </div>
                </div>
              </div>

              <Link href="/menu"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-sm transition-all shadow-lg w-fit"
              >
                Klaim Sekarang
                <ArrowRight size={16} />
              </Link>

              <TermsAccordion terms={PROMOS[0].terms} />
            </div>

            {/* Image */}
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{ rotate: [0, 3, -3, 0], y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-64 h-64 md:w-80 md:h-80"
              >
                <Image
                  src={PROMOS[0].img}
                  alt={PROMOS[0].title}
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="320px"
                  priority
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── Other Promos Grid ────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-playfair text-3xl md:text-4xl font-black text-stone-900 tracking-tight">
            Semua <span className="italic text-amber-500">Penawaran</span>
          </h2>
          <p className="text-stone-500 text-sm mt-3 max-w-md mx-auto">
            Pilih promo yang cocok buat kamu dan hemat lebih banyak!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {PROMOS.slice(1).map((promo, i) => (
            <motion.div
              key={promo.id}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group flex flex-col bg-white rounded-2xl border border-stone-100 overflow-hidden transition-all duration-300 hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.1)] hover:-translate-y-1"
            >
              {/* Card top — image + badge */}
              <div className={`relative bg-gradient-to-br ${promo.accent} p-6 pb-0 overflow-hidden`}>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black ${promo.badgeColor}`}>
                  {promo.icon}
                  {promo.badge}
                </span>

                <div className="relative w-full h-36 md:h-44 mt-4">
                  <Image
                    src={promo.img}
                    alt={promo.title}
                    fill
                    className="object-contain drop-shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {/* Discount bubble */}
                <div className="absolute top-4 right-4 bg-stone-950 text-amber-400 px-3 py-1.5 rounded-xl text-sm font-black shadow-lg">
                  {promo.discount}
                </div>
              </div>

              {/* Card body */}
              <div className="flex flex-col flex-grow p-5">
                <h3 className="text-base md:text-lg font-black text-stone-900 leading-tight mb-1">
                  {promo.title}
                </h3>
                <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mb-2">{promo.subtitle}</p>
                <p className="text-xs text-stone-500 leading-relaxed mb-4 line-clamp-3">{promo.desc}</p>

                <div className="mt-auto">
                  <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-4">
                    <Calendar size={12} />
                    s/d {promo.validUntil}
                  </div>

                  <Link href="/menu"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-stone-100 hover:bg-stone-900 text-stone-700 hover:text-white font-bold text-xs transition-all duration-200"
                  >
                    Klaim Promo
                    <ArrowRight size={14} />
                  </Link>

                  <TermsAccordion terms={promo.terms} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Membership Perks ─────────────────────────────────────── */}
      <section className="bg-stone-950 py-20 md:py-28 relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />
        <div aria-hidden="true" className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full bg-amber-500/8 blur-[160px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-4">
              <Crown size={12} />
              Nostimo Member
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-black text-stone-50 tracking-tight">
              Gabung & Dapatkan <span className="italic text-amber-400">Lebih</span>
            </h2>
            <p className="text-stone-400 text-sm sm:text-base mt-4 max-w-lg mx-auto leading-relaxed">
              Daftar gratis sebagai member Nostimo dan nikmati keuntungan eksklusif yang tidak bisa kamu dapatkan di tempat lain.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 mb-12">
            {PERKS.map(({ icon, title, desc }, i) => (
              <motion.div
                key={title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group bg-stone-900 border border-stone-800 rounded-2xl p-6 flex items-start gap-4 transition-all duration-300 hover:border-amber-500/30 hover:bg-stone-900/80"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-110 transition-transform">
                  {icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-100 mb-1">{title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/25"
            >
              Daftar Gratis Sekarang
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Newsletter CTA ───────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl overflow-hidden p-8 md:p-14 text-center"
        >
          <div aria-hidden="true" className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}
          />

          <div className="relative z-10 max-w-xl mx-auto">
            <PartyPopper size={40} className="text-stone-950/60 mx-auto mb-4" />
            <h2 className="font-playfair text-3xl md:text-4xl font-black text-stone-950 tracking-tight mb-4">
              Jangan Ketinggalan <span className="italic">Promo!</span>
            </h2>
            <p className="text-stone-900/80 text-sm md:text-base leading-relaxed mb-8">
              Subscribe newsletter kami dan dapatkan info promo, diskon member, serta peluncuran rasa baru langsung ke inbox-mu.
            </p>
            <Link href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-sm transition-all shadow-xl"
            >
              Subscribe Sekarang
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
