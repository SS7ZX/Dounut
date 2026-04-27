// src/app/layout.tsx — NOSTIMO Root Layout

import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import '../globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title:       { default: 'Nostimo — Artisan Donut Jakarta', template: '%s | Nostimo' },
  description: 'Artisan donuts handcrafted daily. Premium ingredients, unforgettable flavors. Jakarta Selatan.',
  keywords:    ['donut', 'artisan', 'jakarta', 'nostimo', 'bakery'],
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${playfair.variable} ${jakarta.variable} font-jakarta antialiased`}>
        {children}
      </body>
    </html>
  );
}