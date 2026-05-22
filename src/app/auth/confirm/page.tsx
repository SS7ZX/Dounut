// src/app/auth/confirm/page.tsx
// Client-side handler untuk Supabase Implicit flow
// Membaca #access_token dari URL fragment dan set session

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import AuthConfirmContent from './AuthConfirmContent';

function LoadingState() {
  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center gap-4">
      <Loader2 size={32} className="text-amber-500 animate-spin" />
      <p className="text-sm text-stone-400 font-medium">Memverifikasi akun...</p>
    </div>
  );
}

export default function AuthConfirmPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AuthConfirmContent />
    </Suspense>
  );
}