'use client';

import { formatCurrency } from '@/lib/utils';

interface DailySummaryCardsProps {
  totalRevenue: number;
  totalOrders: number;
  cashRevenue: number;
  digitalRevenue: number;
}

export function DailySummaryCards({
  totalRevenue,
  totalOrders,
  cashRevenue,
  digitalRevenue,
}: DailySummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs sm:text-sm font-medium text-gray-600">Total Revenue</h3>
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
        <p className="text-xs text-gray-500 mt-1">Today's total sales</p>
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs sm:text-sm font-medium text-gray-600">Total Orders</h3>
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{totalOrders}</p>
        <p className="text-xs text-gray-500 mt-1">Completed transactions</p>
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs sm:text-sm font-medium text-gray-600">Cash Payments</h3>
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{formatCurrency(cashRevenue)}</p>
        <p className="text-xs text-gray-500 mt-1">Cash transactions</p>
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs sm:text-sm font-medium text-gray-600">Digital Payments</h3>
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{formatCurrency(digitalRevenue)}</p>
        <p className="text-xs text-gray-500 mt-1">Telebirr & Bank transfers</p>
      </div>
    </div>
  );
}
