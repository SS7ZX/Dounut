// src/lib/utils.ts — NOSTIMO Utilities
// FIXED: Added `cn` export required by shadcn/ui components (button.tsx, card.tsx, etc.)

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { CustomerDetails, CheckoutFormErrors } from '@/types';

// ---------------------------------------------------------------------------
// cn — required by ALL shadcn/ui components
// Install deps if not present: npm install clsx tailwind-merge
// ---------------------------------------------------------------------------
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------
// Format Rupiah
// ---------------------------------------------------------------------------
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style:                 'currency',
    currency:              'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ---------------------------------------------------------------------------
// Format date Indonesian
// ---------------------------------------------------------------------------
export function formatDate(iso: string): string {
  return (
    new Intl.DateTimeFormat('id-ID', {
      day:      'numeric',
      month:    'long',
      year:     'numeric',
      hour:     '2-digit',
      minute:   '2-digit',
      timeZone: 'Asia/Jakarta',
    }).format(new Date(iso)) + ' WIB'
  );
}

// ---------------------------------------------------------------------------
// Format WA number for wa.me link
// ---------------------------------------------------------------------------
export function formatWaLink(raw: string): string {
  const clean = raw.trim().replace(/[\s\-\(\)]/g, '');
  if (clean.startsWith('0'))  return '+62' + clean.slice(1);
  if (clean.startsWith('62')) return '+' + clean;
  return clean;
}

// ---------------------------------------------------------------------------
// Order summary calculation
// ---------------------------------------------------------------------------
export function calcSummary(items: { price: number; quantity: number }[]) {
  const subtotal    = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax_amount  = Math.round(subtotal * 0.11);
  const grand_total = subtotal + tax_amount;
  return { subtotal, tax_amount, grand_total };
}

// ---------------------------------------------------------------------------
// Form validation
// ---------------------------------------------------------------------------
const WA_RE = /^(\+62|62|0)[0-9]{8,13}$/;

export function validateCheckout(v: CustomerDetails): CheckoutFormErrors {
  const e: CheckoutFormErrors = {};

  const name = v.name.trim();
  if (!name)             e.name = 'Nama tidak boleh kosong.';
  else if (name.length < 2) e.name = 'Nama minimal 2 karakter.';

  const wa = v.whatsapp.trim().replace(/[\s\-]/g, '');
  if (!wa)                e.whatsapp = 'Nomor WA tidak boleh kosong.';
  else if (!WA_RE.test(wa)) e.whatsapp = 'Format tidak valid. Contoh: 08123456789';

  const addr = v.address.trim();
  if (!addr)              e.address = 'Alamat tidak boleh kosong.';
  else if (addr.length < 10) e.address = 'Alamat terlalu singkat.';

  return e;
}

export function isValid(e: CheckoutFormErrors): boolean {
  return Object.keys(e).length === 0;
}

// ---------------------------------------------------------------------------
// Truncate text
// ---------------------------------------------------------------------------
export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

// ---------------------------------------------------------------------------
// Badge config
// ---------------------------------------------------------------------------
export const BADGE_CONFIG = {
  best_seller: { label: 'Best Seller', bg: 'bg-amber-500',   text: 'text-stone-950' },
  new:         { label: 'New',         bg: 'bg-emerald-500', text: 'text-white'     },
  limited:     { label: 'Limited',     bg: 'bg-rose-500',    text: 'text-white'     },
  sold_out:    { label: 'Sold Out',    bg: 'bg-stone-600',   text: 'text-stone-200' },
} as const;

// ---------------------------------------------------------------------------
// Order status config
// ---------------------------------------------------------------------------
export const STATUS_CONFIG = {
  pending:    { label: 'Menunggu',     color: 'text-amber-400',   bg: 'bg-amber-950/50 border-amber-900'     },
  confirmed:  { label: 'Dikonfirmasi', color: 'text-blue-400',    bg: 'bg-blue-950/50 border-blue-900'       },
  processing: { label: 'Diproses',     color: 'text-purple-400',  bg: 'bg-purple-950/50 border-purple-900'   },
  ready:      { label: 'Siap Kirim',   color: 'text-teal-400',    bg: 'bg-teal-950/50 border-teal-900'       },
  delivered:  { label: 'Terkirim',     color: 'text-emerald-400', bg: 'bg-emerald-950/50 border-emerald-900' },
  cancelled:  { label: 'Dibatalkan',   color: 'text-rose-400',    bg: 'bg-rose-950/50 border-rose-900'       },
} as const;

export const STATUS_FLOW: Record<string, string | null> = {
  pending:    'confirmed',
  confirmed:  'processing',
  processing: 'ready',
  ready:      'delivered',
  delivered:  null,
  cancelled:  null,
};