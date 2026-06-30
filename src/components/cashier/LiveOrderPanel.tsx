'use client';

import { formatCurrency } from '@/lib/utils';

const WAITERS = ['Desalegn', 'Marta'];

interface OrderItem {
  menuItem: {
    id: string;
    name: string;
    price: number;
    category: string;
  };
  quantity: number;
}

interface LiveOrderPanelProps {
  items: OrderItem[];
  selectedWaiter: string;
  onWaiterChange: (waiter: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onClearCart: () => void;
  onFinalizeOrder: () => void;
  summary: {
    subtotal: number;
    vat: number;
    total: number;
  };
}

export function LiveOrderPanel({
  items,
  selectedWaiter,
  onWaiterChange,
  onUpdateQuantity,
  onClearCart,
  onFinalizeOrder,
  summary,
}: LiveOrderPanelProps) {
  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Live Order</h2>
          <button onClick={onClearCart} className="text-[#E4002B] font-medium hover:underline">Clear</button>
        </div>
        
        {/* Waiter Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Waiter</label>
          <select 
            value={selectedWaiter}
            onChange={(e) => onWaiterChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
          >
            {WAITERS.map(waiter => (
              <option key={waiter} value={waiter}>{waiter}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        {items.length === 0 ? (
          <div className="text-center text-gray-400 mt-12">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p>No items in order</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.menuItem.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-600">
                    {item.menuItem.category}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{item.menuItem.name}</h3>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-[#E4002B] font-bold mt-1">{formatCurrency(item.menuItem.price * item.quantity)}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity + 1)} className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded font-bold">+</button>
                    <button onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity - 1)} className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded font-bold">−</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {items.length > 0 && (
        <div className="p-6 border-t border-gray-200 space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(summary.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">VAT (15%)</span>
              <span className="font-medium">{formatCurrency(summary.vat)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total</span>
              <span className="text-[#E4002B]">{formatCurrency(summary.total)}</span>
            </div>
          </div>
          
          <button onClick={onFinalizeOrder} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-6 text-lg rounded-lg flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            FINALIZE ORDER
          </button>
        </div>
      )}
    </div>
  );
}
