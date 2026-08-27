'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/shared/Header';
import { AddBranchModal } from '@/components/admin/AddBranchModal';
import { EditBranchModal } from '@/components/admin/EditBranchModal';
import { ConfirmModal } from '@/components/shared/ConfirmModal';

export default function BranchesPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any | null>(null);
  const [deletingBranch, setDeletingBranch] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBranches = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/branches');
      if (res.ok) {
        const data = await res.json();
        setBranches(data);
      }
    } catch (err) {
      console.error('Failed to load branches:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const handleAddBranch = async (newBranchData: any) => {
    const res = await fetch('/api/branches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBranchData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create branch');
    }

    await fetchBranches();
  };

  const handleSaveEdit = async (updatedData: any) => {
    const res = await fetch(`/api/branches/${updatedData.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update branch');
    }

    await fetchBranches();
  };

  const handleConfirmDelete = async () => {
    if (!deletingBranch) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/branches/${deletingBranch.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDeletingBranch(null);
        await fetchBranches();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete branch');
      }
    } catch (err) {
      console.error('Error deleting branch:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredBranches = branches.filter((b) => {
    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchQuery =
      !query ||
      b.name.toLowerCase().includes(query) ||
      b.location.toLowerCase().includes(query) ||
      (b.manager && b.manager.toLowerCase().includes(query));
    return matchStatus && matchQuery;
  });

  const totalBranches = branches.length;
  const activeBranches = branches.filter((b) => b.status === 'ACTIVE').length;
  const totalStaff = branches.reduce((sum, b) => sum + (b.staffCount || 0), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'COMING_SOON':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      <Header role="admin" />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Top Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Branch & Facility Management
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Overview of all active locations, upcoming facilities, and assigned management
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-[#E4002B] hover:bg-[#C4002B] text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>+</span>
            <span>Add New Branch</span>
          </button>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Branches
            </span>
            <p className="text-2xl font-black text-gray-900 mt-1">{totalBranches}</p>
            <span className="text-[11px] text-gray-400">Company facilities</span>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Active Locations
            </span>
            <p className="text-2xl font-black text-emerald-600 mt-1">{activeBranches}</p>
            <span className="text-[11px] text-emerald-600 font-semibold">Currently operating</span>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Assigned Staff
            </span>
            <p className="text-2xl font-black text-blue-600 mt-1">{totalStaff}</p>
            <span className="text-[11px] text-gray-400">Total team across branches</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 mr-1">Status:</span>
            {['ALL', 'ACTIVE', 'COMING_SOON', 'INACTIVE'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === status
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'ALL'
                  ? 'All'
                  : status === 'ACTIVE'
                  ? 'Active'
                  : status === 'COMING_SOON'
                  ? 'Coming Soon'
                  : 'Inactive'}
              </button>
            ))}
          </div>

          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder="Search branch name, location, manager..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Branch Cards Grid (The UI you loved!) */}
        {isLoading ? (
          <div className="p-16 text-center text-gray-400 text-xs">Loading branches from database...</div>
        ) : filteredBranches.length === 0 ? (
          <div className="p-16 text-center text-gray-400 text-xs bg-white rounded-xl border border-gray-200">
            No branches match your search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBranches.map((branch) => (
              <div
                key={branch.id}
                className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs hover:shadow-md hover:border-red-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{branch.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{branch.location}</p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(
                        branch.status
                      )}`}
                    >
                      {branch.status}
                    </span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl space-y-2 text-xs border border-gray-100 my-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Branch Manager:</span>
                      <span className="font-bold text-gray-800">{branch.manager || 'Unassigned'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Contact:</span>
                      <span className="font-medium text-gray-700">{branch.phone || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Staff Count:</span>
                      <span className="font-bold text-gray-900">{branch.staffCount || 0} members</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => setEditingBranch(branch)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeletingBranch(branch)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Branch Modal */}
      <AddBranchModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddBranch}
      />

      {/* Edit Branch Modal */}
      <EditBranchModal
        isOpen={Boolean(editingBranch)}
        onClose={() => setEditingBranch(null)}
        branch={editingBranch}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingBranch)}
        onClose={() => setDeletingBranch(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Branch"
        message={`Are you sure you want to delete "${deletingBranch?.name}"? This action cannot be undone.`}
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        isDestructive={true}
      />
    </div>
  );
}
