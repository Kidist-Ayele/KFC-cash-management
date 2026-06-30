'use client';

import { INITIAL_MENU_ITEMS, MENU_CATEGORIES } from '@/constants/menu';
import { formatCurrency } from '@/lib/utils';
import type { Category } from '@prisma/client';

interface POSMenuProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onAddItem: (item: { id: string; name: string; price: number; category: Category }) => void;
}

export function POSMenu({ activeCategory, onCategoryChange, onAddItem }: POSMenuProps) {
  const filteredItems = INITIAL_MENU_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div>
      {/* Category Tabs */}
      <div className="flex gap-2 mb-6">
        {MENU_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
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
      <div className="grid grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onAddItem(item)}
            className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all"
          >
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center text-gray-400 text-sm">
              {item.category}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
            <div className="flex items-center justify-between">
              <span className="text-[#E4002B] font-bold">{formatCurrency(item.price)}</span>
              <div className="w-8 h-8 rounded-full bg-[#E4002B] flex items-center justify-center text-white font-bold">+</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
