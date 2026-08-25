'use client';

import { formatCurrency } from '@/lib/utils';

interface FoodSaleItem {
  name: string;
  quantity: number;
  revenue: number;
}

interface FoodSalesBreakdownProps {
  foodSales: FoodSaleItem[];
}

export function FoodSalesBreakdown({ foodSales }: FoodSalesBreakdownProps) {
  const totalItemsSold = foodSales.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4 border-b pb-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Food & Drinks Sold Today</h2>
          <p className="text-xs text-gray-500">Itemized quantities and sales contribution</p>
        </div>
        <span className="px-3 py-1 bg-gray-100 text-gray-800 font-bold rounded-lg text-xs">
          {totalItemsSold} Items Total
        </span>
      </div>

      {foodSales.length === 0 ? (
        <p className="py-8 text-center text-gray-400 text-xs">No food items sold today yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {foodSales.map((item) => (
            <div
              key={item.name}
              className="p-3 rounded-xl bg-gray-50/70 border border-gray-200/80 flex items-center justify-between hover:bg-gray-50"
            >
              <div className="min-w-0 flex-1 pr-2">
                <p className="font-bold text-xs sm:text-sm text-gray-900 truncate">{item.name}</p>
                <p className="text-[11px] text-gray-500">{formatCurrency(item.revenue)}</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-[#E4002B] font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                {item.quantity}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
