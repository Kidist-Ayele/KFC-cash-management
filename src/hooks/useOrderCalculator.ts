'use client';

import { useMemo } from 'react';
import { CartItem } from '@/types';
import { calculateVAT, calculateTotal } from '@/lib/utils';
import { VAT_RATE } from '@/constants/payment';

export function useOrderCalculator(items: CartItem[]) {
  const calculations = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );
    
    const vat = calculateVAT(subtotal, VAT_RATE);
    const total = calculateTotal(subtotal, VAT_RATE);
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
