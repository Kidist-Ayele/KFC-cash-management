'use client';

import { Header } from '@/components/shared/Header';
import { DailySummaryCards } from '@/components/dailylog/DailySummaryCards';
import { PaymentBreakdownChart } from '@/components/dailylog/PaymentBreakdownChart';
import { WaiterPerformanceCard } from '@/components/dailylog/WaiterPerformanceCard';

export default function ManagerDashboardPage() {
  // Mock data - will be from API
  const summaryData = {
    totalRevenue: 125840,
    totalOrders: 342,
    cashRevenue: 45200,
    digitalRevenue: 80640,
  };

  const paymentBreakdown = [
    { channel: 'TELEBIRR', amount: 45000, count: 120, percentage: 35.8 },
    { channel: 'KUKU_CBE', amount: 35640, count: 95, percentage: 28.3 },
    { channel: 'SAMUEL_CBE', amount: 0, count: 0, percentage: 0 },
    { channel: 'CASH', amount: 45200, count: 127, percentage: 35.9 },
  ];

  const waiterStats = [
    { name: 'Desalegn', orders: 195, revenue: 72400 },
    { name: 'Marta', orders: 147, revenue: 53440 },
  ];

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header role="manager" />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <DailySummaryCards {...summaryData} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <PaymentBreakdownChart breakdown={paymentBreakdown} />
            <WaiterPerformanceCard waiters={waiterStats} />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
                <svg className="w-8 h-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="font-semibold">Add Menu Item</p>
                <p className="text-xs text-gray-500">Create new product</p>
              </button>

              <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left">
                <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <p className="font-semibold">Add Staff</p>
                <p className="text-xs text-gray-500">Register new user</p>
              </button>

              <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left">
                <svg className="w-8 h-8 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="font-semibold">Generate Report</p>
                <p className="text-xs text-gray-500">Export analytics</p>
              </button>

              <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all text-left">
                <svg className="w-8 h-8 text-orange-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="font-semibold">Settings</p>
                <p className="text-xs text-gray-500">System config</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
