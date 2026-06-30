'use client';

import { formatCurrency } from '@/lib/utils';

interface Branch {
  id: string;
  name: string;
  location: string;
  manager: string;
  revenue: number;
  orders: number;
  staff: number;
  status: string;
}

interface BranchPerformanceTableProps {
  branches: Branch[];
}

export function BranchPerformanceTable({ branches }: BranchPerformanceTableProps) {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold">Branch Performance</h2>
          <p className="text-xs sm:text-sm text-gray-600">Compare performance across all locations</p>
        </div>
        <button className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Report
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">BRANCH</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">LOCATION</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">MANAGER</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">REVENUE</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">ORDERS</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">STAFF</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">STATUS</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch) => (
              <tr key={branch.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-4 font-medium text-sm">{branch.name}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{branch.location}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{branch.manager}</td>
                <td className="py-4 px-4 text-right font-bold text-sm text-green-600">
                  {formatCurrency(branch.revenue)}
                </td>
                <td className="py-4 px-4 text-right text-sm">{branch.orders}</td>
                <td className="py-4 px-4 text-right text-sm">{branch.staff}</td>
                <td className="py-4 px-4 text-center">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {branch.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <button className="px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 rounded font-medium">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {branches.map((branch) => (
          <div key={branch.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-900">{branch.name}</h3>
                <p className="text-sm text-gray-600">{branch.location}</p>
                <p className="text-xs text-gray-500 mt-1">Manager: {branch.manager}</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                {branch.status}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <p className="text-xs text-gray-600">Revenue</p>
                <p className="font-bold text-green-600 text-sm">{formatCurrency(branch.revenue)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Orders</p>
                <p className="font-bold text-gray-900 text-sm">{branch.orders}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Staff</p>
                <p className="font-bold text-gray-900 text-sm">{branch.staff}</p>
              </div>
            </div>
            <button className="w-full py-2 text-sm text-purple-600 bg-purple-50 rounded font-medium hover:bg-purple-100">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
