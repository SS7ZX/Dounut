// src/lib/supabase.ts — NOSTIMO Supabase Client & Services

import { createClient } from '@supabase/supabase-js';
import type { CartItem, CreateOrderPayload, Order, OrderWithItems, Product, Profile } from '@/types';

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!url || !anon) throw new Error('[Nostimo] Missing Supabase env vars');

export const supabase = createClient(url, anon);

// ---------------------------------------------------------------------------
// AUTH SERVICE
// ---------------------------------------------------------------------------
export const AuthService = {
  async signUp(email: string, password: string, fullName: string, whatsapp: string) {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName, whatsapp } },
    });
    return { data, error: error?.message ?? null };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error: error?.message ?? null };
  },

  async signOut() {
    await supabase.auth.signOut();
  },

  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  async getProfile(userId: string): Promise<Profile | null> {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return data as Profile | null;
  },
};

// ---------------------------------------------------------------------------
// PRODUCT SERVICE
// ---------------------------------------------------------------------------
export const ProductService = {
  async getAll(): Promise<{ data: Product[]; error: string | null }> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .order('sort_order');
    return { data: (data ?? []) as Product[], error: error?.message ?? null };
  },

  async getById(id: number): Promise<{ data: Product | null; error: string | null }> {
    const { data, error } = await supabase
      .from('products').select('*').eq('id', id).single();
    return { data: data as Product | null, error: error?.message ?? null };
  },

  // Admin only
  async getAllAdmin(): Promise<{ data: Product[]; error: string | null }> {
    const { data, error } = await supabase
      .from('products').select('*').order('sort_order');
    return { data: (data ?? []) as Product[], error: error?.message ?? null };
  },

  async create(product: Omit<Product, 'id'|'created_at'|'updated_at'>) {
    const { data, error } = await supabase.from('products').insert([product]).select().single();
    return { data: data as Product | null, error: error?.message ?? null };
  },

  async update(id: number, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products').update(updates).eq('id', id).select().single();
    return { data: data as Product | null, error: error?.message ?? null };
  },

  async toggle(id: number, is_available: boolean) {
    return ProductService.update(id, { is_available });
  },
};

// ---------------------------------------------------------------------------
// ORDER SERVICE
// ---------------------------------------------------------------------------
export const OrderService = {
  async createOrder(payload: CreateOrderPayload, items: CartItem[]) {
    const { data: order, error: oErr } = await supabase
      .from('orders').insert([payload]).select().single();
    if (oErr) return { data: null, error: 'Gagal membuat order. Coba lagi.' };

    const itemsPayload = items.map(i => ({
      order_id: order.id, product_id: i.id, product_name: i.name,
      product_image: i.image, unit_price: i.price,
      quantity: i.quantity, line_total: i.price * i.quantity,
    }));

    const { error: iErr } = await supabase.from('order_items').insert(itemsPayload);
    if (iErr) console.error('[OrderService] Items insert failed', iErr);

    return { data: order as Order, error: null };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('orders').select('*, order_items(*)').eq('id', id).single();
    return { data: data as OrderWithItems | null, error: error?.message ?? null };
  },

  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from('orders').select('*, order_items(*)').eq('user_id', userId).order('created_at', { ascending: false });
    return { data: (data ?? []) as OrderWithItems[], error: error?.message ?? null };
  },

  // Admin
  async getAll() {
    const { data, error } = await supabase
      .from('orders').select('*, order_items(*)')
      .order('created_at', { ascending: false });
    return { data: (data ?? []) as OrderWithItems[], error: error?.message ?? null };
  },

  async updateStatus(id: string, status: string) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    return { error: error?.message ?? null };
  },
};