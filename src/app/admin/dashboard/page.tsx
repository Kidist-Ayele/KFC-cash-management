'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/shared/Header';
import { ExecutiveMetricsCards } from '@/components/admin/ExecutiveMetricsCards';
import { ExecutivePaymentChannels } from '@/components/admin/ExecutivePaymentChannels';
import { CategorySalesChart } from '@/components/admin/CategorySalesChart';
import { CashierShiftAuditCard } from '@/components/admin/CashierShiftAuditCard';
import { RecentOrdersLedger } from '@/components/admin/RecentOrdersLedger';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'all'>('today');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [telegramStatus, setTelegramStatus] = useState<string | null>(null);
  const [isSendingTelegram, setIsSendingTelegram] = useState(false);

  const fetchDashboardData = useCallback(async (selectedPeriod: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/dashboard?period=${selectedPeriod}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData(period);
  }, [period, fetchDashboardData]);

  // Quick Action: Send Telegram Report from Executive Dashboard
  const handleQuickTelegramReport = async () => {
    setIsSendingTelegram(true);
    setTelegramStatus(null);
    try {
      const reportRes = await fetch('/api/reports/daily');
      if (!reportRes.ok) throw new Error('Failed to generate report');
      const reportJson = await reportRes.json();

      const sendRes = await fetch('/api/reports/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: reportJson.message }),
      });

      const sendJson = await sendRes.json();
      if (sendRes.ok && sendJson.success) {
        setTelegramStatus('Report sent to Telegram!');
        setTimeout(() => setTelegramStatus(null), 3500);
      } else {
        alert(sendJson.error || 'Failed to dispatch to Telegram');
      }
    } catch (e: any) {
      alert(e.message || 'Error sending Telegram report');
    } finally {
      setIsSendingTelegram(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      <Header role="admin" />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Top Header & Timeframe Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Executive Command Center
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Live financial oversight, cashier drawers, and operational performance
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Timeframe Filter Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs font-semibold">
              {(['today', 'week', 'month', 'all'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPeriod(tab)}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    period === tab
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'today'
                    ? 'Today'
                    : tab === 'week'
                    ? 'This Week'
                    : tab === 'month'
                    ? 'This Month'
                    : 'All Time'}
                </button>
              ))}
            </div>

            {/* Telegram Dispatch Button */}
            <button
              onClick={handleQuickTelegramReport}
              disabled={isSendingTelegram}
              className="px-3.5 py-2 bg-[#229ED9] hover:bg-[#1E88E5] text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <span>{isSendingTelegram ? 'Sending...' : 'Send Daily Report'}</span>
            </button>

            {telegramStatus && (
              <span className="text-xs font-bold text-emerald-600 animate-fade-in">
                ✓ {telegramStatus}
              </span>
            )}
          </div>
        </div>

        {/* Loading Spinner / State */}
        {isLoading && !data ? (
          <div className="p-16 text-center text-gray-400 text-sm">
            Loading executive metrics from database...
          </div>
        ) : (
          data && (
            <>
              {/* Executive Metrics Cards */}
              <ExecutiveMetricsCards
                totalRevenue={data.summary.totalRevenue}
                netProfit={data.summary.netProfit}
                totalExpenses={data.summary.totalExpenses}
                totalOrders={data.summary.totalOrders}
                totalTips={data.summary.totalTips}
                activeStaff={data.summary.activeStaff}
              />

              {/* 2-Column Analytics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <ExecutivePaymentChannels
                  channels={data.channels}
                  totalRevenue={data.summary.totalRevenue}
                />
                <CategorySalesChart
                  categoryBreakdown={data.categoryBreakdown}
                  topDishes={data.topDishes}
                />
              </div>

              {/* Cashier Shift Audit & Over/Short Reconciliation */}
              <CashierShiftAuditCard shifts={data.recentShifts} />

              {/* Recent Orders Ledger Stream */}
              <RecentOrdersLedger orders={data.recentOrders} />

              {/* Quick Navigation Footer */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <Link
                  href="/admin/transactions"
                  className="p-4 bg-white rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-xs transition-all flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">All Transactions</h4>
                    <p className="text-xs text-gray-500">Search and export order history</p>
                  </div>
                  <span className="text-gray-400 text-lg">→</span>
                </Link>

                <Link
                  href="/admin/users"
                  className="p-4 bg-white rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-xs transition-all flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">User Management</h4>
                    <p className="text-xs text-gray-500">Manage cashiers, managers & roles</p>
                  </div>
                  <span className="text-gray-400 text-lg">→</span>
                </Link>

                <Link
                  href="/admin/settings"
                  className="p-4 bg-white rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-xs transition-all flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">System Settings</h4>
                    <p className="text-xs text-gray-500">Configure VAT, telegram, & accounts</p>
                  </div>
                  <span className="text-gray-400 text-lg">→</span>
                </Link>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}
