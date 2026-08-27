'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/shared/Header';
import { AllTransactionsTable } from '@/components/admin/AllTransactionsTable';
import { OrderDetailsModal } from '@/components/admin/OrderDetailsModal';
import { formatCurrency } from '@/lib/utils';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const paymentMethods = ['All', 'CASH', 'TELEBIRR', 'KUKU_CBE', 'SAMUEL_CBE'];

  useEffect(() => {
    async function loadOrders() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const orders = await res.json();
          const mapped = orders.map((o: any) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            branch: 'Main Branch (Ayat, Addis Ababa)',
            cashier: o.user?.name || 'Cashier',
            waiter: o.waiter || 'Desalegn',
            items: o.orderItems?.reduce((acc: number, it: any) => acc + (it.quantity || 1), 0) || 1,
            subtotal: o.subtotal,
            vat: o.vat,
            total: o.total,
            tip: o.tip || 0,
            rawItems: o.orderItems || [],
            paymentMethod: o.paymentChannel || 'CASH',
            status: o.status === 'PAID' ? 'COMPLETED' : o.status,
            timestamp: new Date(o.createdAt).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }),
          }));
          setTransactions(mapped);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, []);

  const filteredTransactions = transactions.filter((t) => {
    const paymentMatch = paymentFilter === 'All' || t.paymentMethod === paymentFilter;
    const query = searchQuery.toLowerCase().trim();
    const searchMatch =
      !query ||
      t.orderNumber.toLowerCase().includes(query) ||
      t.cashier.toLowerCase().includes(query) ||
      t.waiter.toLowerCase().includes(query);
    return paymentMatch && searchMatch;
  });

  // Calculate summary stats
  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
  const totalOrders = filteredTransactions.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalVAT = filteredTransactions.reduce((sum, t) => sum + (t.vat || 0), 0);

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return;
    const headers = ['Order #,Branch,Cashier,Waiter,Items,Subtotal,VAT,Total,Method,Status,Date\n'];
    const rows = filteredTransactions.map((t) =>
      `"${t.orderNumber}","${t.branch}","${t.cashier}","${t.waiter}",${t.items},${t.subtotal},${t.vat},${t.total},"${t.paymentMethod}","${t.status}","${t.timestamp}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kfc-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      <Header role="admin" />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Master Transactions Ledger
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Live audit of all completed orders across cashiers and channels
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>↓</span>
            <span>Export to CSV / Excel</span>
          </button>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
            <span className="text-xs font-medium text-gray-500">Filtered Revenue</span>
            <p className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
              {formatCurrency(totalRevenue)}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
            <span className="text-xs font-medium text-gray-500">Total Orders</span>
            <p className="text-xl sm:text-2xl font-black text-gray-900 mt-1">{totalOrders}</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
            <span className="text-xs font-medium text-gray-500">Avg Order Value</span>
            <p className="text-xl sm:text-2xl font-black text-blue-600 mt-1">
              {formatCurrency(avgOrderValue)}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
            <span className="text-xs font-medium text-gray-500">VAT Collected (15% Inc.)</span>
            <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
              {formatCurrency(totalVAT)}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                Payment Method
              </label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:border-red-500"
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                Quick Search
              </label>
              <input
                type="text"
                placeholder="Search by Order #, Cashier, Waiter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        {isLoading ? (
          <div className="p-12 text-center text-gray-400 text-xs">Loading live transactions...</div>
        ) : (
          <AllTransactionsTable
            transactions={filteredTransactions}
            onViewDetails={(order) => setSelectedOrder(order)}
          />
        )}
      </div>

      <OrderDetailsModal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </div>
  );
}
