'use client';

import { useState } from 'react';
import { Header } from '@/components/shared/Header';
import { StaffTable } from '@/components/manager/StaffTable';
import { AddStaffModal } from '@/components/manager/AddStaffModal';

export default function StaffManagementPage() {
  const [staff, setStaff] = useState([
    {
      id: '1',
      name: 'Cashier A',
      username: 'cashier_a',
      role: 'CASHIER',
      email: 'cashier.a@kfc.com',
      phone: '+251911234567',
      status: 'ACTIVE',
      joinedDate: '2024-01-15',
    },
    {
      id: '2',
      name: 'Desalegn',
      username: 'desalegn',
      role: 'WAITER',
      email: 'desalegn@kfc.com',
      phone: '+251922345678',
      status: 'ACTIVE',
      joinedDate: '2024-02-01',
    },
    {
      id: '3',
      name: 'Marta',
      username: 'marta',
      role: 'WAITER',
      email: 'marta@kfc.com',
      phone: '+251933456789',
      status: 'ACTIVE',
      joinedDate: '2024-02-01',
    },
    {
      id: '4',
      name: 'Manager M.',
      username: 'manager_m',
      role: 'MANAGER',
      email: 'manager@kfc.com',
      phone: '+251944567890',
      status: 'ACTIVE',
      joinedDate: '2024-01-01',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const roles = ['All', 'CASHIER', 'WAITER', 'MANAGER', 'ADMIN'];
  const statuses = ['All', 'ACTIVE', 'INACTIVE'];

  const filteredStaff = staff.filter(s => {
    const roleMatch = roleFilter === 'All' || s.role === roleFilter;
    const statusMatch = statusFilter === 'All' || s.status === statusFilter;
    return roleMatch && statusMatch;
  });

  const handleAddStaff = (newStaff: any) => {
    const staffMember = {
      ...newStaff,
      id: `staff-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
    };
    setStaff([...staff, staffMember]);
    setShowAddModal(false);
    alert('Staff member added successfully!');
  };

  const handleToggleStatus = (id: string) => {
    setStaff(staff.map(s => 
      s.id === id 
        ? { ...s, status: s.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } 
        : s
    ));
  };

  const handleEdit = (id: string) => {
    alert(`Edit staff ${id} - Feature coming soon`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      setStaff(staff.filter(s => s.id !== id));
    }
  };

  const activeCount = staff.filter(s => s.status === 'ACTIVE').length;
  const inactiveCount = staff.filter(s => s.status === 'INACTIVE').length;

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header role="manager" />

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">{staff.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{activeCount}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-red-600">{inactiveCount}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">Roles</p>
              <p className="text-2xl font-bold text-blue-600">4</p>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Filter by Role</label>
                  <div className="flex flex-wrap gap-2">
                    {roles.map(role => (
                      <button
                        key={role}
                        onClick={() => setRoleFilter(role)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                          roleFilter === role
                            ? 'bg-[#E4002B] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Filter by Status</label>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map(status => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                          statusFilter === status
                            ? 'bg-[#E4002B] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="w-full sm:w-auto px-6 py-2 bg-[#E4002B] text-white rounded-lg hover:bg-[#C4002B] flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Add Staff
              </button>
            </div>
          </div>

          {/* Staff Table */}
          <StaffTable
            staff={filteredStaff}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />

          {filteredStaff.length === 0 && (
            <div className="text-center py-12 text-gray-400 bg-white rounded-lg border border-gray-200">
              <p>No staff members found</p>
            </div>
          )}
        </div>
      </div>

      <AddStaffModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddStaff}
      />
    </>
  );
}
