import { pgTable, serial, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: integer('price').notNull(), // Store in Rupiah (or base currency)
  stockQuantity: integer('stock_quantity').notNull().default(0),
  imageUrl: text('image_url'),
  isAvailable: boolean('is_available').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  pickupTime: timestamp('pickup_time').notNull(),
  totalAmount: integer('total_amount').notNull(),
  orderNotes: text('order_notes'),
  status: text('status').default('PENDING'), // PENDING | READY | COMPLETED | CANCELLED
  isPaid: boolean('is_paid').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull(),
  priceAtPurchase: integer('price_at_purchase').notNull(),
});