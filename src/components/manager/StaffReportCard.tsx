'use client';

interface StaffReportCardProps {
  dateRange: string;
}

export function StaffReportCard({ dateRange }: StaffReportCardProps) {
  // Mock data - will be from API
  const staffPerformance = [
    {
      name: 'Desalegn',
      role: 'WAITER',
      ordersServed: 195,
      revenue: 72400,
      averageOrderValue: 371,
      customerRating: 4.8,
      hoursWorked: 8.5,
    },
    {
      name: 'Marta',
      role: 'WAITER',
      ordersServed: 147,
      revenue: 53440,
      averageOrderValue: 363,
      customerRating: 4.9,
      hoursWorked: 8.0,
    },
    {
      name: 'Cashier A',
      role: 'CASHIER',
      ordersServed: 342,
      revenue: 125840,
      averageOrderValue: 368,
      customerRating: 4.7,
      hoursWorked: 9.0,
    },
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'CASHIER': return 'bg-green-100 text-green-700';
      case 'WAITER': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Staff Active</p>
          <p className="text-2xl font-bold text-gray-900">{staffPerformance.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Orders Served</p>
          <p className="text-2xl font-bold text-blue-600">
            {staffPerformance.reduce((sum, s) => sum + s.ordersServed, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Avg Rating</p>
          <p className="text-2xl font-bold text-yellow-600">
            {(staffPerformance.reduce((sum, s) => sum + s.customerRating, 0) / staffPerformance.length).toFixed(1)} ⭐
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Hours</p>
          <p className="text-2xl font-bold text-purple-600">
            {staffPerformance.reduce((sum, s) => sum + s.hoursWorked, 0).toFixed(1)}h
          </p>
        </div>
      </div>

      {/* Staff Performance Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold">Individual Performance</h3>
        </div>
        
        {/* Desktop View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Orders</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Order</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {staffPerformance.map((staff, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#E4002B] flex items-center justify-center text-white font-bold">
                        {staff.name.charAt(0)}
                      </div>
                      <span className="ml-3 font-medium text-gray-900">{staff.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(staff.role)}`}>
                      {staff.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">{staff.ordersServed}</td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">
                    {staff.revenue.toLocaleString()} Birr
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">{staff.averageOrderValue} Birr</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-1 text-yellow-600 font-medium">
                      {staff.customerRating} ⭐
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">{staff.hoursWorked}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet View */}
        <div className="lg:hidden divide-y divide-gray-200">
          {staffPerformance.map((staff, idx) => (
            <div key={idx} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#E4002B] flex items-center justify-center text-white font-bold">
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{staff.name}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(staff.role)}`}>
                      {staff.role}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-yellow-600 font-medium">{staff.customerRating} ⭐</p>
                  <p className="text-xs text-gray-500">{staff.hoursWorked}h</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-gray-600">Orders</p>
                  <p className="text-lg font-bold text-gray-900">{staff.ordersServed}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Revenue</p>
                  <p className="text-lg font-bold text-gray-900">{(staff.revenue / 1000).toFixed(1)}K</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Avg Order</p>
                  <p className="text-lg font-bold text-gray-900">{staff.averageOrderValue}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Comparison Chart */}
      <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
        <h3 className="text-lg font-bold mb-4">Revenue Comparison</h3>
        <div className="space-y-4">
          {staffPerformance.map((staff, idx) => {
            const maxRevenue = Math.max(...staffPerformance.map(s => s.revenue));
            const widthPercent = (staff.revenue / maxRevenue) * 100;
            
            return (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{staff.name}</span>
                  <span className="text-sm font-bold text-gray-900">
                    {staff.revenue.toLocaleString()} Birr
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-[#E4002B] h-3 rounded-full transition-all"
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
