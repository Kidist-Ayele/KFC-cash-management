'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/shared/Header';
import { MenuItemCard } from '@/components/manager/MenuItemCard';
import { AddMenuItemModal } from '@/components/manager/AddMenuItemModal';
import { INITIAL_MENU_ITEMS } from '@/constants/menu';

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState(
    INITIAL_MENU_ITEMS.map(item => ({ ...item, isAvailable: true }))
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    'All',
    'SHAWARMA',
    'ROASTED',
    'CRISPY',
    'BURGER',
    'FISH',
    'PIZZA',
    'DRINKS',
    'EXTRAS',
  ];

  const fetchMenu = useCallback(async () => {
    try {
      const res = await fetch('/api/menu?all=true');
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setMenuItems(data);
        }
      }
    } catch (err) {
      console.error('Failed to load menu items:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const filteredItems = categoryFilter === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === categoryFilter);

  const handleToggleAvailability = async (id: string) => {
    const currentItem = menuItems.find(i => i.id === id);
    if (!currentItem) return;
    const newStatus = !currentItem.isAvailable;

    // Optimistic UI update
    setMenuItems(items => 
      items.map(item => 
        item.id === id ? { ...item, isAvailable: newStatus } : item
      )
    );

    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: newStatus }),
      });
      if (!res.ok) {
        // Revert on error
        setMenuItems(items => 
          items.map(item => 
            item.id === id ? { ...item, isAvailable: !newStatus } : item
          )
        );
      }
    } catch (err) {
      console.error('Failed to update availability:', err);
    }
  };

  const handleEdit = (id: string) => {
    alert(`Edit item ${id} - Feature coming soon`);
  };

  const handleAddItem = async (newItem: any) => {
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      if (res.ok) {
        const created = await res.json();
        setMenuItems(prev => [...prev, created]);
        setShowAddModal(false);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to add item');
      }
    } catch (err) {
      console.error('Error adding item:', err);
      alert('Error adding menu item');
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header role="manager" />

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{menuItems.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold text-green-600">
                {menuItems.filter(i => i.isAvailable).length}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">Unavailable</p>
              <p className="text-2xl font-bold text-red-600">
                {menuItems.filter(i => !i.isAvailable).length}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-blue-600">4</p>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm ${
                      categoryFilter === cat
                        ? 'bg-[#E4002B] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="w-full sm:w-auto px-6 py-2 bg-[#E4002B] text-white rounded-lg hover:bg-[#C4002B] flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Item
              </button>
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map(item => (
              <MenuItemCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onToggleAvailability={handleToggleAvailability}
              />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>No items found in this category</p>
            </div>
          )}
        </div>
      </div>

      <AddMenuItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddItem}
      />
    </>
  );
}
