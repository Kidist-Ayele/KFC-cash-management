'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/shared/Header';
import { DailySummaryCards } from '@/components/dailylog/DailySummaryCards';
import { PaymentBreakdownChart } from '@/components/dailylog/PaymentBreakdownChart';
import { WaiterPerformanceCard } from '@/components/dailylog/WaiterPerformanceCard';
import { DailyTransactionsTable } from '@/components/dailylog/DailyTransactionsTable';
import { FoodSalesBreakdown } from '@/components/dailylog/FoodSalesBreakdown';
import { SendReportModal } from '@/components/dailylog/SendReportModal';

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
  const [reportData, setReportData] = useState<any>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const mapOrderToTransaction = (order: any): Transaction => {
    const itemsList =
      order.orderItems && order.orderItems.length > 0
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

  const fetchDailyLog = useCallback(async () => {
    try {
      const [ordersRes, reportRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/reports/daily'),
      ]);

      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setTransactions(data.map(mapOrderToTransaction));
      }

      if (reportRes.ok) {
        const rep = await reportRes.json();
        setReportData(rep);
      }
    } catch (err) {
      console.error('Failed to fetch daily orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDailyLog();
  }, [fetchDailyLog]);

  // Summary stats
  const totalRevenue = transactions
    .filter((t) => t.status === 'Paid')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOrders = transactions.length;

  const cashRevenue = transactions
    .filter((t) => t.paymentChannel === 'CASH' && t.status === 'Paid')
    .reduce((sum, t) => sum + t.amount, 0);

  const digitalRevenue = transactions
    .filter((t) => t.paymentChannel !== 'CASH' && t.status === 'Paid')
    .reduce((sum, t) => sum + t.amount, 0);

  // Payment breakdown
  const paymentBreakdown = [
    {
      channel: 'TELEBIRR',
      amount: transactions
        .filter((t) => t.paymentChannel === 'TELEBIRR' && t.status === 'Paid')
        .reduce((sum, t) => sum + t.amount, 0),
      count: transactions.filter((t) => t.paymentChannel === 'TELEBIRR').length,
      percentage: 0,
    },
    {
      channel: 'KUKU_CBE',
      amount: transactions
        .filter((t) => t.paymentChannel === 'KUKU_CBE' && t.status === 'Paid')
        .reduce((sum, t) => sum + t.amount, 0),
      count: transactions.filter((t) => t.paymentChannel === 'KUKU_CBE').length,
      percentage: 0,
    },
    {
      channel: 'SAMUEL_CBE',
      amount: transactions
        .filter((t) => t.paymentChannel === 'SAMUEL_CBE' && t.status === 'Paid')
        .reduce((sum, t) => sum + t.amount, 0),
      count: transactions.filter((t) => t.paymentChannel === 'SAMUEL_CBE').length,
      percentage: 0,
    },
    {
      channel: 'CASH',
      amount: cashRevenue,
      count: transactions.filter((t) => t.paymentChannel === 'CASH').length,
      percentage: 0,
    },
  ].map((item) => ({
    ...item,
    percentage: totalRevenue > 0 ? (item.amount / totalRevenue) * 100 : 0,
  }));

  // Waiter performance
  const waiterStatsMap: Record<string, { orders: number; revenue: number }> = {};
  transactions
    .filter((t) => t.status === 'Paid')
    .forEach((t) => {
      const name = t.waiter || 'Unassigned';
      if (!waiterStatsMap[name]) {
        waiterStatsMap[name] = { orders: 0, revenue: 0 };
      }
      waiterStatsMap[name].orders += 1;
      waiterStatsMap[name].revenue += t.amount;
    });

  const waiterStats = Object.entries(waiterStatsMap)
    .map(([name, stat]) => ({
      name,
      orders: stat.orders,
      revenue: stat.revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        <Header role="cashier" />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Top Title Ribbon + Send Report Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Daily Log & Operations Summary</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Real-time snapshot of today&apos;s revenue, payment channels, and items sold
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSendModal(true)}
                className="px-4 py-2.5 bg-[#E4002B] hover:bg-[#C4002B] text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-2"
              >
                <span>Send Daily Report to Owner</span>
              </button>
            </div>
          </div>

          {/* Daily Summary Metric Cards */}
          <DailySummaryCards
            totalRevenue={totalRevenue}
            totalOrders={totalOrders}
            cashRevenue={cashRevenue}
            digitalRevenue={digitalRevenue}
          />

          {/* Food Sales Breakdown */}
          {reportData && <FoodSalesBreakdown foodSales={reportData.foodSalesList || []} />}

          {/* Charts & Performance Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <PaymentBreakdownChart breakdown={paymentBreakdown} />
            <WaiterPerformanceCard waiters={waiterStats} />
          </div>

          {/* Daily Transactions Table */}
          <DailyTransactionsTable
            transactions={transactions}
            onExport={() => alert('Exporting to CSV...')}
          />
        </div>
      </div>

      {/* Send Report Modal */}
      {reportData && (
        <SendReportModal
          isOpen={showSendModal}
          onClose={() => setShowSendModal(false)}
          reportText={reportData.message || ''}
          summary={reportData.summary}
        />
      )}
    </>
  );
}
