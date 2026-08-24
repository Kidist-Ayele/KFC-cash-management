'use client';

import { formatCurrency } from '@/lib/utils';

export interface WaiterSettlement {
  waiterId: string;
  waiterName: string;
  ordersCount: number;
  totalSales: number;
  totalCashOrders: number;
  totalTransferOrders: number;
  totalPettyCash: number;
  totalTips: number;
  cashBalanceDue: number;
}

interface WaiterSettlementTableProps {
  settlements: WaiterSettlement[];
}

export function WaiterSettlementTable({ settlements }: WaiterSettlementTableProps) {
  const totalAllPettyCash = settlements.reduce((sum, s) => sum + s.totalPettyCash, 0);
  const totalAllTips = settlements.reduce((sum, s) => sum + s.totalTips, 0);
  const totalAllDueFromWaiters = settlements.reduce((sum, s) => sum + s.cashBalanceDue, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">Waiters Daily Math & Tips Payout</h2>
          <p className="text-xs text-gray-500">
            Daily calculation of petty cash given, cash tickets collected, digital transfers, and tips payout.
          </p>
        </div>

        {/* Summary Badges */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 font-semibold rounded-lg">
            Petty Cash Issued: {formatCurrency(totalAllPettyCash)}
          </span>
          <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold rounded-lg">
            Total Tips Payout: {formatCurrency(totalAllTips)}
          </span>
          <span className="px-3 py-1 bg-gray-100 border border-gray-300 text-gray-800 font-bold rounded-lg">
            Net Cash Due from Waiters: {formatCurrency(totalAllDueFromWaiters)}
          </span>
        </div>
      </div>

      {/* Waiter Settlement Table */}
      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
            <tr>
              <th className="py-3 px-4">WAITER NAME</th>
              <th className="py-3 px-3 text-center">ORDERS</th>
              <th className="py-3 px-3 text-right">PETTY CASH GIVEN</th>
              <th className="py-3 px-3 text-right">CASH ORDERS</th>
              <th className="py-3 px-3 text-right">TRANSFERS</th>
              <th className="py-3 px-3 text-right font-bold text-emerald-700">TIPS EARNED</th>
              <th className="py-3 px-4 text-right font-bold text-gray-900">NET CASH TO COLLECT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {settlements.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400">
                  No waiter activity recorded for today.
                </td>
              </tr>
            ) : (
              settlements.map((s) => (
                <tr key={s.waiterId} className="hover:bg-gray-50/80">
                  <td className="py-3 px-4 font-semibold text-gray-900">{s.waiterName}</td>
                  <td className="py-3 px-3 text-center">{s.ordersCount}</td>
                  <td className="py-3 px-3 text-right text-blue-600 font-medium">
                    {formatCurrency(s.totalPettyCash)}
                  </td>
                  <td className="py-3 px-3 text-right font-medium">
                    {formatCurrency(s.totalCashOrders)}
                  </td>
                  <td className="py-3 px-3 text-right text-purple-600 font-medium">
                    {formatCurrency(s.totalTransferOrders)}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-600 bg-emerald-50/40">
                    {formatCurrency(s.totalTips)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-gray-900 bg-gray-50">
                    {formatCurrency(s.cashBalanceDue)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Informational Note */}
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-xs text-gray-600 space-y-1">
        <p className="font-semibold text-gray-800">Closing Settlement Notes:</p>
        <p>
          • <strong>Net Cash to Collect</strong> = (Petty Cash float handed to waiter + Cash collected for food) − Tips earned.
        </p>
        <p>
          • When customers transfer extra money via Telebirr or CBE as a tip, the money goes into the KFC account, so the cashier hands the waiter their tip in physical cash upon shift closing.
        </p>
      </div>
    </div>
  );
}
