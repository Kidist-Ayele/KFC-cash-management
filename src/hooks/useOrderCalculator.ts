'use client';

import { useMemo } from 'react';
import { CartItem } from '@/types';
import { calculateVAT, calculateTotal } from '@/lib/utils';
import { VAT_RATE } from '@/constants/payment';

export function useOrderCalculator(items: CartItem[]) {
  const calculations = useMemo(() => {
    const total = items.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );
    
    // Prices are VAT inclusive (15% included)
    const vat = Math.round((total * 15 / 115) * 100) / 100;
    const subtotal = Math.round((total - vat) * 100) / 100;
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    
    const itemBreakdown = items.map((item) => ({
      name: item.menuItem.name,
      quantity: item.quantity,
      unitPrice: item.menuItem.price,
      lineTotal: item.menuItem.price * item.quantity,
    }));

    return {
      subtotal,
      vat,
      total,
      itemCount,
      vatRate: VAT_RATE,
      itemBreakdown,
    };
  }, [items]);

  return calculations;
}
