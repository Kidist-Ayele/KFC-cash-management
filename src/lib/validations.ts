import { z } from 'zod';

// Order validations
export const OrderItemSchema = z.object({
  menuItemId: z.string(),
  quantity: z.number().min(1),
  price: z.number().positive(),
});

export const CreateOrderSchema = z.object({
  items: z.array(OrderItemSchema).min(1, 'Order must have at least one item'),
  paymentChannel: z.enum(['TELEBIRR', 'KUKU_CBE', 'SAMUEL_CBE', 'CASH']),
  userId: z.string(),
});

// Menu Item validations
export const MenuItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().positive('Price must be positive'),
  category: z.enum([
    'SHAWARMA',
    'ROASTED',
    'CRISPY',
    'BURGER',
    'FISH',
    'PIZZA',
    'DRINKS',
    'EXTRAS',
  ]),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  isAvailable: z.boolean().default(true),
});

// User validations
export const UserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['CASHIER', 'MANAGER', 'ADMIN']).default('CASHIER'),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Transaction filter validations
export const TransactionFilterSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  status: z.enum(['PAID', 'UNPAID', 'CANCELLED']).optional(),
  paymentChannel: z.enum(['TELEBIRR', 'KUKU_CBE', 'SAMUEL_CBE', 'CASH']).optional(),
  shift: z.enum(['MORNING', 'AFTERNOON', 'EVENING']).optional(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type MenuItemInput = z.infer<typeof MenuItemSchema>;
export type UserInput = z.infer<typeof UserSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type TransactionFilterInput = z.infer<typeof TransactionFilterSchema>;
