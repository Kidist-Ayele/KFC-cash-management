'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/shared/Header';
import { StaffTable } from '@/components/manager/StaffTable';
import { AddStaffModal } from '@/components/manager/AddStaffModal';
import { EditStaffModal } from '@/components/admin/EditStaffModal';
import { ConfirmModal } from '@/components/shared/ConfirmModal';

export default function UsersManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const roles = ['All', 'SUPER_ADMIN', 'MANAGER', 'CASHIER', 'WAITER'];
  const statuses = ['All', 'ACTIVE', 'INACTIVE'];

  const fetchAllStaff = useCallback(async () => {
    setIsLoading(true);
    try {
      const [usersRes, waitersRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/waiters?all=true'),
      ]);

      const staffList: any[] = [];

      if (usersRes.ok) {
        const dbUsers = await usersRes.json();
        dbUsers.forEach((u: any) => {
          staffList.push({
            id: u.id,
            name: u.name,
            username: u.email.split('@')[0],
            role: u.role,
            email: u.email,
            phone: '—',
            status: u.isActive ? 'ACTIVE' : 'INACTIVE',
            joinedDate: new Date(u.createdAt).toISOString().split('T')[0],
            isWaiter: false,
          });
        });
      }

      if (waitersRes.ok) {
        const dbWaiters = await waitersRes.json();
        dbWaiters.forEach((w: any) => {
          staffList.push({
            id: w.id,
            name: w.name,
            username: w.name.toLowerCase().replace(/\s+/g, '_'),
            role: 'WAITER',
            email: `${w.name.toLowerCase().replace(/\s+/g, '')}@kfc.com`,
            phone: w.phone || '—',
            status: w.isActive ? 'ACTIVE' : 'INACTIVE',
            joinedDate: new Date(w.createdAt).toISOString().split('T')[0],
            isWaiter: true,
          });
        });
      }

      setUsers(staffList);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllStaff();
  }, [fetchAllStaff]);

  const filteredUsers = users.filter((u) => {
    const roleMatch = roleFilter === 'All' || u.role === roleFilter;
    const statusMatch = statusFilter === 'All' || u.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const queryMatch =
      !query ||
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.role.toLowerCase().includes(query);
    return roleMatch && statusMatch && queryMatch;
  });

  const handleAddUser = async (newUser: any) => {
    try {
      if (newUser.role === 'WAITER') {
        const res = await fetch('/api/waiters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newUser.name, phone: newUser.phone }),
        });
        if (!res.ok) {
          const err = await res.json();
          alert(err.error || 'Failed to add waiter');
          return;
        }
      } else {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newUser.name,
            email: newUser.email,
            password: newUser.password || 'password123',
            role: newUser.role,
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          alert(err.error || 'Failed to add user');
          return;
        }
      }

      setShowAddModal(false);
      await fetchAllStaff();
    } catch (e: any) {
      alert(e.message || 'Error saving user');
    }
  };

  const handleEditClick = (id: string) => {
    const target = users.find((u) => u.id === id);
    if (target) {
      setEditingStaff(target);
    }
  };

  const handleSaveEdit = async (updated: any) => {
    if (updated.isWaiter) {
      const res = await fetch(`/api/waiters/${updated.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: updated.name, phone: updated.phone }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update waiter');
      }
    } else {
      const res = await fetch(`/api/users/${updated.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: updated.name,
          email: updated.email,
          role: updated.role,
          password: updated.password,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update user');
      }
    }

    await fetchAllStaff();
  };

  const handleToggleStatus = async (id: string) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    const newStatus = target.status === 'ACTIVE' ? false : true;

    try {
      if (target.isWaiter) {
        await fetch(`/api/waiters/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive: newStatus }),
        });
      } else {
        await fetch(`/api/users/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive: newStatus }),
        });
      }
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: newStatus ? 'ACTIVE' : 'INACTIVE' } : u))
      );
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDelete = (id: string) => {
    const target = users.find((u) => u.id === id);
    if (target) {
      setDeletingStaff(target);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingStaff) return;
    setIsDeleting(true);
    try {
      if (deletingStaff.isWaiter) {
        await fetch(`/api/waiters/${deletingStaff.id}`, { method: 'DELETE' });
      } else {
        await fetch(`/api/users/${deletingStaff.id}`, { method: 'DELETE' });
      }
      setDeletingStaff(null);
      await fetchAllStaff();
    } catch (err) {
      console.error('Failed to delete staff:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const activeCount = users.filter((u) => u.status === 'ACTIVE').length;
  const inactiveCount = users.filter((u) => u.status === 'INACTIVE').length;
  const cashierCount = users.filter((u) => u.role === 'CASHIER').length;
  const waiterCount = users.filter((u) => u.role === 'WAITER').length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      <Header role="admin" />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              User & Staff Management
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Control access roles for Super Admins, Managers, Cashiers, and Waiters
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-[#E4002B] hover:bg-[#C4002B] text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>+</span>
            <span>Add New Staff</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
            <span className="text-xs font-medium text-gray-500">Total Staff</span>
            <p className="text-xl sm:text-2xl font-black text-gray-900 mt-1">{users.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
            <span className="text-xs font-medium text-gray-500">Active Cashiers</span>
            <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">{cashierCount}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
            <span className="text-xs font-medium text-gray-500">Active Waiters</span>
            <p className="text-xl sm:text-2xl font-black text-amber-600 mt-1">{waiterCount}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
            <span className="text-xs font-medium text-gray-500">Inactive Staff</span>
            <p className="text-xl sm:text-2xl font-black text-red-600 mt-1">{inactiveCount}</p>
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 mr-1">Role:</span>
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    roleFilter === r
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 mr-1">Status:</span>
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === s
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Staff Table */}
        {isLoading ? (
          <div className="p-12 text-center text-gray-400 text-xs">Loading staff records...</div>
        ) : (
          <StaffTable
            staff={filteredUsers}
            onEdit={handleEditClick}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </div>

      <AddStaffModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddUser}
      />

      <EditStaffModal
        isOpen={Boolean(editingStaff)}
        onClose={() => setEditingStaff(null)}
        staff={editingStaff}
        onSave={handleSaveEdit}
      />

      <ConfirmModal
        isOpen={Boolean(deletingStaff)}
        onClose={() => setDeletingStaff(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Remove Staff Member"
        message={`Are you sure you want to remove "${deletingStaff?.name}"? Their account or floor permissions will be revoked.`}
        confirmLabel="Yes, Remove"
        cancelLabel="Cancel"
        isDestructive={true}
      />
    </div>
  );
}
