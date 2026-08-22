'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/shared/Header';
import { DailySummaryCards } from '@/components/dailylog/DailySummaryCards';
import { PaymentBreakdownChart } from '@/components/dailylog/PaymentBreakdownChart';
import { WaiterPerformanceCard } from '@/components/dailylog/WaiterPerformanceCard';
import { DailyTransactionsTable } from '@/components/dailylog/DailyTransactionsTable';

interface Transaction {
  id: string;
  time: string;
  items: string;
  orderNumber: string;
  amount: number;
  status: 'Paid' | 'Unpaid';
  waiter: string;
  paymentChannel?: string;
}

export default function DailyLogPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const mapOrderToTransaction = (order: any): Transaction => {
    const itemsList = order.orderItems && order.orderItems.length > 0
      ? order.orderItems.map((oi: any) => `${oi.quantity}x ${oi.menuItem?.name || 'Item'}`).join(', ')
      : 'Order';
    const createdAt = new Date(order.createdAt);
    const timeStr = createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    return {
      id: order.id,
      time: timeStr,
      items: itemsList,
      orderNumber: order.orderNumber,
      amount: order.total,
      status: order.status === 'PAID' ? 'Paid' : 'Unpaid',
      waiter: order.waiter || 'Desalegn',
      paymentChannel: order.paymentChannel || undefined,
    };
  };

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.map(mapOrderToTransaction));
      }
    } catch (err) {
      console.error('Failed to fetch daily orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Calculate summary stats
  const totalRevenue = transactions
    .filter(t => t.status === 'Paid')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalOrders = transactions.length;
  
  const cashRevenue = transactions
    .filter(t => t.paymentChannel === 'CASH' && t.status === 'Paid')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const digitalRevenue = transactions
    .filter(t => t.paymentChannel !== 'CASH' && t.status === 'Paid')
    .reduce((sum, t) => sum + t.amount, 0);

  // Payment breakdown
  const paymentBreakdown = [
    {
      channel: 'TELEBIRR',
      amount: transactions.filter(t => t.paymentChannel === 'TELEBIRR').reduce((sum, t) => sum + t.amount, 0),
      count: transactions.filter(t => t.paymentChannel === 'TELEBIRR').length,
      percentage: 0,
    },
    {
      channel: 'KUKU_CBE',
      amount: transactions.filter(t => t.paymentChannel === 'KUKU_CBE').reduce((sum, t) => sum + t.amount, 0),
      count: transactions.filter(t => t.paymentChannel === 'KUKU_CBE').length,
      percentage: 0,
    },
    {
      channel: 'SAMUEL_CBE',
      amount: transactions.filter(t => t.paymentChannel === 'SAMUEL_CBE').reduce((sum, t) => sum + t.amount, 0),
      count: transactions.filter(t => t.paymentChannel === 'SAMUEL_CBE').length,
      percentage: 0,
    },
    {
      channel: 'CASH',
      amount: cashRevenue,
      count: transactions.filter(t => t.paymentChannel === 'CASH').length,
      percentage: 0,
    },
  ].map(item => ({
    ...item,
    percentage: totalRevenue > 0 ? (item.amount / totalRevenue) * 100 : 0,
  }));

  // Waiter performance
  const waiterStats = [
    {
      name: 'Desalegn',
      orders: transactions.filter(t => t.waiter === 'Desalegn').length,
      revenue: transactions.filter(t => t.waiter === 'Desalegn').reduce((sum, t) => sum + t.amount, 0),
    },
    {
      name: 'Marta',
      orders: transactions.filter(t => t.waiter === 'Marta').length,
      revenue: transactions.filter(t => t.waiter === 'Marta').reduce((sum, t) => sum + t.amount, 0),
    },
  ].sort((a, b) => b.revenue - a.revenue);

  const handleExport = () => {
    alert('Exporting to CSV... (Feature coming soon)');
  };

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header role="cashier" />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <DailySummaryCards
            totalRevenue={totalRevenue}
            totalOrders={totalOrders}
            cashRevenue={cashRevenue}
            digitalRevenue={digitalRevenue}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <PaymentBreakdownChart breakdown={paymentBreakdown} />
            <WaiterPerformanceCard waiters={waiterStats} />
          </div>

          <DailyTransactionsTable
            transactions={transactions}
            onExport={handleExport}
          />
        </div>
      </div>
    </>
  );
}
