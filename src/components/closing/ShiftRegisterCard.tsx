'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';

export interface CashierShiftData {
  id: string;
  cashierName: string;
  shiftType: string;
  beginningCash: number;
  closingCash?: number;
  expectedCash?: number;
  cashDifference?: number;
  totalCashSales: number;
  totalTransfer: number;
  totalExpenses: number;
  totalTipsGiven: number;
  status: string;
  startedAt: string;
  closedAt?: string;
  notes?: string;
}

interface ShiftRegisterCardProps {
  activeShift: CashierShiftData | null;
  todayCashSales: number;
  todayExpenses: number;
  todayTips: number;
  todayTransfers: number;
  onStartShift: (beginningCash: number, shiftType: string) => Promise<void>;
  onCloseShift: (closingCash: number, notes: string) => Promise<void>;
  isSubmitting: boolean;
}

export function ShiftRegisterCard({
  activeShift,
  todayCashSales,
  todayExpenses,
  todayTips,
  todayTransfers,
  onStartShift,
  onCloseShift,
  isSubmitting,
}: ShiftRegisterCardProps) {
  const [beginningCashInput, setBeginningCashInput] = useState<string>('1000');
  const [shiftTypeInput, setShiftTypeInput] = useState<string>('MORNING');
  const [countedCashInput, setCountedCashInput] = useState<string>('');
  const [closingNotes, setClosingNotes] = useState<string>('');

  const startCash = activeShift?.beginningCash || 0;
  const expectedCash = startCash + todayCashSales - todayExpenses - todayTips;
  const countedNum = countedCashInput === '' ? 0 : parseFloat(countedCashInput) || 0;
  const variance = countedNum - expectedCash;

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    await onStartShift(parseFloat(beginningCashInput) || 0, shiftTypeInput);
  };

  const handleClose = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCloseShift(parseFloat(countedCashInput) || 0, closingNotes);
    setCountedCashInput('');
    setClosingNotes('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Shift Status & Formula Card */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5 space-y-5">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                activeShift ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
              {activeShift
                ? `Active Shift: ${activeShift.shiftType} (${activeShift.cashierName})`
                : 'No Active Shift Open'}
            </h2>
          </div>
          {activeShift && (
            <span className="text-xs text-gray-400">
              Opened at{' '}
              {new Date(activeShift.startedAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
        </div>

        {/* Mathematical Equation Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <span className="text-gray-500 block">1. Beginning Float</span>
            <span className="text-base font-bold text-gray-900 mt-1 block">
              {formatCurrency(startCash)}
            </span>
          </div>
          <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-200">
            <span className="text-emerald-700 block">+ 2. Customer Cash</span>
            <span className="text-base font-bold text-emerald-700 mt-1 block">
              +{formatCurrency(todayCashSales)}
            </span>
          </div>
          <div className="bg-red-50/50 p-3 rounded-lg border border-red-200">
            <span className="text-red-700 block">− 3. Total Expenses</span>
            <span className="text-base font-bold text-red-700 mt-1 block">
              −{formatCurrency(todayExpenses)}
            </span>
          </div>
          <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-200">
            <span className="text-amber-700 block">− 4. Tips Payout</span>
            <span className="text-base font-bold text-amber-700 mt-1 block">
              −{formatCurrency(todayTips)}
            </span>
          </div>
        </div>

        {/* Total Expected Summary */}
        <div className="bg-gray-900 text-white p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              Expected Physical Cash in Drawer
            </p>
            <p className="text-xs text-gray-300 mt-0.5">
              (Beginning Cash + Cash Sales) − (Expenses + Tips)
            </p>
          </div>
          <p className="text-2xl font-black text-white">{formatCurrency(expectedCash)}</p>
        </div>

        <div className="text-xs text-gray-500 flex items-center justify-between pt-1 border-t">
          <span>Total Digital Transfers (Telebirr & CBE):</span>
          <span className="font-semibold text-gray-700">{formatCurrency(todayTransfers)}</span>
        </div>
      </div>

      {/* Action Box: Start or Close Shift */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-between">
        {!activeShift ? (
          <form onSubmit={handleStart} className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Open Shift Register</h3>
            <p className="text-xs text-gray-500">
              Enter the starting money (float) placed in the cash drawer at the start of your shift.
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Shift Timing</label>
              <select
                value={shiftTypeInput}
                onChange={(e) => setShiftTypeInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white"
              >
                <option value="MORNING">Morning Shift</option>
                <option value="AFTERNOON">Afternoon Shift</option>
                <option value="EVENING">Evening Shift</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Beginning Cash (ETB)</label>
              <input
                type="number"
                step="1"
                required
                value={beginningCashInput}
                onChange={(e) => setBeginningCashInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold focus:ring-2 focus:ring-[#E4002B]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-[#E4002B] hover:bg-[#C4002B] text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
            >
              {isSubmitting ? 'Starting...' : 'Open Shift & Register'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleClose} className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Close Shift Drawer</h3>
            <p className="text-xs text-gray-500">
              Count the physical cash in the drawer and enter below to verify balance.
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Counted Cash in Drawer (ETB)
              </label>
              <input
                type="number"
                step="1"
                required
                placeholder={expectedCash.toString()}
                value={countedCashInput}
                onChange={(e) => setCountedCashInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold focus:ring-2 focus:ring-[#E4002B]"
              />
            </div>

            {countedCashInput !== '' && (
              <div
                className={`p-2.5 rounded-lg text-xs font-bold flex justify-between ${
                  variance === 0
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : variance > 0
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                <span>
                  {variance === 0 ? 'Drawer Balanced' : variance > 0 ? 'Cash Over' : 'Cash Short'}
                </span>
                <span>
                  {variance >= 0 ? '+' : ''}
                  {formatCurrency(variance)}
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Closing Notes</label>
              <input
                type="text"
                placeholder="Optional notes..."
                value={closingNotes}
                onChange={(e) => setClosingNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || countedCashInput === ''}
              className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-bold shadow-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Closing...' : 'Close & Lock Shift'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
