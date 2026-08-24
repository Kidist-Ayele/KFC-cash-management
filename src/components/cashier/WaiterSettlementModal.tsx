'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';

interface WaiterSettlementData {
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

interface WaiterSettlementModalProps {
  isOpen: boolean;
  settlements: WaiterSettlementData[];
  onClose: () => void;
  onRefresh: () => void;
}

export function WaiterSettlementModal({
  isOpen,
  settlements,
  onClose,
  onRefresh,
}: WaiterSettlementModalProps) {
  const [selectedWaiter, setSelectedWaiter] = useState<WaiterSettlementData | null>(null);

  if (!isOpen) return null;

  const totalAllSales = settlements.reduce((sum, s) => sum + s.totalSales, 0);
  const totalAllCash = settlements.reduce((sum, s) => sum + s.totalCashOrders, 0);
  const totalAllTransfers = settlements.reduce((sum, s) => sum + s.totalTransferOrders, 0);
  const totalAllPettyCash = settlements.reduce((sum, s) => sum + s.totalPettyCash, 0);
  const totalAllTips = settlements.reduce((sum, s) => sum + s.totalTips, 0);
  const totalAllDue = settlements.reduce((sum, s) => sum + s.cashBalanceDue, 0);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">End of Shift Waiter Settlement</h2>
            <p className="text-xs text-gray-500">
              Reconcile petty cash, cash collected, and tip payouts per waiter
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg text-xs font-medium flex items-center gap-1"
              title="Refresh"
            >
              🔄 Refresh
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200"
            >
              ×
            </button>
          </div>
        </div>

        {/* Summary Metric Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gray-50/70 border-b border-gray-200 text-xs">
          <div className="bg-white p-3 rounded-xl border border-gray-200">
            <p className="text-gray-500">Total Shift Sales</p>
            <p className="text-base font-bold text-gray-900">{formatCurrency(totalAllSales)}</p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-gray-200">
            <p className="text-gray-500">Total Petty Cash Given</p>
            <p className="text-base font-bold text-blue-600">{formatCurrency(totalAllPettyCash)}</p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-gray-200">
            <p className="text-gray-500">Total Tips to Pay Waiters</p>
            <p className="text-base font-bold text-emerald-600">🎁 {formatCurrency(totalAllTips)}</p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-gray-200">
            <p className="text-gray-500">Total Net Cash Expected</p>
            <p className="text-base font-bold text-[#E4002B]">{formatCurrency(totalAllDue)}</p>
          </div>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-100 text-gray-700 font-semibold border-b">
                <tr>
                  <th className="py-3 px-3">WAITER</th>
                  <th className="py-3 px-3 text-center">ORDERS</th>
                  <th className="py-3 px-3 text-right">PETTY CASH</th>
                  <th className="py-3 px-3 text-right">CASH SALES</th>
                  <th className="py-3 px-3 text-right">TRANSFERS</th>
                  <th className="py-3 px-3 text-right text-emerald-600 font-bold">TIPS EARNED</th>
                  <th className="py-3 px-3 text-right text-[#E4002B] font-bold">NET CASH DUE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {settlements.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">
                      No waiter activity recorded for today yet.
                    </td>
                  </tr>
                ) : (
                  settlements.map((s) => (
                    <tr key={s.waiterId} className="hover:bg-gray-50">
                      <td className="py-3 px-3 font-semibold text-gray-900">{s.waiterName}</td>
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
                      <td className="py-3 px-3 text-right text-emerald-600 font-bold bg-emerald-50/50">
                        {formatCurrency(s.totalTips)}
                      </td>
                      <td className="py-3 px-3 text-right font-black text-gray-900 bg-red-50/30">
                        {formatCurrency(s.cashBalanceDue)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Explanation Callout */}
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
            <p className="font-bold flex items-center gap-1">
              <span>💡</span> How Closing Math is Reconciled:
            </p>
            <p>
              • <strong>Net Cash Due from Waiter</strong> = (Petty Cash given to waiter + Cash collected for food) − Tips earned.
            </p>
            <p>
              • When a customer pays tip via Telebirr/CBE transfer, the tip money goes directly to the restaurant account, so the cashier pays that tip to the waiter in physical cash when settling.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#E4002B] text-white rounded-xl font-bold text-sm hover:bg-[#C4002B]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
