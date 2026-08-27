'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/shared/Header';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadAuditLogs() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/admin/audit');
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (err) {
        console.error('Failed to load audit logs:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAuditLogs();
  }, []);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'ORDER':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'SHIFT':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'EXPENSE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'USER':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'ALERT':
        return 'bg-red-50 text-red-700 border-red-200 font-bold';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchType = typeFilter === 'ALL' || log.type === typeFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchQuery =
      !query ||
      log.user.toLowerCase().includes(query) ||
      log.action.toLowerCase().includes(query) ||
      log.details.toLowerCase().includes(query);
    return matchType && matchQuery;
  });

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return;
    const headers = ['Timestamp,User,Role,Action,Type,Details\n'];
    const rows = filteredLogs.map((l) =>
      `"${new Date(l.timestamp).toISOString()}","${l.user}","${l.role}","${l.action}","${l.type}","${l.details}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kfc-audit-log-${new Date().toISOString().split('T')[0]}.csv`;
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
              System Audit & Compliance Log
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Immutable record of cashier shifts, drawer reconciliation, orders, expenses & staff actions
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>↓</span>
            <span>Export Audit Log</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 mr-1">Activity:</span>
            {['ALL', 'ORDER', 'SHIFT', 'EXPENSE', 'USER', 'ALERT'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  typeFilter === t
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder="Search user, action, details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          {isLoading ? (
            <div className="p-16 text-center text-gray-400 text-xs">Loading audit events...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-16 text-center text-gray-400 text-xs">No audit events match your filter.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase text-[11px] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Operational Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLogs.map((log) => {
                    const dateObj = new Date(log.timestamp);
                    const timeStr = dateObj.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    });
                    const dateStr = dateObj.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });

                    return (
                      <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4 font-mono text-gray-500 whitespace-nowrap">
                          <span className="font-semibold text-gray-700">{dateStr}</span>{' '}
                          <span className="text-[10px] text-gray-400">{timeStr}</span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-bold text-gray-900 block">{log.user}</span>
                          <span className="text-[10px] text-gray-400">{log.role}</span>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-800 whitespace-nowrap">
                          {log.action}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-md border text-[10px] uppercase font-bold ${getTypeBadge(
                              log.type
                            )}`}
                          >
                            {log.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 leading-relaxed font-mono text-[11px]">
                          {log.details}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
