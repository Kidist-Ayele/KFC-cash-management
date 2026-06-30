'use client';

import { useState } from 'react';
import { CashierHeader } from '@/components/shared/CashierHeader';
import { DailySummaryCards } from '@/components/dailylog/DailySummaryCards';
import { PaymentBreakdownChart } from '@/components/dailylog/PaymentBreakdownChart';
import { WaiterPerformanceCard } from '@/components/dailylog/WaiterPerformanceCard';
import { DailyTransactionsTable } from '@/components/dailylog/DailyTransactionsTable';

// Mock data - will be replaced with real data from API
const mockTransactions = [
  {
    id: '1',
    time: '10:30 AM',
    items: '2x 12 Piece Bucket, 1x 5pc Strips',
    orderNumber: 'ORDER #9401',
    amount: 3550,
    status: 'Paid' as const,
    waiter: 'Desalegn',
    paymentChannel: 'TELEBIRR',
  },
  {
    id: '2',
    time: '11:15 AM',
    items: '1x Bucket for 2, 2x Coca-Cola',
    orderNumber: 'ORDER #9402',
    amount: 1150,
    status: 'Paid' as const,
    waiter: 'Marta',
    paymentChannel: 'CASH',
  },
  {
    id: '3',
    time: '12:00 PM',
    items: '3x Zinger Burger, 1x Fries',
    orderNumber: 'ORDER #9403',
    amount: 950,
    status: 'Unpaid' as const,
    waiter: 'Desalegn',
    paymentChannel: 'KUKU_CBE',
  },
];

export default function DailyLogPage() {
  const [transactions] = useState(mockTransactions);

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
        <CashierHeader 
          title="Daily Log" 
          subtitle="Complete overview of today's transactions and performance"
        />

        <div className="flex-1 overflow-y-auto p-6">
          <DailySummaryCards
            totalRevenue={totalRevenue}
            totalOrders={totalOrders}
            cashRevenue={cashRevenue}
            digitalRevenue={digitalRevenue}
          />

          <div className="grid grid-cols-2 gap-6 mb-6">
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
