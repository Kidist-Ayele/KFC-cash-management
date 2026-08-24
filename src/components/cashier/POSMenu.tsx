'use client';

import { INITIAL_MENU_ITEMS, MENU_CATEGORIES } from '@/constants/menu';
import { formatCurrency } from '@/lib/utils';
import { CategoryIcon } from '@/components/shared/CategoryIcon';
import { FoodIllustration } from '@/components/shared/FoodIllustration';
import type { Category } from '@prisma/client';

interface POSMenuProps {
  items?: { id: string; name: string; price: number; category: Category }[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onAddItem: (item: { id: string; name: string; price: number; category: Category }) => void;
}

// Category theme colors: subtle background tints, border accents, and badge colors
const CATEGORY_THEMES: Record<
  string,
  {
    bgCard: string;
    bgIcon: string;
    textColor: string;
    borderColor: string;
    activeTab: string;
  }
> = {
  SHAWARMA: {
    bgCard: 'bg-amber-50/40 hover:bg-amber-50/80',
    bgIcon: 'bg-amber-100/80 text-amber-700',
    textColor: 'text-amber-800',
    borderColor: 'border-amber-200/70 hover:border-amber-400',
    activeTab: 'bg-amber-600 text-white border-amber-600',
  },
  ROASTED: {
    bgCard: 'bg-orange-50/40 hover:bg-orange-50/80',
    bgIcon: 'bg-orange-100/80 text-orange-700',
    textColor: 'text-orange-800',
    borderColor: 'border-orange-200/70 hover:border-orange-400',
    activeTab: 'bg-orange-600 text-white border-orange-600',
  },
  CRISPY: {
    bgCard: 'bg-red-50/30 hover:bg-red-50/70',
    bgIcon: 'bg-red-100/80 text-[#E4002B]',
    textColor: 'text-red-900',
    borderColor: 'border-red-200/70 hover:border-red-400',
    activeTab: 'bg-[#E4002B] text-white border-[#E4002B]',
  },
  BURGER: {
    bgCard: 'bg-yellow-50/40 hover:bg-yellow-50/80',
    bgIcon: 'bg-yellow-100 text-yellow-800',
    textColor: 'text-yellow-900',
    borderColor: 'border-yellow-200/70 hover:border-yellow-400',
    activeTab: 'bg-yellow-600 text-white border-yellow-600',
  },
  FISH: {
    bgCard: 'bg-cyan-50/40 hover:bg-cyan-50/80',
    bgIcon: 'bg-cyan-100/80 text-cyan-700',
    textColor: 'text-cyan-900',
    borderColor: 'border-cyan-200/70 hover:border-cyan-400',
    activeTab: 'bg-cyan-600 text-white border-cyan-600',
  },
  PIZZA: {
    bgCard: 'bg-rose-50/30 hover:bg-rose-50/70',
    bgIcon: 'bg-rose-100/80 text-rose-700',
    textColor: 'text-rose-900',
    borderColor: 'border-rose-200/70 hover:border-rose-400',
    activeTab: 'bg-rose-600 text-white border-rose-600',
  },
  DRINKS: {
    bgCard: 'bg-emerald-50/30 hover:bg-emerald-50/70',
    bgIcon: 'bg-emerald-100/80 text-emerald-700',
    textColor: 'text-emerald-900',
    borderColor: 'border-emerald-200/70 hover:border-emerald-400',
    activeTab: 'bg-emerald-600 text-white border-emerald-600',
  },
  EXTRAS: {
    bgCard: 'bg-purple-50/30 hover:bg-purple-50/70',
    bgIcon: 'bg-purple-100/80 text-purple-700',
    textColor: 'text-purple-900',
    borderColor: 'border-purple-200/70 hover:border-purple-400',
    activeTab: 'bg-purple-600 text-white border-purple-600',
  },
};

export function POSMenu({ items, activeCategory, onCategoryChange, onAddItem }: POSMenuProps) {
  const menuSource = items && items.length > 0 ? items : INITIAL_MENU_ITEMS;
  const filteredItems = menuSource.filter((item) => item.category === activeCategory);
  const currentTheme = CATEGORY_THEMES[activeCategory] || CATEGORY_THEMES.CRISPY;

  return (
    <div className="mb-6 space-y-4">
      {/* Category Filter Tabs with theme highlight */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {MENU_CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.value;
          const theme = CATEGORY_THEMES[cat.value] || CATEGORY_THEMES.CRISPY;
          return (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isSelected
                  ? `${theme.activeTab} shadow-md scale-105`
                  : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
              }`}
            >
              <CategoryIcon
                category={cat.value}
                className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-400'}`}
              />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Food & Drink Cards with colorful, creative styling */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onAddItem(item)}
            className={`group rounded-2xl p-3.5 border transition-all text-left flex flex-col justify-between shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] ${currentTheme.bgCard} ${currentTheme.borderColor}`}
          >
            {/* Top row: Illustration Badge + Tag */}
            <div className="flex items-start justify-between gap-2 mb-2.5">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center p-1.5 transition-transform group-hover:scale-110 shadow-xs ${currentTheme.bgIcon}`}
              >
                <FoodIllustration
                  name={item.name}
                  category={item.category}
                  className="w-7 h-7"
                />
              </div>

              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/80 border border-gray-100 text-gray-500 shadow-2xs">
                {item.category}
              </span>
            </div>

            {/* Item Title */}
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-2 leading-snug mb-2 min-h-[2.2rem]">
              {item.name}
            </h3>

            {/* Bottom Row: Price & Distinct Clickable Add Button */}
            <div className="flex items-center justify-between pt-2 border-t border-black/5 mt-auto">
              <div>
                <span className="text-[10px] text-gray-400 font-bold block leading-none">PRICE</span>
                <span className="text-[#E4002B] font-black text-sm sm:text-base tabular-nums">
                  {formatCurrency(item.price)}
                </span>
              </div>

              <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 group-hover:bg-[#E4002B] group-hover:border-[#E4002B] text-gray-600 group-hover:text-white flex items-center justify-center text-xs font-bold shadow-xs transition-colors">
                +
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
