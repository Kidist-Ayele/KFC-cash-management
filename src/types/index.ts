// Re-export Prisma types
export type {
  User,
  MenuItem,
  Order,
  OrderItem,
  ShiftReport,
  Expense,
  ExpenseCategory,
  Role,
  PaymentChannel,
  OrderStatus,
  Category,
  Shift,
} from '@prisma/client';

// Frontend-specific types
export interface CartItem {
  menuItem: {
    id: string;
    name: string;
    price: number;
    category: Category;
  };
  quantity: number;
}

export interface OrderSummary {
  subtotal: number;
  vat: number;
  total: number;
  itemCount: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topSellingItems: {
    name: string;
    quantity: number;
    revenue: number;
  }[];
}

export interface ShiftInfo {
  shift: 'MORNING' | 'AFTERNOON' | 'EVENING';
  cashier: string;
  status: 'Active' | 'Inactive';
}

// Import Category from Prisma for type safety
import type { Category } from '@prisma/client';
