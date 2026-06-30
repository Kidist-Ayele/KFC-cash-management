'use client';

import { Header } from '@/components/shared/Header';
import { SalesReportCard } from '@/components/manager/SalesReportCard';
import { StaffReportCard } from '@/components/manager/StaffReportCard';

export default function AnalyticsPage() {
  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header role="admin" />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Company Analytics</h1>
            <p className="text-sm text-gray-600 mt-1">Comprehensive analytics across all branches</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <SalesReportCard dateRange="today" />
            <StaffReportCard dateRange="today" />
          </div>
        </div>
      </div>
    </>
  );
}
