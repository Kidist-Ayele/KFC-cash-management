'use client';

import { useState } from 'react';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (staff: any) => void;
}

export function AddStaffModal({ isOpen, onClose, onSave }: AddStaffModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    role: 'CASHIER',
    email: '',
    phone: '',
    password: '',
  });

  if (!isOpen) return null;

  const isWaiter = formData.role === 'WAITER';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter staff name');
      return;
    }

    if (!isWaiter && (!formData.email.trim() || !formData.password.trim())) {
      alert('Email and password are required for system accounts');
      return;
    }

    onSave(formData);
    setFormData({
      name: '',
      role: 'CASHIER',
      email: '',
      phone: '',
      password: '',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Add New Staff Member</h3>
            <p className="text-xs text-gray-500">Create login credentials or register a waiter</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-500 font-medium"
            >
              <option value="CASHIER">Cashier (POS & Drawer)</option>
              <option value="WAITER">Waiter (Floor Orders & Tips)</option>
              <option value="MANAGER">Manager (Menu, Staff, Reports)</option>
              <option value="SUPER_ADMIN">Super Admin (Full Company Access)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Samuel K., Marta A."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
              required
            />
          </div>

          {!isWaiter && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="cashier2@kfc.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Temporary Password *
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
              placeholder="+251 9..."
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#E4002B] hover:bg-[#C4002B] text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              Add Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
