'use client';

interface ActivityStat {
  value: string;
  label: string;
}

interface ActivitySummaryCardProps {
  stats: ActivityStat[];
}

export function ActivitySummaryCard({ stats }: ActivitySummaryCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h3 className="text-xl font-bold mb-6">Activity Summary</h3>
      <div className="grid grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-[#E4002B]">{stat.value}</p>
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
