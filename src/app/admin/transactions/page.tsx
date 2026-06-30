'use client';

import { useState } from 'react';
import { Header } from '@/components/shared/Header';
import { AllTransactionsTable } from '@/components/admin/AllTransactionsTable';

export default function TransactionsPage() {
  // Mock data - will be from API with all branches
  const [transactions] = useState([
    {
      id: '1',
      orderNumber: 'ORDER#001',
      branch: 'Main Branch',
      cashier: 'Cashier A',
      waiter: 'Desalegn',
      items: 3,
      subtotal: 680,
      vat: 102,
      total: 782,
      paymentMethod: 'TELEBIRR',
      status: 'COMPLETED',
      timestamp: '2024-06-30 14:30:00',
    },
    {
      id: '2',
      orderNumber: 'ORDER#002',
      branch: 'Airport Branch',
      cashier: 'Cashier B',
      waiter: 'Marta',
      items: 2,
      subtotal: 450,
      vat: 67.5,
      total: 517.5,
      paymentMethod: 'CASH',
      status: 'COMPLETED',
      timestamp: '2024-06-30 14:15:00',
    },
    {
      id: '3',
      orderNumber: 'ORDER#003',
      branch: 'Main Branch',
      cashier: 'Cashier A',
      waiter: 'Desalegn',
      items: 5,
      subtotal: 920,
      vat: 138,
      total: 1058,
      paymentMethod: 'KUKU_CBE',
      status: 'COMPLETED',
      timestamp: '2024-06-30 13:45:00',
    },
    {
      id: '4',
      orderNumber: 'ORDER#004',
      branch: 'Mexico Branch',
      cashier: 'Cashier C',
      waiter: 'Marta',
      items: 4,
      subtotal: 780,
      vat: 117,
      total: 897,
      paymentMethod: 'SAMUEL_CBE',
      status: 'COMPLETED',
      timestamp: '2024-06-30 13:20:00',
    },
    {
      id: '5',
      orderNumber: 'ORDER#005',
      branch: 'Airport Branch',
      cashier: 'Cashier B',
      waiter: 'Desalegn',
      items: 1,
      subtotal: 280,
      vat: 42,
      total: 322,
      paymentMethod: 'CASH',
      status: 'COMPLETED',
      timestamp: '2024-06-30 12:50:00',
    },
  ]);

  const [branchFilter, setBranchFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('today');

  const branches = ['All', 'Main Branch', 'Airport Branch', 'Mexico Branch'];
  const paymentMethods = ['All', 'CASH', 'TELEBIRR', 'KUKU_CBE', 'SAMUEL_CBE'];

  const filteredTransactions = transactions.filter(t => {
    const branchMatch = branchFilter === 'All' || t.branch === branchFilter;
    const paymentMatch = paymentFilter === 'All' || t.paymentMethod === paymentFilter;
    return branchMatch && paymentMatch;
  });

  // Calculate summary stats
  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalOrders = filteredTransactions.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalVAT = filteredTransactions.reduce((sum, t) => sum + t.vat, 0);

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header role="admin" />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Transactions</h1>
              <p className="text-sm text-gray-600 mt-1">Monitor all sales across all branches</p>
            </div>
            <button className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export to Excel
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Revenue</p>
                  <p className="text-xl font-bold text-gray-900">ETB {totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Orders</p>
                  <p className="text-xl font-bold text-gray-900">{totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Avg Order Value</p>
                  <p className="text-xl font-bold text-gray-900">ETB {avgOrderValue.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total VAT</p>
                  <p className="text-xl font-bold text-gray-900">ETB {totalVAT.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Branch</label>
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                >
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Payment Method</label>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                >
                  {paymentMethods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Order #, Cashier..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <AllTransactionsTable transactions={filteredTransactions} />
        </div>
      </div>
    </>
  );
}
