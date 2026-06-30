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
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-xl font-bold mb-6">Payment Breakdown</h3>
      
      <div className="space-y-4">
        {breakdown.map((item) => (
          <div key={item.channel}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${colors[item.channel as keyof typeof colors]}`}></div>
                <span className="font-medium text-gray-900">{item.channel.replace('_', ' ')}</span>
                <span className="text-sm text-gray-500">({item.count} orders)</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{formatCurrency(item.amount)}</p>
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

      <div className="grid grid-cols-4 gap-3 mt-6 pt-6 border-t">
        {breakdown.map((item) => (
          <div 
            key={item.channel}
            className={`p-3 rounded-lg ${bgColors[item.channel as keyof typeof bgColors]}`}
          >
            <p className={`text-xs font-medium ${textColors[item.channel as keyof typeof textColors]} mb-1`}>
              {item.channel.replace('_', ' ')}
            </p>
            <p className={`text-lg font-bold ${textColors[item.channel as keyof typeof textColors]}`}>
              {item.count}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
