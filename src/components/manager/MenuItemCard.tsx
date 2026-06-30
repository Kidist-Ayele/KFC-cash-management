'use client';

import { formatCurrency } from '@/lib/utils';

interface MenuItemCardProps {
  item: {
    id: string;
    name: string;
    price: number;
    category: string;
    isAvailable: boolean;
  };
  onEdit: (id: string) => void;
  onToggleAvailability: (id: string) => void;
}

export function MenuItemCard({ item, onEdit, onToggleAvailability }: MenuItemCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
          <p className="text-sm text-gray-500">{item.category}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.isAvailable 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {item.isAvailable ? 'Available' : 'Unavailable'}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-[#E4002B]">{formatCurrency(item.price)}</p>
        <div className="flex gap-2">
          <button
            onClick={() => onToggleAvailability(item.id)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
            title="Toggle availability"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => onEdit(item.id)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
            title="Edit item"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
