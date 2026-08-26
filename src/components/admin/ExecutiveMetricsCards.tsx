'use client';

import { formatCurrency } from '@/lib/utils';

interface ExecutiveMetricsCardsProps {
  totalRevenue: number;
  netProfit: number;
  totalExpenses: number;
  totalOrders: number;
  totalTips: number;
  activeStaff: number;
}

export function ExecutiveMetricsCards({
  totalRevenue,
  netProfit,
  totalExpenses,
  totalOrders,
  totalTips,
  activeStaff,
}: ExecutiveMetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-6">
      {/* Gross Revenue */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 shadow-xs hover:border-gray-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gross Revenue</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
            $
          </div>
        </div>
        <p className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          {formatCurrency(totalRevenue)}
        </p>
        <p className="text-[11px] text-gray-400 mt-1">Paid orders total</p>
      </div>

      {/* Net Profit */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 shadow-xs hover:border-gray-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Net Cash Flow</span>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
            netProfit >= 0 ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
          }`}>
            ⚖
          </div>
        </div>
        <p className={`text-xl sm:text-2xl font-black tracking-tight ${
          netProfit >= 0 ? 'text-blue-600' : 'text-red-600'
        }`}>
          {formatCurrency(netProfit)}
        </p>
        <p className="text-[11px] text-gray-400 mt-1">Revenue – Expenses</p>
      </div>

      {/* Total Expenses */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 shadow-xs hover:border-gray-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Expenses</span>
          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm">
            ↓
          </div>
        </div>
        <p className="text-xl sm:text-2xl font-black text-red-600 tracking-tight">
          {formatCurrency(totalExpenses)}
        </p>
        <p className="text-[11px] text-gray-400 mt-1">Logged operational costs</p>
      </div>

      {/* Total Orders */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 shadow-xs hover:border-gray-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Orders</span>
          <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm">
            #
          </div>
        </div>
        <p className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          {totalOrders}
        </p>
        <p className="text-[11px] text-gray-400 mt-1">Completed bills</p>
      </div>

      {/* Total Tips */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 shadow-xs hover:border-gray-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Waiter Tips</span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
            ★
          </div>
        </div>
        <p className="text-xl sm:text-2xl font-black text-amber-700 tracking-tight">
          {formatCurrency(totalTips)}
        </p>
        <p className="text-[11px] text-gray-400 mt-1">Customer tips recorded</p>
      </div>

      {/* Active Staff */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 shadow-xs hover:border-gray-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Staff</span>
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
            👥
          </div>
        </div>
        <p className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          {activeStaff}
        </p>
        <p className="text-[11px] text-gray-400 mt-1">Cashiers & Waiters</p>
      </div>
    </div>
  );
}
