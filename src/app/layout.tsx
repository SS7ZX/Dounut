// src/app/layout.tsx — NOSTIMO Root Layout

import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

// 1. TAMBAHKAN IMPORT INI DI BAWAH globals.css
import AuthProvider from '@/components/AuthProvider'; 

// Playfair Display — untuk semua heading artisan italic
const playfair = Playfair_Display({
  subsets:  ['latin'],
  weight:   ['700', '900'],
  style:    ['normal', 'italic'],
  variable: '--font-playfair',   // → dipakai via class .font-playfair
  display:  'swap',
});

// Plus Jakarta Sans — untuk body text & UI
const jakarta = Plus_Jakarta_Sans({
  subsets:  ['latin'],
  weight:   ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',    // → dipakai via class .font-jakarta
  display:  'swap',
});

export const metadata: Metadata = {
  title: {
    default:  'Nostimo — Artisan Donut Jakarta',
    template: '%s | Nostimo',
  },
  description:
    'Artisan donuts handcrafted daily. Premium ingredients, unforgettable flavors. Jakarta Selatan.',
  keywords: ['donut', 'artisan', 'jakarta', 'nostimo', 'bakery'],
  openGraph: {
    title:       'Nostimo — Artisan Donut Jakarta',
    description: 'Handcrafted premium donuts. Order now.',
    type:        'website',
    locale:      'id_ID',
  },
};

export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  themeColor:   '#0c0a09',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${playfair.variable} ${jakarta.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        {/* 2. BUNGKUS CHILDREN DENGAN AUTHPROVIDER */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}