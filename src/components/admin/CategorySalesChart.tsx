'use client';

import { formatCurrency } from '@/lib/utils';
import { FoodIllustration } from '@/components/shared/FoodIllustration';

interface CategoryData {
  category: string;
  quantity: number;
  revenue: number;
  percentage: number;
}

interface DishData {
  name: string;
  category: string;
  quantity: number;
  revenue: number;
}

interface CategorySalesChartProps {
  categoryBreakdown: CategoryData[];
  topDishes: DishData[];
}

export function CategorySalesChart({
  categoryBreakdown,
  topDishes,
}: CategorySalesChartProps) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">Top Selling Dishes</h3>
            <p className="text-xs text-gray-500">Popular items by volume and revenue</p>
          </div>
          <span className="text-xs font-semibold text-gray-500">
            {topDishes.length} Items
          </span>
        </div>

        {topDishes.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-xs">
            No items sold in this timeframe.
          </div>
        ) : (
          <div className="space-y-3">
            {topDishes.map((dish, idx) => (
              <div
                key={dish.name}
                className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 text-xs font-bold text-gray-400 text-center">
                    #{idx + 1}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                    <FoodIllustration category={dish.category} className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 leading-tight">{dish.name}</p>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                      {dish.category}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-black text-gray-900">
                    {formatCurrency(dish.revenue)}
                  </p>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {dish.quantity} sold
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Mini Tags */}
      {categoryBreakdown.length > 0 && (
        <div className="mt-5 pt-4 border-t border-gray-100">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Revenue by Category
          </p>
          <div className="flex flex-wrap gap-1.5">
            {categoryBreakdown.map((cat) => (
              <span
                key={cat.category}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 border border-gray-200 text-[11px] text-gray-700"
              >
                <span className="font-semibold">{cat.category}:</span>
                <span className="text-gray-900 font-bold">{cat.percentage.toFixed(0)}%</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
