'use client';

import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

interface RecentOrder {
  id: string;
  orderNumber: string;
  cashier: string;
  waiter: string;
  total: number;
  paymentChannel: string;
  itemsCount: number;
  createdAt: string;
}

interface RecentOrdersLedgerProps {
  orders: RecentOrder[];
}

export function RecentOrdersLedger({ orders }: RecentOrdersLedgerProps) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">Recent Completed Orders</h3>
          <p className="text-xs text-gray-500">Live order activity across shifts</p>
        </div>
        <Link
          href="/admin/transactions"
          className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
        >
          View All Transactions →
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="py-10 text-center text-gray-400 text-xs">
          No orders placed in this timeframe.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
                <th className="pb-2.5 font-medium">Order #</th>
                <th className="pb-2.5 font-medium">Time</th>
                <th className="pb-2.5 font-medium">Cashier</th>
                <th className="pb-2.5 font-medium">Waiter</th>
                <th className="pb-2.5 font-medium">Items</th>
                <th className="pb-2.5 font-medium">Method</th>
                <th className="pb-2.5 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((ord) => {
                const dateObj = new Date(ord.createdAt);
                const timeStr = dateObj.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                });

                return (
                  <tr key={ord.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 font-bold text-gray-900">{ord.orderNumber}</td>
                    <td className="py-3 text-gray-500 font-mono text-[11px]">{timeStr}</td>
                    <td className="py-3 font-medium text-gray-700">{ord.cashier}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-semibold text-[11px]">
                        {ord.waiter}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">{ord.itemsCount} pcs</td>
                    <td className="py-3">
                      <span className="font-semibold text-gray-800 text-[11px]">
                        {ord.paymentChannel}
                      </span>
                    </td>
                    <td className="py-3 text-right font-black text-gray-900">
                      {formatCurrency(ord.total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
