'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageSquare,
  Package,
  ExternalLink,
  Home,
  Clock,
  MapPin,
  Phone,
} from 'lucide-react';
import { OrderService } from '@/lib/supabase';
import { formatIDR } from '@/lib/validation';
import type { OrderWithItems } from '@/types';

const NOSTIMO_WA = process.env.NEXT_PUBLIC_NOSTIMO_WA ?? '6281234567890';

function LoadingState() {
  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
      <div className="text-center">
        <Loader2 size={40} className="text-amber-500 animate-spin mx-auto mb-4" />
        <p className="text-stone-400 text-sm">Memuat detail pesananmu...</p>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-rose-950 border border-rose-800 flex items-center justify-center">
            <AlertCircle size={40} className="text-rose-400" />
          </div>
        </div>

        <h1 className="text-2xl font-black text-stone-50 italic mb-2">
          Oops!
        </h1>
        <p className="text-stone-400 text-sm mb-8">
          {message}
        </p>

        <Link
          href="/"
          className="
            inline-flex items-center justify-center gap-2
            bg-amber-500 hover:bg-amber-400
            text-stone-950 font-bold py-3 px-6 rounded-xl
            transition-colors duration-200
          "
        >
          <Home size={16} />
          Kembali ke Menu
        </Link>
      </div>
    </div>
  );
}

interface OrderSummaryItemProps {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

function OrderSummaryItem({ name, image, price, quantity }: OrderSummaryItemProps) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-stone-800 last:border-0">
      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-stone-800">
        <Image
          src={image}
          alt={name}
          fill
          sizes="48px"
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-200 truncate">{name}</p>
        <p className="text-xs text-stone-500 mt-0.5">× {quantity}</p>
      </div>

      <p
        className="text-sm font-semibold text-stone-200 shrink-0"
        suppressHydrationWarning
      >
        {formatIDR(price * quantity)}
      </p>
    </div>
  );
}

function SuccessState({ order }: { order: OrderWithItems }) {
  const waMessage = encodeURIComponent(
    `Halo Nostimo! 🍩\n\nSaya baru saja melakukan order.\n\n` +
    `Nama: ${order.customer_name}\n` +
    `Order ID: ${order.id.slice(0, 8).toUpperCase()}\n` +
    `Total: ${formatIDR(order.grand_total)}\n\n` +
    `Mohon konfirmasi pesanan saya. Terima kasih!`
  );

  const waLink = `https://wa.me/${NOSTIMO_WA}?text=${waMessage}`;
  const subtotal = order.grand_total - order.tax_amount;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-900">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <h1 className="text-base font-black italic text-stone-50">Nostimo</h1>
          <p className="text-xs text-stone-500">Konfirmasi Pesanan</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Success Banner */}
        <div className="mb-8 md:mb-10">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center">
              <CheckCircle2 size={40} className="text-emerald-400" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-center text-stone-50 italic mb-2">
            Order Masuk!
          </h2>
          <p className="text-center text-stone-400 text-sm md:text-base">
            Terima kasih, <span className="text-stone-200 font-semibold">{order.customer_name}</span>.
            {' '}Pesananmu sudah kami terima dan sedang diproses.
          </p>
        </div>

        {/* Order Details Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Left: Order Info */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-6">
            <h3 className="text-sm font-bold text-stone-200 mb-5 pb-4 border-b border-stone-800 uppercase tracking-wide">
              Detail Pesanan
            </h3>

            <div className="space-y-4">
              {/* Order ID */}
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">Order ID</p>
                <p className="text-base font-mono font-bold text-amber-400 break-all">
                  #{order.id.slice(0, 8).toUpperCase()}
                </p>
              </div>

              {/* Customer Info */}
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">Nama Penerima</p>
                <p className="text-sm font-semibold text-stone-200">{order.customer_name}</p>
              </div>

              {/* Address */}
              <div>
                <div className="flex items-start gap-2 mb-1">
                  <MapPin size={12} className="text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-stone-500 uppercase tracking-widest">Alamat Pengiriman</p>
                </div>
                <p className="text-sm text-stone-300 leading-relaxed ml-5">
                  {order.customer_address}
                </p>
              </div>

              {/* Note if exists */}
              {order.customer_note && (
                <div>
                  <div className="flex items-start gap-2 mb-1">
                    <MessageSquare size={12} className="text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-stone-500 uppercase tracking-widest">Catatan</p>
                  </div>
                  <p className="text-sm text-stone-300 leading-relaxed ml-5 italic">
                    {order.customer_note}
                  </p>
                </div>
              )}

              {/* Status */}
              <div className="pt-4 border-t border-stone-800">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-amber-500" />
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-widest">Status</p>
                    <p className="text-sm font-semibold text-amber-400 capitalize">
                      {order.status === 'pending' && '⏳ Pending - Menunggu Konfirmasi'}
                      {order.status === 'confirmed' && '✅ Confirmed - Sedang Dipersiapkan'}
                      {order.status === 'processing' && '🔄 Processing - Sedang Dibuat'}
                      {order.status === 'ready' && '✨ Ready - Siap Diambil'}
                      {order.status === 'delivered' && '🎉 Delivered - Selesai'}
                      {order.status === 'cancelled' && '❌ Cancelled - Dibatalkan'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary & Price */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-6">
            <h3 className="text-sm font-bold text-stone-200 mb-5 pb-4 border-b border-stone-800 uppercase tracking-wide">
              Ringkasan Pesanan
            </h3>

            {/* Items */}
            <div className="mb-5">
              {order.order_items.map((item) => (
                <OrderSummaryItem
                  key={item.id}
                  name={item.product_name}
                  image={item.product_image}
                  price={item.unit_price}
                  quantity={item.quantity}
                />
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 py-4 border-t border-stone-800">
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Subtotal</span>
                <span className="text-stone-200 font-medium" suppressHydrationWarning>
                  {formatIDR(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">PPN 11%</span>
                <span className="text-stone-200 font-medium" suppressHydrationWarning>
                  {formatIDR(order.tax_amount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Ongkir</span>
                <span className="text-emerald-400 font-semibold">Gratis</span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="flex justify-between items-center py-4 border-t border-stone-700">
              <span className="text-base font-bold text-stone-100">Total</span>
              <span
                className="text-2xl font-black text-amber-400"
                suppressHydrationWarning
              >
                {formatIDR(order.grand_total)}
              </span>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 mb-8">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center justify-center gap-2 w-full
              bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700
              text-white font-bold py-4 px-4 rounded-xl
              transition-colors duration-200
              text-sm md:text-base
            "
          >
            <Phone size={18} />
            Konfirmasi via WhatsApp
            <ExternalLink size={14} className="opacity-70" />
          </a>

          <Link
            href="/"
            className="
              flex items-center justify-center gap-2 w-full
              bg-stone-900 hover:bg-stone-800
              border border-stone-700 hover:border-stone-600
              text-stone-300 font-semibold py-4 px-4 rounded-xl
              transition-colors duration-200
              text-sm md:text-base
            "
          >
            <Package size={18} />
            Kembali ke Menu
          </Link>
        </div>

        {/* Info Box */}
        <div className="bg-stone-950/50 border border-stone-800 rounded-2xl p-5 sm:p-6">
          <h4 className="text-sm font-bold text-stone-200 mb-4">ℹ️ Informasi Penting</h4>
          <ul className="space-y-2 text-xs md:text-sm text-stone-400">
            <li className="flex items-start gap-3">
              <span className="text-amber-500 mt-1 shrink-0">→</span>
              <span>Segera konfirmasi pesanan via WhatsApp untuk mempercepat proses.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500 mt-1 shrink-0">→</span>
              <span>Simpan Order ID untuk referensi jika ada pertanyaan.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500 mt-1 shrink-0">→</span>
              <span>Pesanan dibuat fresh setiap pagi. Estimasi siap 2-3 jam.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500 mt-1 shrink-0">→</span>
              <span>Data kamu aman dan terenkripsi di server kami.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function ConfirmContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderWithItems | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!orderId) {
      setError('Order ID tidak ditemukan. Silakan coba lagi.');
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data, error } = await OrderService.getById(orderId);

        if (error || !data) {
          setError('Gagal memuat detail pesanan. Silakan coba lagi.');
          return;
        }

        setOrder(data);
      } catch (err) {
        setError('Terjadi kesalahan saat memuat pesanan.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [mounted, orderId]);

  if (!mounted) {
    return <LoadingState />;
  }

  if (loading) {
    return <LoadingState />;
  }

  if (error || !order) {
    return <ErrorState message={error ?? 'Order tidak ditemukan.'} />;
  }

  return <SuccessState order={order} />;
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ConfirmContent />
    </Suspense>
  );
}
