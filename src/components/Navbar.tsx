// src/components/storefront/Navbar.tsx — NOSTIMO Navbar

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, Menu, X, User, LogOut, ChevronDown, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useAuth }      from '@/hooks/useAuth';

const NAV_LINKS = [
  { label: 'Menu',  href: '/menu'  },
  { label: 'Promo', href: '/#promo'},
  { label: 'About', href: '/#about'},
] as const;

export function Navbar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted]       = useState(false);

  const cart    = useCartStore((s) => s.cart);
  const { profile, isLoggedIn, signOut, loading } = useAuth();

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close mobile on route change
  useEffect(() => setMobileOpen(false), [pathname]);

  const handleSignOut = async () => {
    await signOut();
    setProfileOpen(false);
    router.push('/');
  };

  return (
    <>
      <header
        className={`
          fixed top-0 inset-x-0 z-50 transition-all duration-300
          ${scrolled
            ? 'bg-stone-950/95 backdrop-blur-md border-b border-stone-800/50 shadow-lg shadow-black/20'
            : 'bg-transparent'}
        `}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="
              text-xl font-playfair font-black italic
              text-stone-50
              group-hover:text-amber-400 transition-colors duration-200
            ">
              Nostimo
            </span>
            <span className="
              hidden sm:block text-[10px] text-stone-600
              font-semibold tracking-widest uppercase
              group-hover:text-stone-500 transition-colors
            ">
              Artisan
            </span>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150
                    ${pathname === href
                      ? 'text-amber-400 bg-amber-500/10'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'}
                  `}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-2">

            {/* Cart button */}
            <Link
              href="/cart"
              aria-label={`Keranjang, ${totalItems} item`}
              className="
                relative p-2.5 rounded-xl text-stone-400 hover:text-stone-200
                hover:bg-stone-800/60 transition-all duration-150
              "
            >
              <ShoppingBag size={20} />
              {mounted && totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="
                    absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full
                    bg-amber-500 text-stone-950 text-[10px] font-black
                    flex items-center justify-center
                  "
                  suppressHydrationWarning
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </motion.span>
              )}
            </Link>

            {/* Auth section */}
            {!loading && mounted && (
              <>
                {isLoggedIn && profile ? (
                  /* Logged in — profile dropdown */
                  <div className="relative hidden md:block">
                    <button
                      onClick={() => setProfileOpen((o) => !o)}
                      className="
                        flex items-center gap-2 px-3 py-2 rounded-xl
                        text-stone-400 hover:text-stone-200 hover:bg-stone-800/60
                        transition-all duration-150 text-sm
                      "
                    >
                      <div className="
                        w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40
                        flex items-center justify-center text-amber-400 text-xs font-bold
                      ">
                        {profile.full_name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium max-w-[100px] truncate">
                        {profile.full_name.split(' ')[0]}
                      </span>
                      <ChevronDown size={14} className={`transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 4, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className="
                            absolute right-0 top-full mt-2 w-52
                            bg-stone-900 border border-stone-800
                            rounded-2xl shadow-2xl shadow-black/50 overflow-hidden
                          "
                        >
                          <div className="px-4 py-3 border-b border-stone-800">
                            <p className="text-sm font-semibold text-stone-200">{profile.full_name}</p>
                            <p className="text-xs text-stone-500 mt-0.5 truncate">{profile.whatsapp ?? '–'}</p>
                          </div>
                          <div className="p-1.5">
                            <Link href="/orders"
                              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-stone-300 hover:bg-stone-800 hover:text-stone-100 transition-colors"
                              onClick={() => setProfileOpen(false)}
                            >
                              <Package size={15} />
                              Riwayat Pesanan
                            </Link>
                            <button
                              onClick={handleSignOut}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-rose-400 hover:bg-rose-950/50 transition-colors"
                            >
                              <LogOut size={15} />
                              Keluar
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  /* Not logged in */
                  <div className="hidden md:flex items-center gap-2">
                    <Link href="/login"
                      className="px-4 py-2 text-sm font-medium text-stone-400 hover:text-stone-200 transition-colors"
                    >
                      Masuk
                    </Link>
                    <Link href="/register"
                      className="
                        px-4 py-2 rounded-xl text-sm font-bold
                        bg-amber-500 hover:bg-amber-400 active:bg-amber-600
                        text-stone-950 transition-all duration-150
                      "
                    >
                      Daftar
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              className="
                md:hidden p-2.5 rounded-xl text-stone-400 hover:text-stone-200
                hover:bg-stone-800/60 transition-all
              "
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="
              fixed inset-x-0 top-16 z-40 md:hidden
              bg-stone-950/98 backdrop-blur-md
              border-b border-stone-800
              shadow-xl shadow-black/30
            "
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                <Link key={label} href={href}
                  className="px-4 py-3 rounded-xl text-stone-300 hover:bg-stone-800 hover:text-stone-100 font-medium text-sm transition-colors"
                >
                  {label}
                </Link>
              ))}

              <div className="mt-2 pt-3 border-t border-stone-800 flex flex-col gap-2">
                {isLoggedIn ? (
                  <>
                    <Link href="/orders"
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-stone-300 hover:bg-stone-800 text-sm font-medium transition-colors"
                    >
                      <Package size={16} />
                      Riwayat Pesanan
                    </Link>
                    <button onClick={handleSignOut}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-950/40 text-sm font-medium transition-colors"
                    >
                      <LogOut size={16} />
                      Keluar
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login"
                      className="px-4 py-3 rounded-xl text-stone-300 hover:bg-stone-800 text-sm font-medium text-center transition-colors"
                    >
                      Masuk
                    </Link>
                    <Link href="/register"
                      className="px-4 py-3 rounded-xl bg-amber-500 text-stone-950 text-sm font-bold text-center transition-colors"
                    >
                      Daftar Sekarang
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for dropdown close */}
      {profileOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
      )}

      {/* Spacer */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
}