'use client';

import { formatCurrency } from '@/lib/utils';
import { PAYMENT_CHANNELS } from '@/constants/payment';

const WAITERS = ['Desalegn', 'Marta'];

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

interface TransactionsTableProps {
  transactions: Transaction[];
  waiterFilter: string;
  paymentFilter: string;
  onWaiterFilterChange: (filter: string) => void;
  onPaymentFilterChange: (filter: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export function TransactionsTable({
  transactions,
  waiterFilter,
  paymentFilter,
  onWaiterFilterChange,
  onPaymentFilterChange,
  onEditTransaction,
  onDeleteTransaction,
}: TransactionsTableProps) {
  const filteredTransactions = transactions.filter(t => {
    const matchesWaiter = waiterFilter === 'All' || t.waiter === waiterFilter;
    const matchesPayment = paymentFilter === 'All' || t.paymentChannel === paymentFilter;
    return matchesWaiter && matchesPayment;
  });

  return (
    <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">Daily Transactions</h2>
          <p className="text-sm text-gray-600">Monitoring shift activity and order statuses</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={waiterFilter}
            onChange={(e) => onWaiterFilterChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
          >
            <option value="All">All Waiters</option>
            {WAITERS.map(waiter => (
              <option key={waiter} value={waiter}>{waiter}</option>
            ))}
          </select>
          <select 
            value={paymentFilter}
            onChange={(e) => onPaymentFilterChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
          >
            <option value="All">All Payments</option>
            {PAYMENT_CHANNELS.map(channel => (
              <option key={channel.value} value={channel.value}>{channel.label}</option>
            ))}
          </select>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>
      
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">TIME</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">ITEMS</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">WAITER</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">PAYMENT</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">AMOUNT</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">STATUS</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-8 text-center text-gray-400">
                No transactions found. {(waiterFilter !== 'All' || paymentFilter !== 'All') ? 'Try changing filters.' : 'Finalize an order to see it here.'}
              </td>
            </tr>
          ) : (
            filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-4">{transaction.time}</td>
                <td className="py-4 px-4">
                  <p className="font-medium">{transaction.items}</p>
                  <p className="text-xs text-gray-500">{transaction.orderNumber}</p>
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
                <td className="py-4 px-4 font-bold text-[#E4002B]">{formatCurrency(transaction.amount)}</td>
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
                <td className="py-4 px-4 flex gap-2">
                  <button 
                    onClick={() => onEditTransaction(transaction)}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Edit transaction"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => onDeleteTransaction(transaction.id)}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Delete transaction"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
