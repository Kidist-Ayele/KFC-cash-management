'use client';

import { formatCurrency } from '@/lib/utils';

interface ChannelData {
  channel: string;
  amount: number;
  count: number;
  percentage: number;
}

interface ExecutivePaymentChannelsProps {
  channels: ChannelData[];
  totalRevenue: number;
}

const CHANNEL_CONFIG: Record<
  string,
  { label: string; color: string; barColor: string; bgBadge: string; textBadge: string }
> = {
  TELEBIRR: {
    label: 'Telebirr',
    color: '#0085FF',
    barColor: 'bg-[#0085FF]',
    bgBadge: 'bg-blue-50',
    textBadge: 'text-blue-700',
  },
  KUKU_CBE: {
    label: 'KUKU CBE',
    color: '#6B21A8',
    barColor: 'bg-purple-700',
    bgBadge: 'bg-purple-50',
    textBadge: 'text-purple-700',
  },
  SAMUEL_CBE: {
    label: 'Samuel CBE',
    color: '#9333EA',
    barColor: 'bg-purple-500',
    bgBadge: 'bg-fuchsia-50',
    textBadge: 'text-fuchsia-700',
  },
  CASH: {
    label: 'Cash Drawer',
    color: '#16A34A',
    barColor: 'bg-emerald-600',
    bgBadge: 'bg-emerald-50',
    textBadge: 'text-emerald-700',
  },
};

export function ExecutivePaymentChannels({
  channels,
  totalRevenue,
}: ExecutivePaymentChannelsProps) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">Payment Channel Breakdown</h3>
            <p className="text-xs text-gray-500">Live distribution of income sources</p>
          </div>
          <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-600">
            {formatCurrency(totalRevenue)}
          </span>
        </div>

        {/* Visual Channel Stack Bar */}
        <div className="w-full h-3 rounded-full bg-gray-100 flex overflow-hidden mb-6">
          {channels.map((ch) => {
            const config = CHANNEL_CONFIG[ch.channel] || {
              label: ch.channel,
              barColor: 'bg-gray-400',
            };
            if (ch.percentage === 0) return null;
            return (
              <div
                key={ch.channel}
                className={`${config.barColor} transition-all duration-500`}
                style={{ width: `${ch.percentage}%` }}
                title={`${config.label}: ${ch.percentage.toFixed(1)}%`}
              />
            );
          })}
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {channels.map((ch) => {
            const config = CHANNEL_CONFIG[ch.channel] || {
              label: ch.channel,
              color: '#6B7280',
              barColor: 'bg-gray-500',
              bgBadge: 'bg-gray-50',
              textBadge: 'text-gray-700',
            };

            return (
              <div
                key={ch.channel}
                className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                    <span className="font-bold text-xs text-gray-800">{config.label}</span>
                  </div>
                  <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${config.bgBadge} ${config.textBadge}`}>
                    {ch.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-sm font-black text-gray-900">{formatCurrency(ch.amount)}</span>
                  <span className="text-[11px] text-gray-500">{ch.count} orders</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
