'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/shared/Header';
import { formatCurrency } from '@/lib/utils';
import { FoodIllustration } from '@/components/shared/FoodIllustration';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/dashboard?period=${period}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAnalytics();
  }, [period]);

  const totalRev = data?.summary?.totalRevenue || 0;
  const totalOrders = data?.summary?.totalOrders || 0;
  const avgTicket = totalOrders > 0 ? totalRev / totalOrders : 0;
  const totalExpenses = data?.summary?.totalExpenses || 0;
  const netIncome = totalRev - totalExpenses;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      <Header role="admin" />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Business Intelligence & Analytics
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Performance metrics for Kuku Fried Chicken — Main Branch (Ayat)
            </p>
          </div>

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
        </div>

        {/* High-Level Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs">
            <span className="text-xs font-medium text-gray-500">Gross Sales</span>
            <p className="text-2xl font-black text-gray-900 mt-1">{formatCurrency(totalRev)}</p>
            <span className="text-[11px] text-emerald-600 font-semibold">{totalOrders} completed orders</span>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs">
            <span className="text-xs font-medium text-gray-500">Average Ticket</span>
            <p className="text-2xl font-black text-blue-600 mt-1">{formatCurrency(avgTicket)}</p>
            <span className="text-[11px] text-gray-400">Per order average</span>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs">
            <span className="text-xs font-medium text-gray-500">Expenses Deducted</span>
            <p className="text-2xl font-black text-red-600 mt-1">{formatCurrency(totalExpenses)}</p>
            <span className="text-[11px] text-gray-400">Petty cash costs</span>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs">
            <span className="text-xs font-medium text-gray-500">Net Profit</span>
            <p className={`text-2xl font-black mt-1 ${netIncome >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatCurrency(netIncome)}
            </p>
            <span className="text-[11px] text-gray-400">After operational expenses</span>
          </div>
        </div>

        {/* 2-Column Analytics Details */}
        {isLoading ? (
          <div className="p-16 text-center text-gray-400 text-xs">Computing analytics...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Performance */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs">
              <h3 className="text-base font-bold text-gray-900 mb-1">Sales by Food Category</h3>
              <p className="text-xs text-gray-500 mb-4">Volume and gross revenue per menu section</p>

              {data?.categoryBreakdown && data.categoryBreakdown.length > 0 ? (
                <div className="space-y-3">
                  {data.categoryBreakdown.map((cat: any) => (
                    <div key={cat.category} className="p-3 rounded-lg border border-gray-100 bg-gray-50/60">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <FoodIllustration category={cat.category} className="w-4 h-4 text-gray-700" />
                          <span className="text-xs font-bold text-gray-900">{cat.category}</span>
                        </div>
                        <span className="text-xs font-black text-gray-900">
                          {formatCurrency(cat.revenue)} ({cat.percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#E4002B] h-full rounded-full"
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-xs text-gray-400">No category sales recorded.</p>
              )}
            </div>

            {/* Top Menu Items */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs">
              <h3 className="text-base font-bold text-gray-900 mb-1">Top Selling Menu Items</h3>
              <p className="text-xs text-gray-500 mb-4">Most ordered dishes at Ayat Branch</p>

              {data?.topDishes && data.topDishes.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {data.topDishes.map((dish: any, idx: number) => (
                    <div key={dish.name} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-5 text-xs font-bold text-gray-400">#{idx + 1}</span>
                        <div>
                          <p className="text-xs font-bold text-gray-900">{dish.name}</p>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                            {dish.category}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-gray-900">{formatCurrency(dish.revenue)}</p>
                        <span className="text-[11px] text-emerald-600 font-semibold">{dish.quantity} sold</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-xs text-gray-400">No dishes recorded.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
