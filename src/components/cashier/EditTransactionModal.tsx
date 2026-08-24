'use client';

import { PAYMENT_CHANNELS } from '@/constants/payment';

interface Transaction {
  id: string;
  time: string;
  items: string;
  orderNumber: string;
  amount: number;
  amountPaid?: number;
  tip?: number;
  status: 'Paid' | 'Unpaid';
  waiter: string;
  paymentChannel?: string;
}

interface EditTransactionModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  waitersList?: string[];
  onClose: () => void;
  onSave: () => void;
  onTransactionChange: (field: string, value: any) => void;
}

export function EditTransactionModal({
  isOpen,
  transaction,
  waitersList = ['Desalegn', 'Marta', 'Serkalem'],
  onClose,
  onSave,
  onTransactionChange,
}: EditTransactionModalProps) {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Edit Transaction</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
            <textarea
              value={transaction.items}
              onChange={(e) => onTransactionChange('items', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Waiter</label>
            <select
              value={transaction.waiter}
              onChange={(e) => onTransactionChange('waiter', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
            >
              {waitersList.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Channel</label>
            <select
              value={transaction.paymentChannel || ''}
              onChange={(e) => onTransactionChange('paymentChannel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
            >
              {PAYMENT_CHANNELS.map(channel => (
                <option key={channel.value} value={channel.value}>{channel.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (ETB)</label>
            <input
              type="number"
              step="0.01"
              value={transaction.amount}
              onChange={(e) => onTransactionChange('amount', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tip for Waiter (ETB)</label>
            <input
              type="number"
              step="1"
              value={transaction.tip || 0}
              onChange={(e) => onTransactionChange('tip', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={transaction.status}
              onChange={(e) => onTransactionChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
            >
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        </div>
        
        <div className="p-6 border-t flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={onSave} className="flex-1 px-4 py-3 bg-[#E4002B] text-white rounded-lg hover:bg-[#C4002B]">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
