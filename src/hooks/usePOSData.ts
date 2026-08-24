import { useState, useCallback, useEffect } from 'react';
import type { Category } from '@prisma/client';

export interface Transaction {
  id: string;
  time: string;
  items: string;
  orderNumber: string;
  amount: number;
  amountPaid?: number;
  tip?: number;
  status: 'Paid' | 'Unpaid';
  waiter: string;
  paymentChannel?: string;
}

export interface MenuItemData {
  id: string;
  name: string;
  price: number;
  category: Category;
}

export interface WaiterItem {
  id: string;
  name: string;
  phone?: string;
}

export function usePOSData() {
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const [waiters, setWaiters] = useState<WaiterItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const mapOrderToTransaction = (order: any): Transaction => {
    const itemsList =
      order.orderItems && order.orderItems.length > 0
        ? order.orderItems
            .map((oi: any) => `${oi.quantity}x ${oi.menuItem?.name || 'Item'}`)
            .join(', ')
        : 'Order';
    const createdAt = new Date(order.createdAt);
    const timeStr = createdAt.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return {
      id: order.id,
      time: timeStr,
      items: itemsList,
      orderNumber: order.orderNumber,
      amount: order.total,
      amountPaid: order.amountPaid ?? order.total,
      tip: order.tip ?? 0,
      status: order.status === 'PAID' ? 'Paid' : 'Unpaid',
      waiter: order.waiter || 'Desalegn',
      paymentChannel: order.paymentChannel || undefined,
    };
  };

  const fetchMenuItems = useCallback(async () => {
    try {
      const res = await fetch('/api/menu');
      if (res.ok) setMenuItems(await res.json());
    } catch (err) {
      console.error('Failed to fetch menu:', err);
    }
  }, []);

  const fetchWaiters = useCallback(async () => {
    try {
      const res = await fetch('/api/waiters');
      if (res.ok) setWaiters(await res.json());
    } catch (err) {
      console.error('Failed to fetch waiters:', err);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.map(mapOrderToTransaction));
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchMenuItems(), fetchWaiters(), fetchOrders()]).finally(() =>
      setIsLoading(false)
    );
  }, [fetchMenuItems, fetchWaiters, fetchOrders]);

  const addTransaction = (order: any) => {
    setTransactions((prev) => [mapOrderToTransaction(order), ...prev]);
  };

  const updateTransaction = (updatedOrder: any) => {
    const mapped = mapOrderToTransaction(updatedOrder);
    setTransactions((prev) => prev.map((t) => (t.id === mapped.id ? mapped : t)));
  };

  const removeTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const addWaiter = (newWaiter: WaiterItem) => {
    setWaiters((prev) => [...prev, newWaiter]);
  };

  return {
    menuItems,
    waiters,
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    removeTransaction,
    addWaiter,
  };
}
