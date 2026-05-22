// src/app/admin/layout.tsx
// Premium admin shell — sidebar desktop, bottom nav mobile
// Auth guard: redirect to /admin/login if not admin

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingBag,
  Radio, Settings, LogOut, Menu, X,
  ChevronRight, Bell, Loader2,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const NAV = [
  { label: 'Dashboard',  href: '/admin/dashboard',  icon: LayoutDashboard },
  { label: 'Produk',     href: '/admin/products',   icon: Package         },
  { label: 'Pesanan',    href: '/admin/orders',     icon: ShoppingBag     },
  { label: 'Live Queue', href: '/admin/live-queue', icon: Radio           },
  { label: 'Pengaturan', href: '/admin/settings',   icon: Settings        },
] as const;

function NavItem({ label, href, icon: Icon, active, onClick }: {
  label: string; href: string; icon: React.ElementType;
  active: boolean; onClick?: () => void;
}) {
  return (
    <Link href={href} onClick={onClick}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-150 group
        ${active
          ? 'bg-amber-500/12 text-amber-400 border border-amber-500/20'
          : 'text-stone-500 hover:bg-stone-800/60 hover:text-stone-300'}
      `}
    >
      <Icon size={16} className={active ? 'text-amber-400' : 'text-stone-600 group-hover:text-stone-400'} />
      <span className="flex-1">{label}</span>
      {active && <ChevronRight size={12} className="text-amber-500/60" />}
    </Link>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [sidebarOpen, setSidebar] = useState(false);
  const [mounted, setMounted]     = useState(false);

  const { profile, loading, isAdmin, signOut } = useAuth();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!loading && mounted) {
      if (!profile) {
        router.replace('/admin/login');
      } else if (!isAdmin) {
        router.replace('/admin/login?error=not_admin');
      }
    }
  }, [loading, mounted, profile, isAdmin, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin/login');
  };

  // ── Loading / auth guard ──
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="text-amber-500 animate-spin" />
          <p className="text-xs text-stone-600 font-medium">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  if (!profile || !isAdmin) return null;

  const initials = profile.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="flex h-screen bg-stone-950 overflow-hidden">

      {/* ═══════════════════════════════════════
          DESKTOP SIDEBAR
      ═══════════════════════════════════════ */}
      <aside className="hidden md:flex flex-col w-60 border-r border-stone-900 shrink-0">

        {/* Logo */}
        <div className="h-14 flex items-center gap-3 px-5 border-b border-stone-900 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
            <span className="text-stone-950 font-black text-xs">N</span>
          </div>
          <div>
            <p className="font-playfair text-sm font-black italic text-stone-50 leading-none">Nostimo</p>
            <p className="text-[9px] text-stone-600 font-semibold tracking-wider uppercase">Admin</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV.map(({ label, href, icon }) => (
            <NavItem key={href} label={label} href={href} icon={icon} active={pathname.startsWith(href)} />
          ))}
        </nav>

        {/* User profile */}
        <div className="p-3 border-t border-stone-900 shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-black shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-stone-200 truncate leading-tight">{profile.full_name}</p>
              <p className="text-[10px] text-stone-600">Administrator</p>
            </div>
            <button onClick={handleSignOut} aria-label="Keluar"
              className="text-stone-700 hover:text-rose-400 transition-colors p-1"
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      {/* ═══════════════════════════════════════
          MOBILE SIDEBAR OVERLAY
      ═══════════════════════════════════════ */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40 md:hidden"
              onClick={() => setSidebar(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-stone-950 border-r border-stone-900 md:hidden"
            >
              {/* Mobile header */}
              <div className="h-14 flex items-center justify-between px-4 border-b border-stone-900">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center">
                    <span className="text-stone-950 font-black text-xs">N</span>
                  </div>
                  <p className="font-playfair text-sm font-black italic text-stone-50">Nostimo Admin</p>
                </div>
                <button onClick={() => setSidebar(false)} className="text-stone-600 hover:text-stone-400 p-1">
                  <X size={18} />
                </button>
              </div>

              {/* Mobile nav */}
              <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
                {NAV.map(({ label, href, icon }) => (
                  <NavItem key={href} label={label} href={href} icon={icon}
                    active={pathname.startsWith(href)}
                    onClick={() => setSidebar(false)}
                  />
                ))}
              </nav>

              {/* Mobile user */}
              <div className="p-3 border-t border-stone-900">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-900 border border-stone-800">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-black shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-stone-200 truncate">{profile.full_name}</p>
                    <p className="text-[10px] text-stone-600">Administrator</p>
                  </div>
                  <button onClick={handleSignOut} className="text-stone-600 hover:text-rose-400 transition-colors p-1">
                    <LogOut size={14} />
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════
          MAIN CONTENT AREA
      ═══════════════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-4 sm:px-5 border-b border-stone-900 bg-stone-950 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button onClick={() => setSidebar(true)} aria-label="Buka menu"
              className="md:hidden p-2 rounded-lg text-stone-500 hover:text-stone-300 hover:bg-stone-800 transition-colors"
            >
              <Menu size={18} />
            </button>

            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-600">
              <span>Admin</span>
              <ChevronRight size={12} />
              <span className="text-stone-300 font-semibold capitalize">
                {pathname.split('/').filter(Boolean).pop()?.replace('-', ' ')}
              </span>
            </div>

            {/* Mobile title */}
            <p className="sm:hidden text-sm font-bold text-stone-200 capitalize">
              {pathname.split('/').filter(Boolean).pop()?.replace('-', ' ')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <button className="relative p-2 rounded-lg text-stone-500 hover:text-stone-300 hover:bg-stone-800 transition-colors">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full" />
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-black">
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-stone-950">
          {children}
        </main>

        {/* ═══════════════════════════════════════
            MOBILE BOTTOM NAV
        ═══════════════════════════════════════ */}
        <nav className="md:hidden border-t border-stone-900 bg-stone-950 shrink-0">
          <div className="flex items-center justify-around px-2 py-2">
            {NAV.slice(0, 4).map(({ label, href, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link key={href} href={href}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                    active ? 'text-amber-400' : 'text-stone-600 hover:text-stone-400'
                  }`}
                >
                  <Icon size={19} />
                  <span className="text-[9px] font-semibold">{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}