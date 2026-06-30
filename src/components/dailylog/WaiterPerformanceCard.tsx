'use client';

import { formatCurrency } from '@/lib/utils';

interface WaiterStat {
  name: string;
  orders: number;
  revenue: number;
}

interface WaiterPerformanceCardProps {
  waiters: WaiterStat[];
}

export function WaiterPerformanceCard({ waiters }: WaiterPerformanceCardProps) {
  const totalOrders = waiters.reduce((sum, w) => sum + w.orders, 0);
  const totalRevenue = waiters.reduce((sum, w) => sum + w.revenue, 0);

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
      <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Waiter Performance</h3>
      
      <div className="space-y-3 sm:space-y-4">
        {waiters.map((waiter, index) => (
          <div key={waiter.name} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xl sm:text-2xl ${
                index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
              }`}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">{waiter.name}</p>
                <p className="text-xs sm:text-sm text-gray-500">{waiter.orders} orders</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-[#E4002B] text-sm sm:text-base">{formatCurrency(waiter.revenue)}</p>
              <p className="text-xs text-gray-500">
                {((waiter.orders / totalOrders) * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t grid grid-cols-2 gap-3 sm:gap-4">
        <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg">
          <p className="text-xs sm:text-sm text-blue-600 font-medium">Total Orders</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-700">{totalOrders}</p>
        </div>
        <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
          <p className="text-xs sm:text-sm text-green-600 font-medium">Total Revenue</p>
          <p className="text-xl sm:text-2xl font-bold text-green-700">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>
    </div>
  );
}
