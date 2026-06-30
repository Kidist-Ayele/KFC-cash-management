'use client';

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
  onConfirm: () => void;
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Select Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>
        
        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
            <p className="text-3xl font-bold text-[#E4002B]">{formatCurrency(totalAmount)}</p>
            <p className="text-sm text-gray-600 mt-2">Waiter: <span className="font-medium text-gray-900">{selectedWaiter}</span></p>
          </div>
          
          <div className="space-y-3">
            {PAYMENT_CHANNELS.map((channel) => (
              <button
                key={channel.value}
                onClick={() => onSelectPayment(channel.value as PaymentChannelType)}
                className={`w-full p-4 rounded-lg border-2 text-left font-medium transition-all ${
                  selectedPayment === channel.value
                    ? 'border-[#E4002B] bg-red-50 text-[#E4002B]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{channel.label}</span>
                  {selectedPayment === channel.value && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-6 border-t flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} disabled={!selectedPayment} className="flex-1 px-4 py-3 bg-[#E4002B] text-white rounded-lg hover:bg-[#C4002B] disabled:opacity-50">Confirm Payment</button>
        </div>
      </div>
    </div>
  );
}
