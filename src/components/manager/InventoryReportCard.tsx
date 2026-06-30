'use client';

interface InventoryReportCardProps {
  dateRange: string;
}

export function InventoryReportCard({ dateRange }: InventoryReportCardProps) {
  // Mock data - will be from API
  const inventoryData = {
    categories: [
      {
        name: 'Chicken',
        items: [
          { name: '12 Piece Bucket', stock: 45, sold: 45, status: 'low' },
          { name: '5pc Strips', stock: 78, sold: 63, status: 'good' },
          { name: 'Bucket for 2', stock: 92, sold: 52, status: 'good' },
        ],
      },
      {
        name: 'Burgers',
        items: [
          { name: 'Zinger Burger', stock: 124, sold: 87, status: 'good' },
          { name: 'Classic Burger', stock: 98, sold: 54, status: 'good' },
          { name: 'Double Burger', stock: 67, sold: 38, status: 'good' },
        ],
      },
      {
        name: 'Drinks',
        items: [
          { name: 'Large Soda', stock: 156, sold: 112, status: 'good' },
          { name: 'Medium Soda', stock: 189, sold: 98, status: 'good' },
          { name: 'Water Bottle', stock: 34, sold: 76, status: 'low' },
        ],
      },
      {
        name: 'Extras',
        items: [
          { name: 'Family Size Fries', stock: 89, sold: 45, status: 'good' },
          { name: 'Regular Fries', stock: 145, sold: 89, status: 'good' },
          { name: 'Coleslaw', stock: 67, sold: 34, status: 'good' },
        ],
      },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low': return 'text-red-600 bg-red-100';
      case 'good': return 'text-green-600 bg-green-100';
      case 'out': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'low': return 'Low Stock';
      case 'good': return 'In Stock';
      case 'out': return 'Out of Stock';
      default: return 'Unknown';
    }
  };

  const totalItems = inventoryData.categories.reduce((sum, cat) => sum + cat.items.length, 0);
  const lowStockItems = inventoryData.categories.reduce(
    (sum, cat) => sum + cat.items.filter(i => i.status === 'low').length,
    0
  );
  const totalSold = inventoryData.categories.reduce(
    (sum, cat) => sum + cat.items.reduce((itemSum, i) => itemSum + i.sold, 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Items</p>
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalItems}</p>
          <p className="text-sm text-gray-500 mt-1">Unique products</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Low Stock Alerts</p>
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-red-600">{lowStockItems}</p>
          <p className="text-sm text-red-600 mt-1">Need restock</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Items Sold</p>
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalSold}</p>
          <p className="text-sm text-green-600 mt-1">Total units today</p>
        </div>
      </div>

      {/* Inventory by Category */}
      {inventoryData.categories.map((category, idx) => (
        <div key={idx} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
          </div>
          
          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Current Stock</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sold Today</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {category.items.map((item, itemIdx) => (
                  <tr key={itemIdx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-right text-gray-900 font-medium">{item.stock}</td>
                    <td className="px-6 py-4 text-sm text-right text-gray-600">{item.sold}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden divide-y divide-gray-200">
            {category.items.map((item, itemIdx) => (
              <div key={itemIdx} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {getStatusLabel(item.status)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Current Stock</p>
                    <p className="font-bold text-gray-900">{item.stock}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Sold Today</p>
                    <p className="font-bold text-gray-900">{item.sold}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Stock Movement Chart */}
      <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
        <h3 className="text-lg font-bold mb-4">Stock vs Sold Comparison</h3>
        <div className="space-y-3">
          {inventoryData.categories.flatMap(cat => cat.items).slice(0, 6).map((item, idx) => {
            const maxValue = Math.max(item.stock, item.sold) * 1.2;
            const stockPercent = (item.stock / maxValue) * 100;
            const soldPercent = (item.sold / maxValue) * 100;
            
            return (
              <div key={idx} className="space-y-1">
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-16">Stock:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${stockPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-900 w-8 text-right">{item.stock}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-16">Sold:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#E4002B] h-2 rounded-full"
                      style={{ width: `${soldPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-900 w-8 text-right">{item.sold}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
