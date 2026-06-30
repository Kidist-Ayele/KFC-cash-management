'use client';

import { create } from 'zustand';
import { CartItem, OrderSummary } from '@/types';
import { calculateVAT, calculateTotal } from '@/lib/utils';
import { VAT_RATE } from '@/constants/payment';

interface OrderState {
  items: CartItem[];
  addItem: (item: CartItem['menuItem']) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getOrderSummary: () => OrderSummary;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  items: [],

  addItem: (menuItem) => {
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.menuItem.id === menuItem.id
      );

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.menuItem.id === menuItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        items: [...state.items, { menuItem, quantity: 1 }],
      };
    });
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.menuItem.id !== itemId),
    }));
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }

    set((state) => ({
      items: state.items.map((item) =>
        item.menuItem.id === itemId ? { ...item, quantity } : item
      ),
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  getOrderSummary: () => {
    const items = get().items;
    const subtotal = items.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );
    const vat = calculateVAT(subtotal, VAT_RATE);
    const total = calculateTotal(subtotal, VAT_RATE);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return { subtotal, vat, total, itemCount };
  },
}));
