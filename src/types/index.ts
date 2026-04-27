// src/types/index.ts — NOSTIMO Master Types

import React from 'react';

export type OrderStatus   = 'pending'|'confirmed'|'processing'|'ready'|'delivered'|'cancelled';
export type UserRole      = 'customer'|'admin';
export type ProductBadge  = 'best_seller'|'new'|'limited'|'sold_out';

export interface Profile {
  id:         string;
  full_name:  string;
  whatsapp:   string | null;
  avatar_url: string | null;
  role:       UserRole;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id:           number;
  name:         string;
  description:  string;
  price:        number;
  image_url:    string;
  badge:        ProductBadge | null;
  category:     string;
  is_available: boolean;
  stock:        number;
  sort_order:   number;
  created_at:   string;
  updated_at:   string;
}

export interface CartItem {
  id:       number;
  name:     string;
  price:    number;
  quantity: number;
  image:    string;
}

export interface CartStore {
  cart:           CartItem[];
  addItem:        (item: CartItem) => void;
  removeItem:     (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart:      () => void;
}

export interface Order {
  id:                 string;
  user_id:            string | null;
  customer_name:      string;
  customer_whatsapp:  string;
  customer_address:   string;
  customer_note:      string | null;
  subtotal:           number;
  tax_amount:         number;
  grand_total:        number;
  status:             OrderStatus;
  created_at:         string;
  updated_at:         string;
}

export interface OrderItem {
  id:            number;
  order_id:      string;
  product_id:    number;
  product_name:  string;
  product_image: string;
  unit_price:    number;
  quantity:      number;
  line_total:    number;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

export interface CreateOrderPayload {
  user_id?:           string;
  customer_name:      string;
  customer_whatsapp:  string;
  customer_address:   string;
  customer_note:      string;
  subtotal:           number;
  tax_amount:         number;
  grand_total:        number;
}

export interface CustomerDetails {
  name:     string;
  whatsapp: string;
  address:  string;
  note?:    string;
}

export interface CheckoutFormErrors {
  name?:     string;
  whatsapp?: string;
  address?:  string;
}

export type CheckoutStep = 'form'|'submitting'|'success'|'error';

export interface CheckoutState {
  step: CheckoutStep;
  orderId: string | null;
  errorMsg: string | null;
}

export interface NavLink {
  label: string;
  href:  string;
  icon?: React.ReactNode;
}