/* ==========================================================================
 * src/app/menu/page.tsx — NOSTIMO Full Menu Page
 * Premium artisan donut catalog with advanced filtering, search, and
 * beautiful card layout. Fully responsive for mobile & desktop.
 * Includes Premium Quick View Modal / Bottom Sheet.
 * ========================================================================== */

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, ShoppingBag, Search, SlidersHorizontal,
  Flame, Sparkles, Leaf, Cookie, ArrowRight, X, Minus, Plus, CheckCircle2
} from 'lucide-react';
import { Navbar }  from '@/components/Navbar';
import { Footer }  from '@/components/Footer';
import { useCart } from '@/context/CartContext'; // <-- IMPORT CART CONTEXT

// ── Types ────────────────────────────────────────────────────────────────────
type ProductCategory = 'Traditional' | 'Matcha' | 'Vanilla' | 'Chocolate' | 'Fruit';

type Product = {
  id: number;
  name: string;
  category: ProductCategory;
  desc: string;
  price: number;
  img: string;
  rating: number;
  badge?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
};

// ── Categories ───────────────────────────────────────────────────────────────
const CATEGORIES: { key: ProductCategory | 'All'; label: string; icon: React.ReactNode }[] = [
  { key: 'All',         label: 'Semua',       icon: <SlidersHorizontal size={14} /> },
  { key: 'Traditional', label: 'Traditional',  icon: <Cookie size={14} /> },
  { key: 'Matcha',      label: 'Matcha',       icon: <Leaf size={14} /> },
  { key: 'Vanilla',     label: 'Vanilla',      icon: <Sparkles size={14} /> },
  { key: 'Chocolate',   label: 'Chocolate',    icon: <Flame size={14} /> },
  { key: 'Fruit',       label: 'Fruit',        icon: <Star size={14} /> },
];

// ── Products ─────────────────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  { id: 1,  name: 'Donat Gula Classic',           category: 'Traditional', desc: 'Classic powdered sugar dusting on soft pillow dough.',                            price: 8000,  img: '/donat12.png', rating: 4.8 },
  { id: 2,  name: 'Buttercream Meses',             category: 'Traditional', desc: "Indonesia's beloved buttercream topped with chocolate sprinkles.",               price: 10000, img: '/donat13.png', rating: 4.9, isBestSeller: true },
  { id: 3,  name: 'Cinnamon Sugar Twist',          category: 'Traditional', desc: 'Warm cinnamon swirl with caramelized sugar crust.',                              price: 10000, img: '/donat14.png', rating: 4.7 },
  { id: 4,  name: 'Glazed Honey Ring',             category: 'Traditional', desc: 'Pure wildflower honey glaze, golden perfection.',                                price: 9000,  img: '/donat15.png', rating: 4.8 },
  { id: 5,  name: 'Matcha Remastered',             category: 'Matcha',      desc: 'Double matcha glaze with white chocolate drizzle.',                               price: 18000, img: '/donat1.png',  rating: 5.0, isBestSeller: true, badge: '★ Best Seller' },
  { id: 6,  name: 'Matcha Oreo Crumble',           category: 'Matcha',      desc: 'Japanese green tea glaze topped with Oreo crumbles.',                             price: 16000, img: '/donat24.png', rating: 4.9 },
  { id: 7,  name: 'Matcha Red Bean',               category: 'Matcha',      desc: 'Ceremonial grade matcha with sweet red bean filling.',                            price: 17000, img: '/donat2.png',  rating: 4.8, isNew: true },
  { id: 8,  name: 'Matcha Coconut Bliss',          category: 'Matcha',      desc: 'Matcha infused with toasted coconut flakes and coconut cream.',                   price: 16000, img: '/donat3.png',  rating: 4.7 },
  { id: 9,  name: 'Vanilla Popcorn Caramel',       category: 'Vanilla',     desc: 'Sweet vanilla glaze, salted caramel drizzle, crunchy popcorn.',                   price: 15000, img: '/donat18.png', rating: 4.9 },
  { id: 10, name: 'Vanilla Bean Brûlée',           category: 'Vanilla',     desc: 'Real Madagascar vanilla bean with caramelized sugar top.',                        price: 17000, img: '/donat19.png', rating: 4.8, isNew: true },
  { id: 11, name: 'Vanilla Rose Petal',            category: 'Vanilla',     desc: 'Delicate rosewater vanilla glaze with edible rose petals.',                       price: 18000, img: '/donat20.png', rating: 4.9 },
  { id: 12, name: 'Tiramissu Regal',               category: 'Vanilla',     desc: 'Coffee-soaked vanilla glaze with Regal biscuit crumbs.',                          price: 16000, img: '/donat21.png', rating: 4.8 },
  { id: 13, name: 'Double Choco Lava',             category: 'Chocolate',   desc: 'Rich Belgian chocolate glaze with molten chocolate center.',                      price: 18000, img: '/donat4.png',  rating: 5.0, isBestSeller: true },
  { id: 14, name: 'Dark Choco Almond',             category: 'Chocolate',   desc: '72% dark chocolate with roasted California almonds.',                             price: 17000, img: '/donat5.png',  rating: 4.9 },
  { id: 15, name: 'Chocolate Hazelnut Praline',    category: 'Chocolate',   desc: 'Gianduja chocolate with crunchy hazelnut praline topping.',                       price: 19000, img: '/donat6.png',  rating: 4.8 },
  { id: 16, name: 'White Choco Macadamia',         category: 'Chocolate',   desc: 'Creamy white chocolate with toasted macadamia nuts.',                             price: 18000, img: '/donat7.png',  rating: 4.7, isNew: true },
  { id: 17, name: 'Strawberry Crunch',             category: 'Fruit',       desc: 'Pink strawberry glaze with crunchy strawberry pearl bits.',                       price: 15000, img: '/donat22.png', rating: 4.8 },
  { id: 18, name: 'Blueberry Cheesecake',          category: 'Fruit',       desc: 'Tangy blueberry compote over cream cheese frosting.',                             price: 17000, img: '/donat23.png', rating: 4.9, isNew: true },
  { id: 19, name: 'Mango Passion Swirl',           category: 'Fruit',       desc: 'Tropical mango glaze with passion fruit drizzle.',                                price: 16000, img: '/donat8.png',  rating: 4.7 },
  { id: 20, name: 'Lemon Poppy Seed',              category: 'Fruit',       desc: 'Zesty lemon glaze with crunchy poppy seed topping.',                              price: 15000, img: '/donat9.png',  rating: 4.6 },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatPrice(n: number) {
  return `Rp ${n.toLocaleString('id-ID')}`;
}

const cardVariants = {
  hidden:  { opacity: 0, y: 24, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
  exit: { opacity: 0, y: -12, scale: 0.96, transition: { duration: 0.25 } },
};

// ── Component ────────────────────────────────────────────────────────────────
export default function MenuPage() {
  const { addToCart } = useCart(); // <-- INIT CART CONTEXT

  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Filter Logic
  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
      setQty(1); // Reset qty when opening new product
      setIsAdded(false); // Reset add state
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedProduct]);

  // Handle Add to Cart Simulation
  const handleAddToCart = () => {
    if (!selectedProduct) return;

    setIsAdded(true);
    
    // --> MASUKKAN DATA KE GLOBAL CONTEXT <--
    addToCart({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      img: selectedProduct.img,
      qty: qty
    });

    setTimeout(() => {
      setSelectedProduct(null); // Auto close after success
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Navbar />

      {/* ─── Hero ───────────────────────────────────────────────────── */}
      <section className="relative bg-stone-950 overflow-hidden">
        {/* Texture */}
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />
        {/* Glows */}
        <div aria-hidden="true" className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/8 blur-[160px]" />
        <div aria-hidden="true" className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-rose-500/8 blur-[140px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16 md:pt-28 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-6">
              <Sparkles size={12} />
              20 Varian Rasa Premium
            </span>
            <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black text-stone-50 tracking-tight leading-[1.05]">
              Our Donut
              <br />
              <span className="italic text-amber-400">Selection</span>
            </h1>
            <p className="text-stone-400 text-base sm:text-lg mt-5 max-w-lg mx-auto leading-relaxed">
              Each donut is made with carefully selected ingredients and love. Find your favorite flavor from our premium collection.
            </p>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-[1px]">
          <svg viewBox="0 0 1440 56" fill="none" className="w-full h-auto">
            <path d="M0 56V28C240 0 480 0 720 28C960 56 1200 56 1440 28V56H0Z" fill="#FDFCFA" />
          </svg>
        </div>
      </section>

      {/* ─── Filter & Search Bar ────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-2 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 p-4 sm:p-6"
        >
          {/* Search */}
          <div className="relative mb-5">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your favorite donut..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all"
            />
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {CATEGORIES.map(({ key, label, icon }) => {
              const active = activeCategory === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider
                    transition-all duration-200 shrink-0
                    ${active
                      ? 'bg-stone-900 text-white shadow-md'
                      : 'bg-stone-50 text-stone-500 hover:bg-stone-100 hover:text-stone-700 border border-stone-200'}
                  `}
                >
                  {icon}
                  {label}
                </button>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ─── Product Grid ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Results count */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-stone-500 font-medium">
            Show <span className="text-stone-900 font-bold">{filtered.length}</span> donut
          </p>
        </div>

        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={() => setSelectedProduct(product)}
                  className="group flex flex-col bg-white rounded-2xl md:rounded-3xl border border-stone-100 overflow-hidden transition-all duration-300 hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.1)] hover:-translate-y-1 cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative w-full aspect-square bg-stone-50 overflow-hidden">
                    <Image
                      src={product.img}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className="object-contain p-4 group-hover:scale-110 group-hover:rotate-2 transition-transform duration-700 ease-out"
                      priority={i < 8}
                    />

                    {/* Rating badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm border border-stone-100 z-10">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <span className="text-[10px] md:text-xs font-bold text-stone-800">{product.rating}</span>
                    </div>

                    {/* Badges */}
                    {product.isBestSeller && (
                      <div className="absolute top-3 right-3 bg-amber-500 text-stone-950 text-[9px] md:text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1 z-10">
                        <Flame size={10} /> Best Seller
                      </div>
                    )}
                    {product.isNew && !product.isBestSeller && (
                      <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[9px] md:text-[10px] font-black px-2 py-1 rounded-full z-10">
                        NEW
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-grow p-4 md:p-5">
                    <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mb-1">{product.category}</p>
                    <h3 className="text-sm md:text-base font-black text-stone-900 leading-tight mb-1 group-hover:text-amber-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-[10px] md:text-xs text-stone-500 line-clamp-2 mb-3 leading-relaxed">
                      {product.desc}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                      <p className="text-sm md:text-base font-black text-stone-900">{formatPrice(product.price)}</p>
                      <button className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-stone-100 group-hover:bg-amber-500 text-stone-600 group-hover:text-stone-950 flex items-center justify-center transition-all duration-200">
                        <ShoppingBag size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-24 text-center"
            >
              <span className="text-5xl mb-4 block">🍩</span>
              <h3 className="text-xl font-bold text-stone-800">Tidak Ditemukan</h3>
              <p className="text-stone-500 mt-2 max-w-sm mx-auto">Coba ubah filter atau kata kunci pencarian kamu.</p>
              <button
                onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-900 text-white text-sm font-bold hover:bg-stone-800 transition-colors"
              >
                Reset Filter
                <ArrowRight size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ─── CTA Banner ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-stone-950 rounded-3xl overflow-hidden p-8 md:p-14"
        >
          <div aria-hidden="true" className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
          />
          <div aria-hidden="true" className="absolute top-0 right-0 w-80 h-80 rounded-full bg-amber-500/10 blur-[100px]" />

          <div className="relative z-10 text-center max-w-xl mx-auto">
            <h2 className="font-playfair text-3xl md:text-4xl font-black text-stone-50 tracking-tight mb-4">
              Order Special <span className="italic text-amber-400">Packet Box</span>
            </h2>
            <p className="text-stone-400 text-sm md:text-base leading-relaxed mb-8">
              Choose 6 or 12 of your favorite varieties in one premium box. Perfect for gifts, social gatherings, or self-indulgence.
            </p>
            <Link href="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/25"
            >
              Buat Box Kamu
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />

      {/* ─── QUICK VIEW MODAL (Mobile Bottom Sheet & Desktop Modal) ─── */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex flex-col justify-end md:justify-center items-center md:p-6 pointer-events-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm pointer-events-auto cursor-pointer"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, y: '100%', scale: 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: '100%', scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full md:w-auto md:max-w-4xl bg-white rounded-t-[2rem] md:rounded-[2rem] shadow-2xl pointer-events-auto overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Close Button (Desktop & Mobile) */}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/80 md:bg-stone-100 backdrop-blur-md rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Left/Top Area: Image */}
              <div className="relative w-full md:w-[400px] lg:w-[480px] h-[300px] md:h-auto bg-stone-50 flex items-center justify-center shrink-0">
                {/* Decorative BG element */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.08),transparent_70%)]" />
                <Image
                  src={selectedProduct.img}
                  alt={selectedProduct.name}
                  fill
                  className="object-contain p-8 md:p-12 drop-shadow-2xl"
                />
                
                {/* Badges mapped on Image */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                   {selectedProduct.isBestSeller && (
                      <span className="bg-amber-500 text-stone-950 text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 w-max">
                        <Flame size={14} /> Best Seller
                      </span>
                    )}
                    {selectedProduct.isNew && (
                      <span className="bg-emerald-500 text-white text-xs font-black px-3 py-1.5 rounded-full w-max tracking-widest">
                        NEW
                      </span>
                    )}
                </div>
              </div>

              {/* Right/Bottom Area: Details */}
              <div className="p-6 md:p-10 flex flex-col w-full md:w-[400px] lg:w-[450px] overflow-y-auto">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
                    {selectedProduct.category}
                  </span>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md text-amber-600">
                    <Star size={12} className="fill-amber-500 text-amber-500" />
                    <span className="text-xs font-bold">{selectedProduct.rating}</span>
                  </div>
                </div>

                <h2 className="font-playfair text-2xl md:text-3xl font-black text-stone-900 mb-4 leading-tight">
                  {selectedProduct.name}
                </h2>
                
                <p className="text-stone-500 text-sm md:text-base leading-relaxed mb-8 flex-grow">
                  {selectedProduct.desc} 
                  <br/><br/>
                  Freshly made everyday with premium ingredients. Perfect companion for your daily coffee or tea time.
                </p>

                {/* Separator */}
                <hr className="border-stone-100 mb-6" />

                {/* Quantity & Price */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4 bg-stone-50 border border-stone-200 rounded-2xl p-1">
                    <button 
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-4 text-center font-bold text-stone-900">{qty}</span>
                    <button 
                      onClick={() => setQty(qty + 1)}
                      className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-stone-500 font-medium mb-1">Total Price</p>
                    <p className="text-xl md:text-2xl font-black text-stone-900">
                      {formatPrice(selectedProduct.price * qty)}
                    </p>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`
                    w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all duration-300
                    ${isAdded 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                      : 'bg-stone-900 text-white hover:bg-stone-800 shadow-lg shadow-stone-900/20'}
                  `}
                >
                  {isAdded ? (
                    <>
                      <CheckCircle2 size={18} />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      Add to Cart — {qty} Items
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}