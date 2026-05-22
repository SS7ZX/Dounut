// src/app/admin/login/page.tsx
// Admin login — wraps AdminLoginContent with Suspense boundary
// Redirect setelah login: /admin/dashboard (bukan callbackUrl NextAuth)

import { Suspense } from 'react';
import { Loader2 }  from 'lucide-react';
import AdminLoginContent from './AdminLoginContent';

export const metadata = { title: 'Admin Login | Nostimo' };

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <Loader2 size={28} className="text-amber-500 animate-spin" />
      </div>
    }>
      <AdminLoginContent redirectTo="/admin/dashboard" />
    </Suspense>
  );
}