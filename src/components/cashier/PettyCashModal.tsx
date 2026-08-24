'use client';

import { useState } from 'react';

interface PettyCashModalProps {
  isOpen: boolean;
  waiters: { id: string; name: string }[];
  selectedWaiterId?: string;
  onClose: () => void;
  onPettyCashAdded: () => void;
}

export function PettyCashModal({
  isOpen,
  waiters,
  selectedWaiterId,
  onClose,
  onPettyCashAdded,
}: PettyCashModalProps) {
  const [waiterId, setWaiterId] = useState(selectedWaiterId || (waiters[0]?.id || ''));
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waiterId || !amount || Number(amount) <= 0) {
      setError('Select a waiter and enter a valid amount');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/waiters/petty-cash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          waiterId,
          amount: parseFloat(amount),
          givenBy: 'Cashier',
          notes: notes.trim() || undefined,
        }),
      });

      if (res.ok) {
        onPettyCashAdded();
        setAmount('');
        setNotes('');
        onClose();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to record petty cash');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Issue Waiter Petty Cash</h2>
            <p className="text-xs text-gray-500">Provide morning float or additional cash</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Select Waiter *
            </label>
            <select
              value={waiterId}
              onChange={(e) => setWaiterId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
            >
              {waiters.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Petty Cash Amount (ETB) *
            </label>
            <input
              type="number"
              step="1"
              required
              placeholder="e.g. 500, 1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Morning float, Shift replenishment"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-[#E4002B] text-white rounded-lg font-bold text-sm hover:bg-[#C4002B] disabled:opacity-50"
            >
              {isSubmitting ? 'Recording...' : 'Issue Cash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
