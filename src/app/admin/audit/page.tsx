'use client';

import { useState } from 'react';
import { Header } from '@/components/shared/Header';

export default function AuditLogsPage() {
  const [logs] = useState([
    {
      id: '1',
      user: 'Manager M.',
      action: 'Updated menu item',
      details: 'Changed price of Zinger Burger from 400 to 450 ETB',
      timestamp: '2024-06-30 10:30:00',
      type: 'UPDATE',
    },
    {
      id: '2',
      user: 'Super Admin',
      action: 'Created new user',
      details: 'Added Cashier A to Main Branch',
      timestamp: '2024-06-30 09:15:00',
      type: 'CREATE',
    },
    {
      id: '3',
      user: 'Cashier A',
      action: 'Processed order',
      details: 'Order #9450 - Total: 890 ETB',
      timestamp: '2024-06-30 08:45:00',
      type: 'ORDER',
    },
    {
      id: '4',
      user: 'Manager M.',
      action: 'Deleted transaction',
      details: 'Removed duplicate order #9449',
      timestamp: '2024-06-30 08:30:00',
      type: 'DELETE',
    },
  ]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CREATE': return 'bg-green-100 text-green-700';
      case 'UPDATE': return 'bg-blue-100 text-blue-700';
      case 'DELETE': return 'bg-red-100 text-red-700';
      case 'ORDER': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header role="admin" />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Audit Logs</h1>
              <p className="text-sm text-gray-600 mt-1">Track all system activities and changes</p>
            </div>
            <button className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Logs
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
                <option>All Actions</option>
                <option>CREATE</option>
                <option>UPDATE</option>
                <option>DELETE</option>
                <option>ORDER</option>
              </select>
              <input
                type="text"
                placeholder="Search user..."
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          {/* Logs Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600">{log.timestamp}</td>
                      <td className="px-6 py-4 text-sm font-medium">{log.user}</td>
                      <td className="px-6 py-4 text-sm">{log.action}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{log.details}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(log.type)}`}>
                          {log.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden divide-y divide-gray-200">
              {logs.map((log) => (
                <div key={log.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{log.user}</p>
                      <p className="text-xs text-gray-500">{log.timestamp}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(log.type)}`}>
                      {log.type}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">{log.action}</p>
                  <p className="text-xs text-gray-600">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
