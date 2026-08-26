'use client';

import { formatCurrency } from '@/lib/utils';

interface CashierShiftAuditProps {
  shifts: any[];
}

export function CashierShiftAuditCard({ shifts }: CashierShiftAuditProps) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">Cashier Shifts & Drawer Audits</h3>
          <p className="text-xs text-gray-500">Starting floats and cash drawer reconciliation</p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
          Latest Shifts
        </span>
      </div>

      {shifts.length === 0 ? (
        <div className="py-10 text-center text-gray-400 text-xs">
          No cashier shift records logged in this timeframe.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
                <th className="pb-2.5 font-medium">Cashier</th>
                <th className="pb-2.5 font-medium">Shift</th>
                <th className="pb-2.5 font-medium">Float (Beg.)</th>
                <th className="pb-2.5 font-medium">Expected Drawer</th>
                <th className="pb-2.5 font-medium">Counted</th>
                <th className="pb-2.5 font-medium text-center">Over / Short</th>
                <th className="pb-2.5 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {shifts.map((shift) => {
                const diff = shift.cashDifference ?? null;
                const isShort = diff !== null && diff < 0;
                const isOver = diff !== null && diff > 0;
                const isBalanced = diff !== null && diff === 0;

                return (
                  <tr key={shift.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 font-bold text-gray-900">{shift.cashierName}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-semibold">
                        {shift.shiftType}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-gray-700">
                      {formatCurrency(shift.beginningCash)}
                    </td>
                    <td className="py-3 font-semibold text-gray-700">
                      {shift.expectedCash !== null ? formatCurrency(shift.expectedCash) : '—'}
                    </td>
                    <td className="py-3 font-bold text-gray-900">
                      {shift.closingCash !== null ? formatCurrency(shift.closingCash) : '—'}
                    </td>
                    <td className="py-3 text-center">
                      {diff === null ? (
                        <span className="text-gray-400 font-mono">—</span>
                      ) : isShort ? (
                        <span className="inline-block px-2 py-0.5 rounded-md bg-red-100 text-red-700 font-black">
                          {formatCurrency(diff)} (Short)
                        </span>
                      ) : isOver ? (
                        <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-black">
                          +{formatCurrency(diff)} (Over)
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold">
                          Exact
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          shift.status === 'ACTIVE'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {shift.status}
                      </span>
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
