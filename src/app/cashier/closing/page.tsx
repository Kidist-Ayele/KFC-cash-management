'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/shared/Header';
import { PettyCashModal } from '@/components/cashier/PettyCashModal';
import { ShiftRegisterCard, type CashierShiftData } from '@/components/closing/ShiftRegisterCard';
import { WaiterSettlementTable, type WaiterSettlement } from '@/components/closing/WaiterSettlementTable';

interface WaiterItem {
  id: string;
  name: string;
  phone?: string;
}

export default function ClosingSettlementPage() {
  const [waiters, setWaiters] = useState<WaiterItem[]>([]);
  const [settlements, setSettlements] = useState<WaiterSettlement[]>([]);
  const [activeShift, setActiveShift] = useState<CashierShiftData | null>(null);
  const [todayCashSales, setTodayCashSales] = useState<number>(0);
  const [todayExpenses, setTodayExpenses] = useState<number>(0);
  const [todayTips, setTodayTips] = useState<number>(0);
  const [todayTransfers, setTodayTransfers] = useState<number>(0);
  const [showPettyCashModal, setShowPettyCashModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [waitersRes, setRes, shiftRes, ordersRes, expRes] = await Promise.all([
        fetch('/api/waiters'),
        fetch('/api/waiters/settlement'),
        fetch('/api/cashier-shifts'),
        fetch('/api/orders'),
        fetch('/api/expenses'),
      ]);

      if (waitersRes.ok) setWaiters(await waitersRes.json());
      if (setRes.ok) setSettlements(await setRes.json());
      if (shiftRes.ok) setActiveShift(await shiftRes.json());

      if (ordersRes.ok) {
        const orders = await ordersRes.json();
        const cashOrders = orders
          .filter((o: any) => o.paymentChannel === 'CASH' && o.status === 'PAID')
          .reduce((sum: number, o: any) => sum + o.total, 0);
        const transferOrders = orders
          .filter((o: any) => o.paymentChannel !== 'CASH' && o.status === 'PAID')
          .reduce((sum: number, o: any) => sum + o.total, 0);
        const tipsSum = orders
          .filter((o: any) => o.status === 'PAID')
          .reduce((sum: number, o: any) => sum + (o.tip || 0), 0);

        setTodayCashSales(cashOrders);
        setTodayTransfers(transferOrders);
        setTodayTips(tipsSum);
      }

      if (expRes.ok) {
        const expenses = await expRes.json();
        const expSum = expenses.reduce((sum: number, e: any) => sum + (e.amount || 0), 0);
        setTodayExpenses(expSum);
      }
    } catch (err) {
      console.error('Error fetching closing data:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStartShift = async (beginningCash: number, shiftType: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/cashier-shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ beginningCash, shiftType }),
      });
      if (res.ok) {
        setActiveShift(await res.json());
      } else {
        alert('Failed to start shift');
      }
    } catch (err) {
      alert('Error starting shift');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseShift = async (closingCash: number, notes: string) => {
    if (!activeShift) return;
    if (!confirm('Are you sure you want to close this shift and lock the register?')) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/cashier-shifts/${activeShift.id}/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ closingCash, notes }),
      });
      if (res.ok) {
        alert('Shift closed successfully.');
        setActiveShift(null);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to close shift');
      }
    } catch (err) {
      alert('Error closing shift');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        <Header role="cashier" />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Shift Settlement</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage beginning cash float, daily cash drawer reconciliation, and waiter tip payouts.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPettyCashModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                Issue Waiter Petty Cash
              </button>
              <button
                onClick={fetchData}
                className="px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium hover:bg-gray-100 text-gray-700"
              >
                Refresh Data
              </button>
            </div>
          </div>

          {/* Component 1: Cashier Shift Register & Closing Card */}
          <ShiftRegisterCard
            activeShift={activeShift}
            todayCashSales={todayCashSales}
            todayExpenses={todayExpenses}
            todayTips={todayTips}
            todayTransfers={todayTransfers}
            onStartShift={handleStartShift}
            onCloseShift={handleCloseShift}
            isSubmitting={isSubmitting}
          />

          {/* Component 2: Waiter Daily Math & Tips Table */}
          <WaiterSettlementTable settlements={settlements} />
        </div>
      </div>

      {/* Petty Cash Modal */}
      <PettyCashModal
        isOpen={showPettyCashModal}
        waiters={waiters}
        onClose={() => setShowPettyCashModal(false)}
        onPettyCashAdded={fetchData}
      />
    </>
  );
}
