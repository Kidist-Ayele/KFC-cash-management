'use client';

interface SalesReportCardProps {
  dateRange: string;
}

export function SalesReportCard({ dateRange }: SalesReportCardProps) {
  // Mock data - will be from API
  const salesData = {
    totalRevenue: 125840,
    totalOrders: 342,
    averageOrderValue: 368,
    topSellingItems: [
      { name: '12 Piece Bucket', sold: 45, revenue: 65250 },
      { name: 'Zinger Burger', sold: 87, revenue: 39150 },
      { name: 'Bucket for 2', sold: 52, revenue: 46280 },
      { name: '5pc Strips', sold: 63, revenue: 40950 },
    ],
    hourlyBreakdown: [
      { hour: '10:00', orders: 12, revenue: 4320 },
      { hour: '11:00', orders: 18, revenue: 6480 },
      { hour: '12:00', orders: 45, revenue: 16200 },
      { hour: '13:00', orders: 52, revenue: 18720 },
      { hour: '14:00', orders: 38, revenue: 13680 },
      { hour: '15:00', orders: 28, revenue: 10080 },
      { hour: '16:00', orders: 22, revenue: 7920 },
      { hour: '17:00', orders: 31, revenue: 11160 },
      { hour: '18:00', orders: 42, revenue: 15120 },
      { hour: '19:00', orders: 36, revenue: 12960 },
      { hour: '20:00', orders: 18, revenue: 6480 },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {salesData.totalRevenue.toLocaleString()} Birr
          </p>
          <p className="text-sm text-green-600 mt-1">+12.5% from previous</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Orders</p>
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900">{salesData.totalOrders}</p>
          <p className="text-sm text-blue-600 mt-1">+8.3% from previous</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Avg Order Value</p>
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {salesData.averageOrderValue} Birr
          </p>
          <p className="text-sm text-purple-600 mt-1">+4.2% from previous</p>
        </div>
      </div>

      {/* Top Selling Items */}
      <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
        <h3 className="text-lg font-bold mb-4">Top Selling Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Sold</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {salesData.topSellingItems.map((item, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-600">{item.sold}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                    {item.revenue.toLocaleString()} Birr
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-600">
                    {((item.revenue / salesData.totalRevenue) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hourly Breakdown */}
      <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
        <h3 className="text-lg font-bold mb-4">Hourly Sales Breakdown</h3>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-11 gap-2 min-w-[600px]">
            {salesData.hourlyBreakdown.map((hour) => {
              const maxRevenue = Math.max(...salesData.hourlyBreakdown.map(h => h.revenue));
              const heightPercent = (hour.revenue / maxRevenue) * 100;
              
              return (
                <div key={hour.hour} className="flex flex-col items-center">
                  <div className="h-32 w-full flex items-end justify-center">
                    <div
                      className="w-full bg-[#E4002B] rounded-t hover:bg-[#C4002B] transition-colors cursor-pointer"
                      style={{ height: `${heightPercent}%` }}
                      title={`${hour.orders} orders - ${hour.revenue.toLocaleString()} Birr`}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{hour.hour}</p>
                  <p className="text-xs font-medium text-gray-900">{hour.orders}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
