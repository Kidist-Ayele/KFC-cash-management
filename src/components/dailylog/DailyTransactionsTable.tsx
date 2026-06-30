'use client';

import { formatCurrency } from '@/lib/utils';
import { PAYMENT_CHANNELS } from '@/constants/payment';
import { useState } from 'react';

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

interface DailyTransactionsTableProps {
  transactions: Transaction[];
  onExport?: () => void;
}

export function DailyTransactionsTable({ transactions, onExport }: DailyTransactionsTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [waiterFilter, setWaiterFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');

  const waiters = Array.from(new Set(transactions.map(t => t.waiter)));

  const filteredTransactions = transactions.filter(t => {
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesWaiter = waiterFilter === 'All' || t.waiter === waiterFilter;
    const matchesPayment = paymentFilter === 'All' || t.paymentChannel === paymentFilter;
    return matchesStatus && matchesWaiter && matchesPayment;
  });

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold">All Transactions</h2>
          <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Complete log of today's orders</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>

          <select 
            value={waiterFilter}
            onChange={(e) => setWaiterFilter(e.target.value)}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
          >
            <option value="All">All Waiters</option>
            {waiters.map(waiter => (
              <option key={waiter} value={waiter}>{waiter}</option>
            ))}
          </select>

          <select 
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
          >
            <option value="All">All Payments</option>
            {PAYMENT_CHANNELS.map(channel => (
              <option key={channel.value} value={channel.value}>{channel.label}</option>
            ))}
          </select>

          {onExport && (
            <button 
              onClick={onExport}
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">Export</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">TIME</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">ORDER</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">ITEMS</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">WAITER</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">PAYMENT</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">AMOUNT</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400 text-sm">
                  No transactions found. Try adjusting filters.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm">{transaction.time}</td>
                  <td className="py-4 px-4">
                    <p className="font-medium text-sm">{transaction.orderNumber}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-600">{transaction.items}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {transaction.waiter}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                      {PAYMENT_CHANNELS.find(c => c.value === transaction.paymentChannel)?.label || 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-[#E4002B] text-sm">{formatCurrency(transaction.amount)}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs inline-flex items-center gap-1 ${
                      transaction.status === 'Paid' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        transaction.status === 'Paid' ? 'bg-green-600' : 'bg-orange-600'
                      }`}></span>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-sm">
            No transactions found. Try adjusting filters.
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-[#E4002B] text-base">{formatCurrency(transaction.amount)}</p>
                  <p className="text-xs text-gray-500">{transaction.orderNumber}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2 py-1 rounded-full text-xs inline-flex items-center gap-1 ${
                    transaction.status === 'Paid' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      transaction.status === 'Paid' ? 'bg-green-600' : 'bg-orange-600'
                    }`}></span>
                    {transaction.status}
                  </span>
                  <p className="text-xs text-gray-500">{transaction.time}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-2">{transaction.items}</p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                  {transaction.waiter}
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                  {PAYMENT_CHANNELS.find(c => c.value === transaction.paymentChannel)?.label || 'N/A'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredTransactions.length > 0 && (
        <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs sm:text-sm text-gray-600">
          <p>Showing {filteredTransactions.length} of {transactions.length} transactions</p>
          <p>Total: <span className="font-bold text-[#E4002B]">{formatCurrency(filteredTransactions.reduce((sum, t) => sum + t.amount, 0))}</span></p>
        </div>
      )}
    </div>
  );
}
