'use client';

import { formatCurrency } from '@/lib/utils';

interface RevenueData {
  branch: string;
  revenue: number;
  percentage: number;
}

interface RevenueComparisonChartProps {
  data: RevenueData[];
}

export function RevenueComparisonChart({ data }: RevenueComparisonChartProps) {
  const colors = ['bg-purple-500', 'bg-blue-500', 'bg-green-500'];
  
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
      <h3 className="text-lg font-bold mb-4">Revenue by Branch</h3>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={item.branch}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${colors[index]}`}></div>
                <span className="font-medium text-sm">{item.branch}</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">{formatCurrency(item.revenue)}</p>
                <p className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${colors[index]}`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total Company Revenue</span>
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(data.reduce((sum, item) => sum + item.revenue, 0))}
          </span>
        </div>
      </div>
    </div>
  );
}
