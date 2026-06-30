'use client';

import { useState } from 'react';
import { Header } from '@/components/shared/Header';
import { SalesReportCard } from '@/components/manager/SalesReportCard';
import { StaffReportCard } from '@/components/manager/StaffReportCard';
import { InventoryReportCard } from '@/components/manager/InventoryReportCard';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('today');
  const [reportType, setReportType] = useState('sales');

  const dateRanges = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' },
  ];

  const reportTypes = [
    { value: 'sales', label: 'Sales Report', icon: '💰' },
    { value: 'staff', label: 'Staff Performance', icon: '👥' },
    { value: 'inventory', label: 'Inventory Report', icon: '📦' },
  ];

  const handleExportPDF = () => {
    alert('Exporting to PDF - Feature coming soon');
  };

  const handleExportExcel = () => {
    alert('Exporting to Excel - Feature coming soon');
  };

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header role="manager" />

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Report Controls */}
          <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Date Range Selector */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Date Range
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {dateRanges.map(range => (
                    <button
                      key={range.value}
                      onClick={() => setDateRange(range.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        dateRange === range.value
                          ? 'bg-[#E4002B] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
                {dateRange === 'custom' && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="date"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
                      placeholder="Start Date"
                    />
                    <input
                      type="date"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
                      placeholder="End Date"
                    />
                  </div>
                )}
              </div>

              {/* Export Options */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Export Report
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleExportPDF}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Export PDF
                  </button>
                  <button
                    onClick={handleExportExcel}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Excel
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Report Type Tabs */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {reportTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => setReportType(type.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    reportType === type.value
                      ? 'border-[#E4002B] bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <p className="font-semibold text-gray-900">{type.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Report Content */}
          {reportType === 'sales' && <SalesReportCard dateRange={dateRange} />}
          {reportType === 'staff' && <StaffReportCard dateRange={dateRange} />}
          {reportType === 'inventory' && <InventoryReportCard dateRange={dateRange} />}
        </div>
      </div>
    </>
  );
}
