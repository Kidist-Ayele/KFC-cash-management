'use client';

import { formatCurrency } from '@/lib/utils';
import { CategoryIcon } from '@/components/shared/CategoryIcon';

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
    <div className="bg-white rounded-xl border border-gray-200 p-3.5 hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center">
            <CategoryIcon category={item.category} className="w-4 h-4" />
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              item.isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {item.isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <h3 className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-1 mb-0.5">{item.name}</h3>
        <p className="text-[11px] text-gray-400 uppercase font-medium">{item.category}</p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
        <p className="text-sm font-black text-[#E4002B]">{formatCurrency(item.price)}</p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleAvailability(item.id)}
            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
            title="Toggle availability"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => onEdit(item.id)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
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
