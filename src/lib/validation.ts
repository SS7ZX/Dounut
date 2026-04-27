// =============================================================================
// src/lib/validation.ts
// NOSTIMO — Form Validation Logic
//
// Dipisah dari komponen agar bisa di-unit-test secara independen.
// Semua rule validasi ada di satu tempat — tidak tersebar di komponen.
// =============================================================================

import type { CustomerDetails, CheckoutFormErrors } from '@/types';

/** Regex untuk nomor WA Indonesia: 08xx atau +628xx */
const WA_REGEX = /^(\+62|62|0)[0-9]{8,13}$/;

/**
 * validateCheckoutForm
 * Returns object errors — empty object berarti valid.
 */
export function validateCheckoutForm(
  values: CustomerDetails
): CheckoutFormErrors {
  const errors: CheckoutFormErrors = {};

  // Name validation
  const name = values.name.trim();
  if (!name) {
    errors.name = 'Nama tidak boleh kosong.';
  } else if (name.length < 2) {
    errors.name = 'Nama minimal 2 karakter.';
  } else if (name.length > 100) {
    errors.name = 'Nama maksimal 100 karakter.';
  }

  // WhatsApp validation
  const wa = values.whatsapp.trim().replace(/[\s\-]/g, '');
  if (!wa) {
    errors.whatsapp = 'Nomor WhatsApp tidak boleh kosong.';
  } else if (!WA_REGEX.test(wa)) {
    errors.whatsapp = 'Format nomor tidak valid. Contoh: 08123456789';
  }

  // Address validation
  const address = values.address.trim();
  if (!address) {
    errors.address = 'Alamat tidak boleh kosong.';
  } else if (address.length < 10) {
    errors.address = 'Alamat terlalu singkat. Sertakan nama jalan & kelurahan.';
  }

  return errors;
}

/** Helper: cek apakah form valid (tidak ada error) */
export function isFormValid(errors: CheckoutFormErrors): boolean {
  return Object.keys(errors).length === 0;
}

/** Format nomor WA: pastikan dimulai dengan +62 untuk link wa.me */
export function formatWhatsappLink(raw: string): string {
  const clean = raw.trim().replace(/[\s\-]/g, '');
  if (clean.startsWith('0')) return '+62' + clean.slice(1);
  if (clean.startsWith('62')) return '+' + clean;
  return clean;
}

/** Format Rupiah — konsisten di seluruh app */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style:    'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Hitung summary cart */
export function calculateOrderSummary(items: { price: number; quantity: number }[]) {
  const subtotal   = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax_amount = Math.round(subtotal * 0.11); // PPN 11%
  const grand_total = subtotal + tax_amount;
  return { subtotal, tax_amount, grand_total };
}