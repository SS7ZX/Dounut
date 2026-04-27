/* ==========================================================================
 * src/middleware.ts
 * ULTIMATE ENTERPRISE SECURITY MIDDLEWARE
 * Fitur: Admin Protection, Customer Auth Routing, Security Headers
 * ========================================================================== */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Ambil Token Autentikasi dari Cookies (Simulasi)
  // Di dunia nyata, ini bisa didapat dari NextAuth / JWT / Supabase
  const adminToken = request.cookies.get('admin_token')?.value;
  const customerToken = request.cookies.get('customer_token')?.value;

  // 2. Definisikan Kategori Rute (Route Grouping)
  const isAdminRoute = pathname.startsWith('/admin');
  const isAdminLogin = pathname === '/admin/login';
  
  const isCustomerAuthRoute = pathname === '/login' || pathname === '/register';
  // Daftar rute yang mewajibkan pelanggan login (misal: checkout, profil, riwayat pesanan)
  const isProtectedCustomerRoute = pathname.startsWith('/checkout') || pathname.startsWith('/profile');

  // Siapkan objek response dasar agar kita bisa menyisipkan Security Headers nanti
  const response = NextResponse.next();

  /* ==========================================================
   * A. LOGIKA KEAMANAN ADMIN
   * ========================================================== */
  if (isAdminRoute) {
    // 1. Jika mencoba masuk area admin (selain halaman login) TAPI belum login
    if (!adminToken && !isAdminLogin) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname); // Simpan rute tujuan
      return NextResponse.redirect(loginUrl);
    }
    // 2. Jika SUDAH login admin, tapi mencoba buka halaman login lagi
    if (adminToken && isAdminLogin) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  /* ==========================================================
   * B. LOGIKA KEAMANAN PELANGGAN (CUSTOMER)
   * ========================================================== */
  // 1. Jika pelanggan belum login, mencoba masuk ke halaman Checkout/Profil
  if (isProtectedCustomerRoute && !customerToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname); // Simpan rute agar bisa kembali setelah login
    return NextResponse.redirect(loginUrl);
  }

  // 2. Jika pelanggan SUDAH login, tapi iseng buka halaman /login atau /register
  if (isCustomerAuthRoute && customerToken) {
    // Arahkan kembali ke halaman depan atau katalog
    return NextResponse.redirect(new URL('/', request.url));
  }

  /* ==========================================================
   * C. INJEKSI SECURITY HEADERS (ENTERPRISE STANDARD)
   * ========================================================== */
  // Mencegah serangan Clickjacking (iframe embed dari situs jahat)
  response.headers.set('X-Frame-Options', 'DENY');
  // Memaksa browser tidak menebak-nebak tipe file (mencegah eksploitasi MIME)
  response.headers.set('X-Content-Type-Options', 'nosniff');
  // Mengaktifkan filter Cross-Site Scripting (XSS) bawaan browser
  response.headers.set('X-XSS-Protection', '1; mode=block');
  // Membatasi informasi referer saat user klik link keluar dari situsmu
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

/* ==========================================================
 * D. SMART MATCHER CONFIGURATION
 * ========================================================== */
export const config = {
  // Middleware HANYA akan berjalan pada rute aplikasi, dan akan otomatis 
  // MENGABAIKAN file statis (gambar, CSS, JS internal Next.js) agar web tetap kencang.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.webp|.*\\.svg).*)',
  ],
};