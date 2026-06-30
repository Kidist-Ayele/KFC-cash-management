'use client';

import { formatCurrency } from '@/lib/utils';

interface PaymentBreakdown {
  channel: string;
  amount: number;
  count: number;
  percentage: number;
}

interface PaymentBreakdownChartProps {
  breakdown: PaymentBreakdown[];
}

export function PaymentBreakdownChart({ breakdown }: PaymentBreakdownChartProps) {
  const colors = {
    'TELEBIRR': 'bg-blue-500',
    'KUKU_CBE': 'bg-green-500',
    'SAMUEL_CBE': 'bg-purple-500',
    'CASH': 'bg-emerald-500',
  };

  const textColors = {
    'TELEBIRR': 'text-blue-700',
    'KUKU_CBE': 'text-green-700',
    'SAMUEL_CBE': 'text-purple-700',
    'CASH': 'text-emerald-700',
  };

  const bgColors = {
    'TELEBIRR': 'bg-blue-50',
    'KUKU_CBE': 'bg-green-50',
    'SAMUEL_CBE': 'bg-purple-50',
    'CASH': 'bg-emerald-50',
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
      <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Payment Breakdown</h3>
      
      <div className="space-y-3 sm:space-y-4">
        {breakdown.map((item) => (
          <div key={item.channel}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${colors[item.channel as keyof typeof colors]}`}></div>
                <span className="font-medium text-gray-900 text-sm sm:text-base">{item.channel.replace('_', ' ')}</span>
                <span className="text-xs sm:text-sm text-gray-500">({item.count})</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 text-sm sm:text-base">{formatCurrency(item.amount)}</p>
                <p className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${colors[item.channel as keyof typeof colors]}`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
        {breakdown.map((item) => (
          <div 
            key={item.channel}
            className={`p-2 sm:p-3 rounded-lg ${bgColors[item.channel as keyof typeof bgColors]}`}
          >
            <p className={`text-xs font-medium ${textColors[item.channel as keyof typeof textColors]} mb-1 truncate`}>
              {item.channel.replace('_', ' ')}
            </p>
            <p className={`text-base sm:text-lg font-bold ${textColors[item.channel as keyof typeof textColors]}`}>
              {item.count}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
