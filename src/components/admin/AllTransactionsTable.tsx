'use client';

import { formatCurrency } from '@/lib/utils';

interface Transaction {
  id: string;
  orderNumber: string;
  branch: string;
  cashier: string;
  waiter: string;
  items: number;
  subtotal: number;
  vat: number;
  total: number;
  paymentMethod: string;
  status: string;
  timestamp: string;
}

interface AllTransactionsTableProps {
  transactions: Transaction[];
}

export function AllTransactionsTable({ transactions }: AllTransactionsTableProps) {
  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'CASH': return 'bg-green-100 text-green-700';
      case 'TELEBIRR': return 'bg-blue-100 text-blue-700';
      case 'KUKU_CBE': return 'bg-purple-100 text-purple-700';
      case 'SAMUEL_CBE': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'KUKU_CBE': return 'Kuku CBE';
      case 'SAMUEL_CBE': return 'Samuel CBE';
      case 'TELEBIRR': return 'Telebirr';
      case 'CASH': return 'Cash';
      default: return method;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Branch</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cashier</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waiter</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Items</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">VAT</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Payment</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <span className="font-mono text-sm font-medium text-purple-600">
                    {transaction.orderNumber}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.branch}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{transaction.cashier}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{transaction.waiter}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">{transaction.items}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-900">
                  {formatCurrency(transaction.subtotal)}
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-600">
                  {formatCurrency(transaction.vat)}
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-green-600">
                  {formatCurrency(transaction.total)}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(transaction.paymentMethod)}`}>
                    {getPaymentMethodLabel(transaction.paymentMethod)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{transaction.timestamp}</td>
                <td className="px-4 py-3 text-center">
                  <button className="text-purple-600 hover:text-purple-800 font-medium text-sm">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-gray-200">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-mono text-sm font-bold text-purple-600 mb-1">
                  {transaction.orderNumber}
                </p>
                <p className="text-sm font-medium text-gray-900">{transaction.branch}</p>
                <p className="text-xs text-gray-500">{transaction.timestamp}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(transaction.paymentMethod)}`}>
                {getPaymentMethodLabel(transaction.paymentMethod)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
              <div>
                <p className="text-xs text-gray-600">Cashier</p>
                <p className="font-medium text-gray-900">{transaction.cashier}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Waiter</p>
                <p className="font-medium text-gray-900">{transaction.waiter}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Items</p>
                <p className="font-medium text-gray-900">{transaction.items}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Subtotal</p>
                <p className="font-medium text-gray-900">{formatCurrency(transaction.subtotal)}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Amount</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(transaction.total)}</p>
                <p className="text-xs text-gray-500">VAT: {formatCurrency(transaction.vat)}</p>
              </div>
              <button className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100">
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium">No transactions found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
