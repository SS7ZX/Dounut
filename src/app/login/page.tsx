// src/app/login/page.tsx — NOSTIMO Login (FIXED)

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import LoginContent from './LoginContent';

export const metadata = { title: 'Login | Nostimo' };

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <Loader2 size={28} className="text-amber-500 animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}