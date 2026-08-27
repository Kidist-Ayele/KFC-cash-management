'use client';

import { formatCurrency } from '@/lib/utils';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any | null;
}

export function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-900">{order.orderNumber}</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {order.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {order.branch} • {order.timestamp}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Key Metadata Grid */}
          <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-semibold">Cashier</span>
              <span className="font-bold text-gray-800">{order.cashier}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-semibold">Waiter</span>
              <span className="font-bold text-gray-800">{order.waiter}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-semibold">Payment</span>
              <span className="font-bold text-[#E4002B]">{order.paymentMethod}</span>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Ordered Items
            </h4>
            {order.rawItems && order.rawItems.length > 0 ? (
              <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                {order.rawItems.map((item: any, idx: number) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs hover:bg-gray-50/50">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-gray-100 font-bold flex items-center justify-center text-gray-700 text-[11px]">
                        {item.quantity}x
                      </span>
                      <span className="font-semibold text-gray-900">
                        {item.menuItem?.name || item.name || 'Dish Item'}
                      </span>
                    </div>
                    <span className="font-bold text-gray-800">
                      {formatCurrency((item.price || 0) * (item.quantity || 1))}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                {order.items} total food & drink items ordered
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-100 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal (Net of VAT)</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>VAT (15% Inclusive)</span>
              <span>{formatCurrency(order.vat)}</span>
            </div>
            {order.tip > 0 && (
              <div className="flex justify-between text-amber-700 font-medium">
                <span>Waiter Tip</span>
                <span>+{formatCurrency(order.tip)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-200 flex justify-between font-black text-sm text-gray-900">
              <span>Total Paid</span>
              <span className="text-[#E4002B]">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
