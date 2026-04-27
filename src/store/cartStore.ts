// src/store/cartStore.ts — NOSTIMO Cart State (Zustand)

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, CartStore } from '@/types';

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],

      addItem: (item: CartItem) =>
        set((state) => {
          const existing = state.cart.find((i) => i.id === item.id);
          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { cart: [...state.cart, item] };
        }),

      removeItem: (id: number) =>
        set((state) => ({ cart: state.cart.filter((i) => i.id !== id) })),

      updateQuantity: (id: number, quantity: number) =>
        set((state) => ({
          cart: quantity <= 0
            ? state.cart.filter((i) => i.id !== id)
            : state.cart.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'nostimo-cart',
      // Only persist cart array, not actions
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);