/* ==========================================================================
 * src/components/ProductGrid.tsx
 * PREMIUM RESPONSIVE PRODUCT CATALOG (UPGRADED)
 * Fitur: Functional Filtering, Mobile 2-Column Grid, Next/Image Optimization
 * ========================================================================== */

'use client'; // Wajib ditambahkan karena kita menggunakan state (useState) untuk filter

import { useState } from 'react';
import Image from 'next/image';
import { Star, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Strictly type our Product structure.
type ProductCategory = 'Traditional' | 'Moderne Matcha' | 'Vanilla Collection';

type Product = {
  id: number;
  name: string;
  category: ProductCategory;
  desc: string;
  priceK: string;
  img: string;
};

// Simplified categories for the UI tabs
const uiCategories = ['All', 'Traditional', 'Matcha', 'Vanilla'] as const;
type TabCategory = typeof uiCategories[number];

// Data structure populated exactly from input menu images
const stockProducts: Product[] = [
  { id: 1, name: 'Donat Gula', category: 'Traditional', desc: 'Classic powdered sugar dusting on soft dough.', priceK: '2.5k', img: '/donat12.png' },
  { id: 2, name: 'Matcha Oreo', category: 'Moderne Matcha', desc: 'Japanese green tea glaze topped with Oreo crumbles.', priceK: '4k', img: '/donat24.png' },
  { id: 3, name: 'Vanilla Popcorn Caramel', category: 'Vanilla Collection', desc: 'Sweet vanilla glaze, caramel drizzle, crunchy popcorn.', priceK: '4k', img: '/donat18.png' },
  { id: 4, name: 'Buttercream Meses', category: 'Traditional', desc: "Indonesia's favorite buttercream and chocolate sprinkles.", priceK: '3k', img: '/donat13.png' },
  { id: 5, name: 'Strawberry Crunch', category: 'Moderne Matcha', desc: 'Pink glaze with crunchy strawberry pearl bits.', priceK: '4k', img: '/donat22.png' },
  { id: 6, name: 'Tiramissu Regal', category: 'Vanilla Collection', desc: 'Coffee glaze with Regal biscuit crumbs.', priceK: '4k', img: '/donat19.png' },
];

export const ProductGrid = () => {
  // 1. State untuk mengontrol tab yang aktif
  const [activeTab, setActiveTab] = useState<TabCategory>('All');

  // 2. Logika untuk memfilter produk berdasarkan tab yang diklik
  const filteredProducts = stockProducts.filter((product) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Traditional') return product.category === 'Traditional';
    if (activeTab === 'Matcha') return product.category === 'Moderne Matcha';
    if (activeTab === 'Vanilla') return product.category === 'Vanilla Collection';
    return true;
  });

  return (
    <section id="categories" className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 bg-white rounded-t-[3rem] shadow-sm -mt-16 relative z-30">
      
      {/* Category Filter Section */}
      <div className="flex items-center justify-start md:justify-center gap-2 md:gap-3 mb-10 md:mb-16 overflow-x-auto pb-4 md:overflow-x-visible hide-scrollbar px-2">
        {uiCategories.map((cat) => {
          const isActive = activeTab === cat;
          return (
            <Button 
              key={cat} 
              onClick={() => setActiveTab(cat)}
              variant={isActive ? 'default' : 'outline'} 
              className={`rounded-full px-5 md:px-8 py-4 md:py-6 text-xs md:text-sm font-black uppercase tracking-widest transition-all duration-300 shrink-0 ${
                isActive 
                  ? 'bg-stone-900 text-white shadow-md scale-105' 
                  : 'border-stone-200 text-stone-500 hover:text-stone-900 hover:border-stone-400 hover:bg-stone-50'
              }`}
            >
              {cat}
            </Button>
          );
        })}
      </div>

      {/* Product Card Grid */}
      {/* PERBAIKAN KRUSIAL: grid-cols-2 untuk mobile agar rapi, gap disesuaikan agar tidak sesak */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 lg:gap-12 [perspective:1000px] min-h-[500px]">
        
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="group flex flex-col bg-white rounded-[1.5rem] md:rounded-[2rem] p-3 md:p-5 border border-stone-100 transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 animate-in fade-in zoom-in-95 duration-300"
          >
            {/* Image Wrapper */}
            <div className="relative w-full aspect-square mb-4 md:mb-6 rounded-xl md:rounded-2xl overflow-hidden bg-stone-50 flex items-center justify-center p-4">
              <Image
                src={product.img}
                alt={product.name}
                fill // Menggunakan fill lebih aman untuk aspect-square
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" // Optimasi performa Next.js
                className="object-contain drop-shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700 ease-out p-2"
                priority={product.id <= 4}
              />
              
              {/* Rating Badge */}
              <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-white/90 backdrop-blur-sm px-1.5 md:px-2.5 py-1 md:py-1.5 rounded-full flex items-center gap-1 shadow-sm border border-stone-100 z-10">
                <Star className="w-3 h-3 md:w-3.5 md:h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-[10px] md:text-sm font-bold text-stone-800">4.9</span>
              </div>
              
              {/* Price Badge - Menggunakan styling pink cerah ala stiker menu */}
              <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-rose-100 text-rose-700 font-black text-[10px] md:text-xs uppercase tracking-wider px-2 md:px-3 py-1 md:py-1.5 rounded-full border border-rose-200 shadow-sm z-10">
                {product.priceK}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow justify-between">
              <div>
                <h3 className="text-sm md:text-xl font-black text-stone-900 leading-tight mb-1.5 md:mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
                  {product.name}
                </h3>
                
                <p className="text-stone-500 text-[10px] md:text-sm font-medium line-clamp-2 mb-4 md:mb-6">
                  {product.desc}
                </p>
              </div>

              {/* Add to Cart Button */}
              <Button 
                className="w-full bg-stone-100 hover:bg-stone-900 text-stone-900 hover:text-white font-bold py-4 md:py-6 rounded-lg md:rounded-xl transition-all duration-300 text-xs md:text-base shadow-sm flex items-center justify-center gap-2 group/btn"
              >
                <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 group-hover/btn:-translate-y-0.5 transition-transform" />
                <span className="hidden sm:inline">Add to Box</span>
                <span className="inline sm:hidden">Add</span>
              </Button>
            </div>
          </div>
        ))}
        
        {/* Empty State Handle (Jika filter tidak menemukan produk) */}
        {filteredProducts.length === 0 && (
          <div className="col-span-full py-20 text-center flex flex-col items-center justify-center">
            <span className="text-4xl mb-4">🍩</span>
            <h3 className="text-xl font-bold text-stone-800">Oops, Sold Out!</h3>
            <p className="text-stone-500 mt-2">Koleksi donat ini sedang tidak tersedia.</p>
          </div>
        )}

      </div>
    </section>
  );
};