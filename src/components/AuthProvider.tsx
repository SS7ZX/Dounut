// src/components/AuthProvider.tsx
// SAFE VERSION — tidak ada CartProvider di sini
// Cart dihandle Zustand di src/store/cartStore.ts

'use client';

import React from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // No-op: hanya pass-through. Tidak wrap CartProvider.
  // Cart state = Zustand useCartStore(), bukan Context.
  return <>{children}</>;
}

export default AuthProvider;