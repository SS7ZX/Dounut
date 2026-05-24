// =============================================================================
// src/app/(storefront)/checkout/page.tsx
// NOSTIMO — Checkout Page
//
// ALUR UX:
//   1. User datang dari cart → lihat ringkasan order di kanan
//   2. Isi form nama / WA / alamat di kiri
//   3. Klik "Pesan Sekarang" → loading state → Supabase insert
//   4. Sukses → Success state dengan order ID + link WA konfirmasi
//   5. Error → Error state dengan pesan dan tombol retry
//
// ANTI-HYDRATION STRATEGY:
//   - `mounted` guard: komponen render null sampai useEffect jalan di client
//   - Semua data dari Zustand dibaca setelah mount
//   - suppressHydrationWarning pada semua price display
//
// MOBILE-FIRST:
//   - Single column di mobile, dua kolom di md+
//   - Sticky summary di desktop, stacked di mobile
//   - Touch-friendly input sizes (min 44px tap target)
// =============================================================================

'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  ArrowLeft,
  User,
  Phone,
  MapPin,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  Package,
  ExternalLink,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { OrderService }  from '@/lib/supabase';
import {
  validateCheckoutForm,
  isFormValid,
  formatIDR,
  formatWhatsappLink,
  calculateOrderSummary,
} from '@/lib/validation';
import type {
  CustomerDetails,
  CheckoutFormErrors,
  CheckoutState,
} from '@/types';

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------
const NOSTIMO_WA = process.env.NEXT_PUBLIC_NOSTIMO_WA ?? '6281234567890';

const INITIAL_FORM: CustomerDetails = {
  name:     '',
  whatsapp: '',
  address:  '',
  note:     '',
};

const INITIAL_STATE: CheckoutState = {
  step:     'form',
  orderId:  null,
  errorMsg: null,
};

// ---------------------------------------------------------------------------
// SUB-COMPONENT: FormField
// Reusable input field dengan label, error state, dan icon
// ---------------------------------------------------------------------------
interface FormFieldProps {
  id:          string;
  label:       string;
  icon:        React.ReactNode;
  error?:      string;
  required?:   boolean;
  children:    React.ReactNode;
}

function FormField({ id, label, icon, error, required, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="flex items-center gap-2 text-sm font-semibold text-stone-300"
      >
        <span className="text-amber-500" aria-hidden="true">{icon}</span>
        {label}
        {required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p
          role="alert"
          className="flex items-center gap-1.5 text-xs text-rose-400 mt-0.5"
        >
          <AlertCircle size={12} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SUB-COMPONENT: OrderSummaryItem
// Satu baris item di ringkasan order
// ---------------------------------------------------------------------------
interface OrderSummaryItemProps {
  name:     string;
  image:    string;
  price:    number;
  quantity: number;
}

function OrderSummaryItem({ name, image, price, quantity }: OrderSummaryItemProps) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-stone-800 last:border-0">
      {/* Product image */}
      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-stone-800">
        <Image
          src={image}
          alt={name}
          fill
          sizes="48px"
          className="object-cover"
        />
      </div>

      {/* Name + qty */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-200 truncate">{name}</p>
        <p className="text-xs text-stone-500 mt-0.5">× {quantity}</p>
      </div>

      {/* Line total */}
      <p
        className="text-sm font-semibold text-stone-200 shrink-0"
        suppressHydrationWarning
      >
        {formatIDR(price * quantity)}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SUB-COMPONENT: SuccessView
// Ditampilkan setelah order berhasil dibuat
// ---------------------------------------------------------------------------
interface SuccessViewProps {
  orderId:         string;
  customerName:    string;
  customerWa:      string;
  grandTotal:      number;
}

function SuccessView({ orderId, customerName, customerWa, grandTotal }: SuccessViewProps) {
  // Buat pesan WA yang pre-filled
  const waMessage = encodeURIComponent(
    `Halo Nostimo! 🍩\n\nSaya baru saja melakukan order.\n\n` +
    `Nama: ${customerName}\n` +
    `Order ID: ${orderId.slice(0, 8).toUpperCase()}\n` +
    `Total: ${formatIDR(grandTotal)}\n\n` +
    `Mohon konfirmasi pesanan saya. Terima kasih!`
  );

  const waLink = `https://wa.me/${NOSTIMO_WA}?text=${waMessage}`;

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        {/* Animated check icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center">
            <CheckCircle2 size={40} className="text-emerald-400" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-stone-50 italic mb-2">
          Order Masuk!
        </h1>
        <p className="text-stone-400 text-sm mb-8">
          Terima kasih, <span className="text-stone-200 font-semibold">{customerName}</span>.
          {' '}Pesananmu sudah kami terima.
        </p>

        {/* Order ID card */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 mb-6 text-left">
          <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">Order ID</p>
          <p className="text-base font-mono font-bold text-amber-400">
            #{orderId.slice(0, 8).toUpperCase()}
          </p>

          <div className="mt-4 pt-4 border-t border-stone-800 flex justify-between items-center">
            <p className="text-xs text-stone-500">Total Pembayaran</p>
            <p className="text-base font-bold text-stone-200" suppressHydrationWarning>
              {formatIDR(grandTotal)}
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center justify-center gap-2 w-full
              bg-emerald-600 hover:bg-emerald-500
              text-white font-bold py-4 rounded-xl
              transition-colors duration-200
              text-sm
            "
          >
            <Phone size={16} />
            Konfirmasi via WhatsApp
            <ExternalLink size={14} className="opacity-70" />
          </a>

          <Link
            href="/"
            className="
              flex items-center justify-center gap-2 w-full
              bg-stone-900 hover:bg-stone-800
              border border-stone-700
              text-stone-300 font-semibold py-4 rounded-xl
              transition-colors duration-200
              text-sm
            "
          >
            <Package size={16} />
            Kembali ke Menu
          </Link>
        </div>

        <p className="text-xs text-stone-600 mt-6">
          Simpan order ID di atas untuk referensi jika ada pertanyaan.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SUB-COMPONENT: EmptyCartRedirect
// Ditampilkan jika user akses /checkout dengan cart kosong
// ---------------------------------------------------------------------------
function EmptyCartRedirect() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push('/'), 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
      <div className="text-center">
        <ShoppingBag size={48} className="text-stone-700 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-stone-300 mb-2">
          Keranjangmu kosong
        </h2>
        <p className="text-stone-500 text-sm">
          Mengalihkan ke menu dalam beberapa detik...
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN PAGE COMPONENT: CheckoutPage
// ---------------------------------------------------------------------------
export default function CheckoutPage() {
  // ---- Hydration guard ----
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ---- Zustand cart state ----
  const cart     = useCartStore((s) => s.cart);
  const clearCart = useCartStore((s) => s.clearCart);

  // ---- Form state ----
  const [form, setForm] = useState<CustomerDetails>(INITIAL_FORM);
  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CustomerDetails, boolean>>>({});

  // ---- Checkout flow state ----
  const [checkout, setCheckout] = useState<CheckoutState>(INITIAL_STATE);

  // ---- Ref untuk scroll ke error pertama ----
  const firstErrorRef = useRef<HTMLDivElement>(null);

  // ---- Order summary calculations ----
  const { subtotal, tax_amount, grand_total } = useMemo(
    () => calculateOrderSummary(cart),
    [cart]
  );

  const totalItems = useMemo(
    () => cart.reduce((sum, i) => sum + i.quantity, 0),
    [cart]
  );

  // ---- Real-time validation saat field di-blur ----
  const handleBlur = useCallback((field: keyof CustomerDetails) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validateCheckoutForm(form);
    setErrors(fieldErrors);
  }, [form]);

  // ---- Update form value ----
  const handleChange = useCallback((
    field: keyof CustomerDetails,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Re-validate hanya field yang sudah di-touch
    if (touched[field]) {
      setErrors(validateCheckoutForm({ ...form, [field]: value }));
    }
  }, [form, touched]);

  // ---- Submit handler ----
  const handleSubmit = useCallback(async () => {
    // Tandai semua field sebagai touched untuk show semua error
    setTouched({ name: true, whatsapp: true, address: true });

    const validationErrors = validateCheckoutForm(form);
    setErrors(validationErrors);

    if (!isFormValid(validationErrors)) {
      // Scroll ke error pertama
      firstErrorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Set loading state
    setCheckout({ step: 'submitting', orderId: null, errorMsg: null });

    const { data, error } = await OrderService.createOrder(
      {
        customer_name:     form.name.trim(),
        customer_whatsapp: formatWhatsappLink(form.whatsapp),
        customer_address:  form.address.trim(),
        customer_note:     form.note?.trim() ?? '',
        subtotal,
        tax_amount,
        grand_total,
      },
      cart
    );

    if (error || !data) {
      setCheckout({
        step:     'error',
        orderId:  null,
        errorMsg: error ?? 'Terjadi kesalahan tidak dikenal.',
      });
      return;
    }

    // Sukses: clear cart, simpan order ID
    clearCart();
    setCheckout({ step: 'success', orderId: data.id, errorMsg: null });
  }, [form, cart, subtotal, tax_amount, grand_total, clearCart]);

  // ---- Render guards ----

  // Belum mount: tampilkan skeleton minimal untuk hindari hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <Loader2 size={32} className="text-amber-500 animate-spin" />
      </div>
    );
  }

  // Cart kosong
  if (cart.length === 0 && checkout.step === 'form') {
    return <EmptyCartRedirect />;
  }

  // Success state
  if (checkout.step === 'success' && checkout.orderId) {
    return (
      <SuccessView
        orderId={checkout.orderId}
        customerName={form.name}
        customerWa={form.whatsapp}
        grandTotal={grand_total}
      />
    );
  }

  const isSubmitting = checkout.step === 'submitting';

  // ---------------------------------------------------------------------------
  // MAIN RENDER: Checkout Form
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* ---- Top navigation bar ---- */}
      <nav className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/cart"
            className="flex items-center gap-2 text-stone-400 hover:text-stone-200 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Kembali ke Keranjang
          </Link>

          {/* Brand */}
          <p className="text-base font-black italic text-stone-50">
            Nostimo
          </p>

          {/* Cart badge */}
          <div className="flex items-center gap-1.5 text-stone-400 text-sm">
            <ShoppingBag size={16} />
            <span suppressHydrationWarning>{totalItems} item</span>
          </div>
        </div>
      </nav>

      {/* ---- Page header ---- */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div className="flex items-center gap-2 text-xs text-stone-600 mb-4">
          <span>Keranjang</span>
          <ChevronRight size={12} />
          <span className="text-amber-500 font-semibold">Checkout</span>
          <ChevronRight size={12} />
          <span>Konfirmasi</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black italic text-stone-50">
          Detail Pesanan
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          Lengkapi informasi di bawah untuk memproses pesananmu.
        </p>
      </div>

      {/* ---- Main content grid ---- */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 lg:gap-10 items-start">

          {/* ================================================================
           * LEFT COLUMN: Customer detail form
           * ================================================================ */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-7">
            <h2 className="text-base font-bold text-stone-200 mb-6 pb-4 border-b border-stone-800">
              Informasi Penerima
            </h2>

            <div className="flex flex-col gap-5" ref={firstErrorRef}>

              {/* Name */}
              <FormField
                id="name"
                label="Nama Lengkap"
                icon={<User size={14} />}
                error={touched.name ? errors.name : undefined}
                required
              >
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Contoh: Budi Santoso"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  disabled={isSubmitting}
                  aria-invalid={!!errors.name}
                  className="
                    w-full bg-stone-800 border border-stone-700
                    rounded-xl px-4 py-3 text-sm text-stone-100
                    placeholder:text-stone-600
                    focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-150
                    aria-invalid:border-rose-500 aria-invalid:focus:ring-rose-500/30
                  "
                />
              </FormField>

              {/* WhatsApp */}
              <FormField
                id="whatsapp"
                label="Nomor WhatsApp"
                icon={<Phone size={14} />}
                error={touched.whatsapp ? errors.whatsapp : undefined}
                required
              >
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-stone-500 font-medium pointer-events-none">
                    +62
                  </span>
                  <input
                    id="whatsapp"
                    type="tel"
                    autoComplete="tel"
                    placeholder="81234567890"
                    value={form.whatsapp}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                    onBlur={() => handleBlur('whatsapp')}
                    disabled={isSubmitting}
                    aria-invalid={!!errors.whatsapp}
                    className="
                      w-full bg-stone-800 border border-stone-700
                      rounded-xl pl-12 pr-4 py-3 text-sm text-stone-100
                      placeholder:text-stone-600
                      focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-150
                      aria-invalid:border-rose-500 aria-invalid:focus:ring-rose-500/30
                    "
                  />
                </div>
                <p className="text-xs text-stone-600">
                  Untuk konfirmasi pesanan via WhatsApp
                </p>
              </FormField>

              {/* Address */}
              <FormField
                id="address"
                label="Alamat Lengkap"
                icon={<MapPin size={14} />}
                error={touched.address ? errors.address : undefined}
                required
              >
                <textarea
                  id="address"
                  autoComplete="street-address"
                  rows={3}
                  placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan..."
                  value={form.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  onBlur={() => handleBlur('address')}
                  disabled={isSubmitting}
                  aria-invalid={!!errors.address}
                  className="
                    w-full bg-stone-800 border border-stone-700
                    rounded-xl px-4 py-3 text-sm text-stone-100
                    placeholder:text-stone-600 resize-none
                    focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-150
                    aria-invalid:border-rose-500 aria-invalid:focus:ring-rose-500/30
                  "
                />
              </FormField>

              {/* Note (optional) */}
              <FormField
                id="note"
                label="Catatan (opsional)"
                icon={<MessageSquare size={14} />}
              >
                <textarea
                  id="note"
                  rows={2}
                  placeholder="Instruksi khusus, rasa favorit, atau pesan untuk kami..."
                  value={form.note ?? ''}
                  onChange={(e) => handleChange('note', e.target.value)}
                  disabled={isSubmitting}
                  className="
                    w-full bg-stone-800 border border-stone-700
                    rounded-xl px-4 py-3 text-sm text-stone-100
                    placeholder:text-stone-600 resize-none
                    focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-150
                  "
                />
              </FormField>

              {/* Error banner */}
              {checkout.step === 'error' && checkout.errorMsg && (
                <div
                  role="alert"
                  className="flex items-start gap-3 bg-rose-950/50 border border-rose-900 rounded-xl p-4"
                >
                  <AlertCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-rose-300">
                      Gagal mengirim pesanan
                    </p>
                    <p className="text-xs text-rose-400/80 mt-0.5">
                      {checkout.errorMsg}
                    </p>
                  </div>
                </div>
              )}

              {/* Submit button — visible on mobile only (desktop: inside right panel) */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="
                  lg:hidden
                  w-full flex items-center justify-center gap-2
                  bg-amber-500 hover:bg-amber-400 active:bg-amber-600
                  disabled:bg-stone-700 disabled:cursor-not-allowed
                  text-stone-950 font-black text-base py-4 rounded-xl
                  transition-all duration-150
                  mt-2
                "
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    Pesan Sekarang
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ================================================================
           * RIGHT COLUMN: Order summary (sticky on desktop)
           * ================================================================ */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-6">
              <h2 className="text-base font-bold text-stone-200 mb-1">
                Ringkasan Pesanan
              </h2>
              <p className="text-xs text-stone-500 mb-5">
                {totalItems} item dalam keranjang
              </p>

              {/* Items list */}
              <div className="mb-5">
                {cart.map((item) => (
                  <OrderSummaryItem
                    key={item.id}
                    name={item.name}
                    image={item.image}
                    price={item.price}
                    quantity={item.quantity}
                  />
                ))}
              </div>

              {/* Price breakdown */}
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
                    {formatIDR(tax_amount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400">Ongkir</span>
                  <span className="text-emerald-400 font-semibold">Gratis</span>
                </div>
              </div>

              {/* Grand total */}
              <div className="flex justify-between items-center py-4 border-t border-stone-700">
                <span className="text-base font-bold text-stone-100">Total</span>
                <span
                  className="text-xl font-black text-amber-400"
                  suppressHydrationWarning
                >
                  {formatIDR(grand_total)}
                </span>
              </div>

              {/* CTA — desktop only */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="
                  hidden lg:flex
                  w-full items-center justify-center gap-2
                  bg-amber-500 hover:bg-amber-400 active:bg-amber-600
                  disabled:bg-stone-700 disabled:cursor-not-allowed
                  text-stone-950 font-black text-base py-4 rounded-xl
                  transition-all duration-150 mt-2
                "
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Memproses Pesanan...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    Pesan Sekarang
                    <ChevronRight size={16} />
                  </>
                )}
              </button>

              {/* Trust signals */}
              <div className="mt-5 pt-4 border-t border-stone-800 flex flex-col gap-2">
                {[
                  { icon: '🔒', text: 'Data kamu aman & terenkripsi' },
                  { icon: '📦', text: 'Konfirmasi otomatis via WhatsApp' },
                  { icon: '✨', text: 'Dibuat fresh setiap pagi' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2">
                    <span className="text-sm">{icon}</span>
                    <span className="text-xs text-stone-500">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}