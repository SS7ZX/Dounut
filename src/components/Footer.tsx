// src/components/Footer.tsx — NOSTIMO Premium Footer
// FIXES:
//   1. Export: "Footer" (bukan "SiteFooter")
//   2. Icons: Instagram/MessageCircle/Send diganti SVG inline — 100% safe
//   3. Semua lucide imports hanya: MapPin, Clock, Phone, Mail, Heart, ArrowUpRight, ChevronRight

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Mail, Heart, ArrowUpRight, ChevronRight } from 'lucide-react';

const YEAR = new Date().getFullYear();

const MENU_LINKS = [
  { label: 'Semua Donat',    href: '/menu'                    },
  { label: 'Promo Hari Ini', href: '/#promo'                  },
  { label: 'Paket Box',      href: '/#packages'               },
  { label: 'Best Seller',    href: '/menu?filter=best_seller' },
] as const;

const INFO_LINKS = [
  { label: 'Cara Order',           href: '/#how-to-order' },
  { label: 'Kebijakan Pengiriman', href: '/shipping'       },
  { label: 'FAQ',                  href: '/faq'            },
  { label: 'Tentang Kami',         href: '/about'          },
] as const;

// Inline SVG icons — tidak bergantung versi lucide-react
function IgIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function WaIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  );
}

function TkIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
    </svg>
  );
}

const SOCIAL = [
  { name: 'Instagram', handle: '@nostimo.jkt',       href: 'https://instagram.com',    Icon: IgIcon, hover: 'hover:text-pink-400 hover:border-pink-500/40'    },
  { name: 'WhatsApp',  handle: '+62 812-3456-7890',  href: 'https://wa.me/6281234567890', Icon: WaIcon, hover: 'hover:text-emerald-400 hover:border-emerald-500/40' },
  { name: 'TikTok',    handle: '@nostimo',            href: 'https://tiktok.com',       Icon: TkIcon, hover: 'hover:text-stone-300 hover:border-stone-500/40'   },
] as const;

// ── Newsletter form ──────────────────────────────────────────────────────────
function NewsletterInput() {
  const [email, setEmail] = useState('');
  const [sent, setSent]   = useState(false);
  const [focused, setFo]  = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
    setEmail('');
  };

  return (
    <div>
      <p className="text-[11px] font-bold text-stone-600 tracking-[0.2em] uppercase mb-3">
        Newsletter
      </p>
      <p className="text-sm text-stone-500 leading-relaxed mb-4">
        Dapat info promo &amp; flavor baru sebelum orang lain.
      </p>

      {sent ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 text-sm text-emerald-400 font-semibold"
        >
          <Heart size={13} className="text-emerald-400" fill="currentColor" />
          Terima kasih! Kamu sudah subscribe.
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className={`flex-1 flex items-center gap-2 px-3.5 py-2.5 bg-stone-800 rounded-xl border transition-all duration-200 ${focused ? 'border-amber-500/60' : 'border-stone-700'}`}>
            <Mail size={13} className="text-stone-600 flex-shrink-0" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFo(true)}
              onBlur={() => setFo(false)}
              placeholder="email@kamu.com"
              className="flex-1 bg-transparent text-sm text-stone-200 placeholder:text-stone-600 outline-none min-w-0"
            />
          </div>
          <button
            type="submit"
            disabled={!email.trim()}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-stone-700 disabled:cursor-not-allowed text-stone-950 font-bold text-xs transition-all duration-150 active:scale-95 flex-shrink-0"
          >
            Join
          </button>
        </form>
      )}
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer className="bg-stone-950 border-t border-stone-900">

      {/* Amber accent bar */}
      <div
        aria-hidden="true"
        className="h-[3px]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.55), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="py-14 lg:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.4fr] gap-10 lg:gap-12">

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="group inline-block w-fit">
              <p className="font-playfair text-3xl font-black italic text-stone-50 leading-none group-hover:text-amber-400 transition-colors duration-200">
                Nostimo
              </p>
              <p className="text-[10px] text-stone-700 tracking-[0.35em] uppercase font-semibold mt-1.5">
                Artisan Donut Jakarta
              </p>
            </Link>

            <p className="text-sm text-stone-500 leading-relaxed max-w-[260px]">
              Setiap donat dibuat dengan tangan setiap pagi. Bahan pilihan,
              rasa yang tidak pernah kompromi.
            </p>

            <div className="flex items-center gap-2">
              <div className="w-8 h-[2px] rounded-full bg-amber-500" />
              <div className="w-4 h-[2px] rounded-full bg-stone-700" />
              <div className="w-2 h-[2px] rounded-full bg-stone-800" />
            </div>

            {/* Social */}
            <div className="flex flex-col gap-2">
              {SOCIAL.map(({ name, handle, href, Icon, hover }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-stone-800 text-stone-500 transition-all duration-150 w-fit ${hover}`}
                >
                  <Icon />
                  <span className="text-xs font-medium">{handle}</span>
                  <ArrowUpRight size={11} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Menu + Info */}
          <div>
            <p className="text-[11px] font-bold text-stone-600 tracking-[0.2em] uppercase mb-5">Menu</p>
            <ul className="flex flex-col gap-3 mb-6">
              {MENU_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="group flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-200 transition-colors duration-150">
                    <ChevronRight size={12} className="text-stone-700 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="h-[1px] bg-stone-900 mb-6" />

            <p className="text-[11px] font-bold text-stone-600 tracking-[0.2em] uppercase mb-5">Info</p>
            <ul className="flex flex-col gap-3">
              {INFO_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="group flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-200 transition-colors duration-150">
                    <ChevronRight size={12} className="text-stone-700 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Kontak */}
          <div>
            <p className="text-[11px] font-bold text-stone-600 tracking-[0.2em] uppercase mb-5">Kontak</p>

            <div className="flex flex-col gap-4">
              {/* WA */}
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-emerald-700 transition-colors">
                  <Phone size={12} className="text-stone-600 group-hover:text-emerald-400 transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] text-stone-600 mb-0.5">WhatsApp</p>
                  <p className="text-sm text-stone-400 font-medium group-hover:text-stone-200 transition-colors">+62 812-3456-7890</p>
                </div>
              </a>

              {/* Email */}
              <a href="mailto:hello@nostimo.id" className="group flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-amber-700 transition-colors">
                  <Mail size={12} className="text-stone-600 group-hover:text-amber-400 transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] text-stone-600 mb-0.5">Email</p>
                  <p className="text-sm text-stone-400 font-medium group-hover:text-stone-200 transition-colors">hello@nostimo.id</p>
                </div>
              </a>

              {/* Lokasi */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={12} className="text-stone-600" />
                </div>
                <div>
                  <p className="text-[10px] text-stone-600 mb-0.5">Lokasi</p>
                  <p className="text-sm text-stone-400 leading-relaxed">Jakarta Selatan,<br />DKI Jakarta</p>
                </div>
              </div>

              {/* Jam */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock size={12} className="text-stone-600" />
                </div>
                <div>
                  <p className="text-[10px] text-stone-600 mb-1.5">Jam Buka</p>
                  <div className="space-y-1">
                    <div className="flex justify-between gap-6">
                      <span className="text-xs text-stone-500">Sen – Jum</span>
                      <span className="text-xs text-stone-400 font-medium">08.00 – 21.00</span>
                    </div>
                    <div className="flex justify-between gap-6">
                      <span className="text-xs text-stone-500">Sab – Min</span>
                      <span className="text-xs text-stone-400 font-medium">08.00 – 22.00</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-[10px] text-emerald-500 font-semibold">Buka sekarang</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4 — Newsletter */}
          <div>
            <NewsletterInput />
            <div className="mt-8 space-y-2.5">
              {['🍩 Dibuat fresh setiap pagi','📦 Packaging premium & aman','⚡ Konfirmasi order via WhatsApp','🔒 Pembayaran aman & terenkripsi'].map((t) => (
                <p key={t} className="text-xs text-stone-600">{t}</p>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-900">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-stone-700">
            <span>© {YEAR} Nostimo.</span>
            <span>·</span>
            <span>Dibuat dengan</span>
            <Heart size={10} className="text-rose-600" fill="currentColor" />
            <span>di Jakarta</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-stone-700 hover:text-stone-500 transition-colors">Privasi</Link>
            <Link href="/terms"   className="text-xs text-stone-700 hover:text-stone-500 transition-colors">Syarat &amp; Ketentuan</Link>
          </div>
          <p className="text-xs text-stone-800">
            Powered by <span className="text-stone-700 font-semibold">Vercel</span> · <span className="text-stone-700 font-semibold">Next.js 16</span>
          </p>
        </div>
      </div>
    </footer>
  );
}