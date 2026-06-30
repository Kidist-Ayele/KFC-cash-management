'use client';

import { Header } from '@/components/shared/Header';
import { CompanyOverviewCards } from '@/components/admin/CompanyOverviewCards';
import { BranchPerformanceTable } from '@/components/admin/BranchPerformanceTable';
import { RevenueComparisonChart } from '@/components/admin/RevenueComparisonChart';

export default function AdminDashboardPage() {
  // Mock data - will be from API
  const overviewData = {
    totalRevenue: 458920,
    totalBranches: 3,
    totalUsers: 24,
    totalOrders: 1247,
  };

  const branchData = [
    {
      id: '1',
      name: 'Main Branch',
      location: 'Bole, Addis Ababa',
      manager: 'Manager M.',
      revenue: 185340,
      orders: 542,
      staff: 8,
      status: 'ACTIVE',
    },
    {
      id: '2',
      name: 'Airport Branch',
      location: 'Airport Road',
      manager: 'Sara T.',
      revenue: 158720,
      orders: 438,
      staff: 6,
      status: 'ACTIVE',
    },
    {
      id: '3',
      name: 'Mexico Branch',
      location: 'Mexico Square',
      manager: 'John D.',
      revenue: 114860,
      orders: 267,
      staff: 5,
      status: 'ACTIVE',
    },
  ];

  const revenueComparison = [
    { branch: 'Main Branch', revenue: 185340, percentage: 40.4 },
    { branch: 'Airport Branch', revenue: 158720, percentage: 34.6 },
    { branch: 'Mexico Branch', revenue: 114860, percentage: 25.0 },
  ];

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header role="admin" />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Company Overview</h1>
            <p className="text-sm text-gray-600 mt-1">Monitor all branches and system-wide performance</p>
          </div>

          <CompanyOverviewCards {...overviewData} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <RevenueComparisonChart data={revenueComparison} />
            
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left">
                  <svg className="w-8 h-8 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p className="font-semibold text-sm">Add Branch</p>
                </button>

                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
                  <svg className="w-8 h-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <p className="font-semibold text-sm">Add User</p>
                </button>

                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left">
                  <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="font-semibold text-sm">Generate Report</p>
                </button>

                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all text-left">
                  <svg className="w-8 h-8 text-orange-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="font-semibold text-sm">Settings</p>
                </button>
              </div>
            </div>
          </div>

          <BranchPerformanceTable branches={branchData} />
        </div>
      </div>
    </>
  );
}
