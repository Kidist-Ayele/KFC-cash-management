interface Transaction {
  id: string;
  time: string;
  items: string;
  orderNumber: string;
  amount: number;
  amountPaid?: number;
  tip?: number;
  status: 'Paid' | 'Unpaid';
  waiter: string;
  paymentChannel?: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  waitersList?: string[];
  waiterFilter: string;
  paymentFilter: string;
  onWaiterFilterChange: (filter: string) => void;
  onPaymentFilterChange: (filter: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

import { formatCurrency } from '@/lib/utils';
import { PAYMENT_CHANNELS } from '@/constants/payment';

export function TransactionsTable({
  transactions,
  waitersList = ['Desalegn', 'Marta', 'Serkalem'],
  waiterFilter,
  paymentFilter,
  onWaiterFilterChange,
  onPaymentFilterChange,
  onEditTransaction,
  onDeleteTransaction,
}: TransactionsTableProps) {
  const filteredTransactions = transactions.filter((t) => {
    const matchesWaiter = waiterFilter === 'All' || t.waiter === waiterFilter;
    const matchesPayment = paymentFilter === 'All' || t.paymentChannel === paymentFilter;
    return matchesWaiter && matchesPayment;
  });

  return (
    <div className="mt-6 sm:mt-8 bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold">Daily Orders</h2>
          <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
            Shift activity, order totals, and tips
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            value={waiterFilter}
            onChange={(e) => onWaiterFilterChange(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-xs font-medium focus:ring-2 focus:ring-[#E4002B]"
          >
            <option value="All">All Waiters</option>
            {waitersList.map((waiter) => (
              <option key={waiter} value={waiter}>
                {waiter}
              </option>
            ))}
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => onPaymentFilterChange(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-xs font-medium focus:ring-2 focus:ring-[#E4002B]"
          >
            <option value="All">All Payments</option>
            {PAYMENT_CHANNELS.map((channel) => (
              <option key={channel.value} value={channel.value}>
                {channel.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50/50">
              <th className="text-left py-3 px-3 font-semibold text-gray-700 text-xs">TIME</th>
              <th className="text-left py-3 px-3 font-semibold text-gray-700 text-xs">ORDER / ITEMS</th>
              <th className="text-left py-3 px-3 font-semibold text-gray-700 text-xs">WAITER</th>
              <th className="text-left py-3 px-3 font-semibold text-gray-700 text-xs">PAYMENT</th>
              <th className="text-right py-3 px-3 font-semibold text-gray-700 text-xs">BILL TOTAL</th>
              <th className="text-right py-3 px-3 font-semibold text-emerald-700 text-xs">TIP</th>
              <th className="text-center py-3 px-3 font-semibold text-gray-700 text-xs">STATUS</th>
              <th className="text-center py-3 px-3 font-semibold text-gray-700 text-xs">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-400 text-sm">
                  No orders recorded yet. Place an order to see it here.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3 px-3 text-xs text-gray-500 whitespace-nowrap">{transaction.time}</td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-xs text-gray-900">{transaction.orderNumber}</p>
                    <p className="text-xs text-gray-500 truncate max-w-xs">{transaction.items}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-xs font-semibold">
                      {transaction.waiter}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-md text-xs font-medium">
                      {PAYMENT_CHANNELS.find((c) => c.value === transaction.paymentChannel)?.label || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-gray-900 text-xs">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="py-3 px-3 text-right text-xs">
                    {(transaction.tip || 0) > 0 ? (
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        +{formatCurrency(transaction.tip || 0)}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                        transaction.status === 'Paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          transaction.status === 'Paid' ? 'bg-green-600' : 'bg-orange-600'
                        }`}
                      ></span>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onEditTransaction(transaction)}
                        className="p-1.5 hover:bg-gray-100 text-gray-600 rounded"
                        title="Edit transaction"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDeleteTransaction(transaction.id)}
                        className="p-1.5 hover:bg-red-50 text-red-600 rounded"
                        title="Delete transaction"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
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
            No orders recorded yet. Place an order to see it here.
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <p className="font-bold text-[#E4002B] text-lg">{formatCurrency(transaction.amount)}</p>
                    {(transaction.tip || 0) > 0 && (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        +{formatCurrency(transaction.tip || 0)} tip
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {transaction.orderNumber} • {transaction.time}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs inline-flex items-center gap-1 ${
                    transaction.status === 'Paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      transaction.status === 'Paid' ? 'bg-green-600' : 'bg-orange-600'
                    }`}
                  ></span>
                  {transaction.status}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-2">{transaction.items}</p>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                  {transaction.waiter}
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                  {PAYMENT_CHANNELS.find((c) => c.value === transaction.paymentChannel)?.label || 'N/A'}
                </span>
              </div>
              <div className="flex gap-2 pt-2 border-t border-gray-200">
                <button
                  onClick={() => onEditTransaction(transaction)}
                  className="flex-1 py-2 px-3 bg-blue-50 text-blue-700 rounded text-sm font-medium hover:bg-blue-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteTransaction(transaction.id)}
                  className="flex-1 py-2 px-3 bg-red-50 text-red-700 rounded text-sm font-medium hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
