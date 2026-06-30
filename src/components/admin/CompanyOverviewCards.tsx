'use client';

import { formatCurrency } from '@/lib/utils';

interface CompanyOverviewCardsProps {
  totalRevenue: number;
  totalBranches: number;
  totalUsers: number;
  totalOrders: number;
}

export function CompanyOverviewCards({
  totalRevenue,
  totalBranches,
  totalUsers,
  totalOrders,
}: CompanyOverviewCardsProps) {
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
        <p className="text-xs text-gray-500 mt-1">All branches combined</p>
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs sm:text-sm font-medium text-gray-600">Total Branches</h3>
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{totalBranches}</p>
        <p className="text-xs text-gray-500 mt-1">Active locations</p>
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs sm:text-sm font-medium text-gray-600">Total Users</h3>
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{totalUsers}</p>
        <p className="text-xs text-gray-500 mt-1">System users</p>
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs sm:text-sm font-medium text-gray-600">Total Orders</h3>
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{totalOrders}</p>
        <p className="text-xs text-gray-500 mt-1">Today's orders</p>
      </div>
    </div>
  );
}
