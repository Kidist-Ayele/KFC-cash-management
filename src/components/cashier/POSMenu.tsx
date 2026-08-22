'use client';

import { INITIAL_MENU_ITEMS, MENU_CATEGORIES } from '@/constants/menu';
import { formatCurrency } from '@/lib/utils';
import type { Category } from '@prisma/client';

interface POSMenuProps {
  items?: { id: string; name: string; price: number; category: Category }[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onAddItem: (item: { id: string; name: string; price: number; category: Category }) => void;
}

export function POSMenu({ items, activeCategory, onCategoryChange, onAddItem }: POSMenuProps) {
  const menuSource = items && items.length > 0 ? items : INITIAL_MENU_ITEMS;
  const filteredItems = menuSource.filter(item => item.category === activeCategory);

  return (
    <div className="mb-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
        {MENU_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-colors ${
              activeCategory === cat.value
                ? 'bg-[#E4002B] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      
      {/* Menu Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onAddItem(item)}
            className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 hover:shadow-lg transition-all"
          >
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-2 sm:mb-3 flex items-center justify-center text-gray-400 text-xs sm:text-sm">
              {item.category}
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base truncate">{item.name}</h3>
            <div className="flex items-center justify-between">
              <span className="text-[#E4002B] font-bold text-sm sm:text-base">{formatCurrency(item.price)}</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E4002B] flex items-center justify-center text-white font-bold text-sm sm:text-base">+</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
