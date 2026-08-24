'use client';

import { useState } from 'react';
import { PAYMENT_CHANNELS } from '@/constants/payment';
import { formatCurrency } from '@/lib/utils';

type PaymentChannelType = 'TELEBIRR' | 'KUKU_CBE' | 'SAMUEL_CBE' | 'CASH';

interface PaymentModalProps {
  isOpen: boolean;
  selectedPayment: PaymentChannelType | null;
  selectedWaiter: string;
  totalAmount: number;
  onClose: () => void;
  onSelectPayment: (channel: PaymentChannelType) => void;
  onConfirm: (amountPaid: number, tip: number) => void;
}

export function PaymentModal({
  isOpen,
  selectedPayment,
  selectedWaiter,
  totalAmount,
  onClose,
  onSelectPayment,
  onConfirm,
}: PaymentModalProps) {
  const [receivedAmount, setReceivedAmount] = useState<string>('');

  if (!isOpen) return null;

  const enteredValue = receivedAmount === '' ? totalAmount : parseFloat(receivedAmount) || 0;
  const calculatedTip = Math.max(0, enteredValue - totalAmount);

  const handleQuickAddTip = (tipToAdd: number) => {
    setReceivedAmount((totalAmount + tipToAdd).toString());
  };

  const handleConfirm = () => {
    onConfirm(enteredValue, calculatedTip);
    setReceivedAmount('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Finalize Payment</h2>
            <p className="text-xs text-gray-500">Record customer payment and calculate tips</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Bill Summary */}
          <div className="bg-red-50/60 border border-red-100 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-red-600 uppercase tracking-wider">Bill Amount</p>
              <p className="text-2xl font-black text-[#E4002B]">{formatCurrency(totalAmount)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Waiter</p>
              <span className="inline-block mt-0.5 px-2.5 py-1 bg-white border border-red-200 text-[#E4002B] font-semibold text-xs rounded-full">
                {selectedWaiter}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_CHANNELS.map((channel) => (
                <button
                  key={channel.value}
                  type="button"
                  onClick={() => onSelectPayment(channel.value as PaymentChannelType)}
                  className={`p-3 rounded-xl border text-left font-medium transition-all flex items-center gap-2.5 ${
                    selectedPayment === channel.value
                      ? 'border-[#E4002B] bg-red-50 text-[#E4002B] shadow-sm font-semibold'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                  }`}
                >
                  <span className="text-lg">{channel.icon}</span>
                  <span className="text-xs truncate">{channel.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Paid by Customer Input (Handles Tips) */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Amount Received / Sent (ETB)
              </label>
              {calculatedTip > 0 && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  + {formatCurrency(calculatedTip)} Tip!
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type="number"
                step="1"
                placeholder={totalAmount.toString()}
                value={receivedAmount}
                onChange={(e) => setReceivedAmount(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E4002B] focus:border-transparent"
              />
            </div>

            {/* Quick tip buttons */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-gray-500 font-medium">Quick Tip:</span>
              {[20, 50, 100].map((tip) => (
                <button
                  key={tip}
                  type="button"
                  onClick={() => handleQuickAddTip(tip)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white border border-gray-200 text-gray-700 hover:border-[#E4002B] hover:text-[#E4002B] transition-colors"
                >
                  +{tip}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setReceivedAmount(totalAmount.toString())}
                className="ml-auto text-xs text-gray-500 hover:text-gray-800 underline"
              >
                Exact Bill
              </button>
            </div>
          </div>

          {/* Tip notification banner */}
          {calculatedTip > 0 && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-800">
              <span className="flex items-center gap-1.5 font-medium">
                🎁 Tip recorded for <strong>{selectedWaiter}</strong>
              </span>
              <span className="font-bold text-sm text-emerald-700">{formatCurrency(calculatedTip)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-5 border-t border-gray-100 flex gap-3 bg-gray-50">
          <button
            onClick={() => {
              setReceivedAmount('');
              onClose();
            }}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedPayment || enteredValue < totalAmount}
            className="flex-1 px-4 py-3 bg-[#E4002B] text-white font-bold rounded-xl hover:bg-[#C4002B] disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all"
          >
            Confirm & Save
          </button>
        </div>
      </div>
    </div>
  );
}
