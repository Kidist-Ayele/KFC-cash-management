'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';

interface CashierShiftData {
  id: string;
  cashierName: string;
  shiftType: string;
  beginningCash: number;
  totalCashSales: number;
  totalTransfer: number;
  totalExpenses: number;
  totalTipsGiven: number;
  startedAt: string;
}

interface CashierShiftModalProps {
  isOpen: boolean;
  activeShift: CashierShiftData | null;
  todayCashSales: number;
  todayExpenses: number;
  todayTips: number;
  onClose: () => void;
  onShiftStarted: (shift: any) => void;
  onShiftClosed: (closedShift: any) => void;
}

export function CashierShiftModal({
  isOpen,
  activeShift,
  todayCashSales,
  todayExpenses,
  todayTips,
  onClose,
  onShiftStarted,
  onShiftClosed,
}: CashierShiftModalProps) {
  // Start shift state
  const [beginningCash, setBeginningCash] = useState<string>('1000');
  const [shiftType, setShiftType] = useState<string>('MORNING');
  const [isStarting, setIsStarting] = useState(false);

  // Close shift state
  const [countedClosingCash, setCountedClosingCash] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isClosing, setIsClosing] = useState(false);
  const [closedResult, setClosedResult] = useState<any>(null);

  if (!isOpen) return null;

  // Active shift math
  const startCash = activeShift?.beginningCash || 0;
  // Expected Drawer = beginningCash + cashFromCustomers - totalExpenses - tipsGiven
  const expectedCash = startCash + todayCashSales - todayExpenses - todayTips;
  const countedNum = countedClosingCash === '' ? 0 : parseFloat(countedClosingCash) || 0;
  const variance = countedNum - expectedCash;

  const handleStartShift = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsStarting(true);
    try {
      const res = await fetch('/api/cashier-shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beginningCash: parseFloat(beginningCash) || 0,
          shiftType,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        onShiftStarted(data);
      } else {
        alert('Failed to start shift');
      }
    } catch (err) {
      alert('Error starting shift');
    } finally {
      setIsStarting(false);
    }
  };

  const handleCloseShift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShift) return;

    if (!confirm('Are you sure you want to close this shift and lock drawer counts?')) return;

    setIsClosing(true);
    try {
      const res = await fetch(`/api/cashier-shifts/${activeShift.id}/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          closingCash: countedNum,
          notes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setClosedResult(data);
        onShiftClosed(data);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to close shift');
      }
    } catch (err) {
      alert('Error closing shift');
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {activeShift ? 'Cashier Shift & Drawer Closing' : 'Start New Cashier Shift'}
            </h2>
            <p className="text-xs text-gray-500">
              {activeShift
                ? `Reconcile cash drawer for ${activeShift.cashierName}`
                : 'Enter your beginning drawer cash to begin selling'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {!activeShift ? (
            /* START SHIFT FORM */
            <form onSubmit={handleStartShift} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Shift Timing
                </label>
                <select
                  value={shiftType}
                  onChange={(e) => setShiftType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#E4002B]"
                >
                  <option value="MORNING">Morning Shift</option>
                  <option value="AFTERNOON">Afternoon Shift</option>
                  <option value="EVENING">Evening Shift</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Beginning Cash (Starting Drawer Float in ETB) *
                </label>
                <input
                  type="number"
                  step="1"
                  required
                  placeholder="e.g. 1000"
                  value={beginningCash}
                  onChange={(e) => setBeginningCash(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-lg font-bold text-gray-900 focus:ring-2 focus:ring-[#E4002B]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  The initial cash handed to the cashier at the entrance of the shift.
                </p>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isStarting}
                  className="w-full py-3 bg-[#E4002B] text-white rounded-xl font-bold text-sm hover:bg-[#C4002B] shadow-md disabled:opacity-50"
                >
                  {isStarting ? 'Opening Shift...' : 'Open Shift & Start Drawer'}
                </button>
              </div>
            </form>
          ) : closedResult ? (
            /* SHIFT CLOSED RECEIPT */
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                ✓
              </div>
              <h3 className="text-lg font-bold text-gray-900">Shift Closed Successfully</h3>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Beginning Cash:</span>
                  <span className="font-semibold">{formatCurrency(closedResult.beginningCash)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cash Sales:</span>
                  <span className="font-semibold">{formatCurrency(closedResult.totalCashSales)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Expenses Deducted:</span>
                  <span className="font-semibold text-red-600">− {formatCurrency(closedResult.totalExpenses)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tips Handed Out:</span>
                  <span className="font-semibold text-emerald-600">− {formatCurrency(closedResult.totalTipsGiven)}</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-bold text-sm">
                  <span>Expected Cash:</span>
                  <span>{formatCurrency(closedResult.expectedCash)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm">
                  <span>Counted Cash:</span>
                  <span>{formatCurrency(closedResult.closingCash)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Difference:</span>
                  <span
                    className={
                      closedResult.cashDifference >= 0 ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {closedResult.cashDifference >= 0 ? '+' : ''}
                    {formatCurrency(closedResult.cashDifference)} (
                    {closedResult.cashDifference === 0
                      ? 'Balanced'
                      : closedResult.cashDifference > 0
                      ? 'Over'
                      : 'Short'}
                    )
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800"
              >
                Close Window
              </button>
            </div>
          ) : (
            /* CLOSE SHIFT RECONCILIATION */
            <form onSubmit={handleCloseShift} className="space-y-4">
              {/* Formula Card */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs space-y-2">
                <p className="font-bold text-gray-700 text-sm mb-1">
                  Cash Drawer Formula:
                </p>
                <div className="flex justify-between">
                  <span className="text-gray-600">Beginning Cash Float:</span>
                  <span className="font-bold text-gray-900">{formatCurrency(startCash)}</span>
                </div>
                <div className="flex justify-between text-green-700">
                  <span>+ Cash From Customers:</span>
                  <span className="font-bold">+{formatCurrency(todayCashSales)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>− Total Expenses Paid:</span>
                  <span className="font-bold">−{formatCurrency(todayExpenses)}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>− Tips Given Out to Waiters:</span>
                  <span className="font-bold">−{formatCurrency(todayTips)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-black text-sm text-[#E4002B]">
                  <span>Expected Cash in Drawer:</span>
                  <span>{formatCurrency(expectedCash)}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Counted Physical Cash in Drawer (ETB) *
                </label>
                <input
                  type="number"
                  step="1"
                  required
                  placeholder={expectedCash.toString()}
                  value={countedClosingCash}
                  onChange={(e) => setCountedClosingCash(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-lg font-bold text-gray-900 focus:ring-2 focus:ring-[#E4002B]"
                />
              </div>

              {countedClosingCash !== '' && (
                <div
                  className={`p-3 rounded-lg text-xs font-bold flex justify-between ${
                    variance === 0
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : variance > 0
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  <span>
                    {variance === 0
                      ? '✓ Perfect Match (Drawer is Balanced)'
                      : variance > 0
                      ? '▲ Cash Over'
                      : '▼ Cash Short'}
                  </span>
                  <span>
                    {variance >= 0 ? '+' : ''}
                    {formatCurrency(variance)}
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Closing Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Notes about discrepancy, handoff to next cashier, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#E4002B]"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isClosing || countedClosingCash === ''}
                  className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black disabled:opacity-50"
                >
                  {isClosing ? 'Closing...' : 'Close & Lock Shift'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
