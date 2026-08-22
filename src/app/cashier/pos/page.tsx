'use client';

import { useState, useEffect, useCallback } from 'react';
import { useOrderStore } from '@/hooks/useOrderStore';
import { Header } from '@/components/shared/Header';
import { POSMenu } from '@/components/cashier/POSMenu';
import { LiveOrderPanel } from '@/components/cashier/LiveOrderPanel';
import { TransactionsTable } from '@/components/cashier/TransactionsTable';
import { PaymentModal } from '@/components/cashier/PaymentModal';
import { EditTransactionModal } from '@/components/cashier/EditTransactionModal';
import type { Category } from '@prisma/client';

type PaymentChannelType = 'TELEBIRR' | 'KUKU_CBE' | 'SAMUEL_CBE' | 'CASH';

interface Transaction {
  id: string;
  time: string;
  items: string;
  orderNumber: string;
  amount: number;
  status: 'Paid' | 'Unpaid';
  waiter: string;
  paymentChannel?: string;
}

interface MenuItemData {
  id: string;
  name: string;
  price: number;
  category: Category;
}

export default function POSPage() {
  const [activeCategory, setActiveCategory] = useState('CHICKEN');
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentChannelType | null>(null);
  const [selectedWaiter, setSelectedWaiter] = useState<string>('Desalegn');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [waiterFilter, setWaiterFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { items, addItem, updateQuantity, clearCart, getOrderSummary } = useOrderStore();
  const summary = getOrderSummary();

  const mapOrderToTransaction = (order: any): Transaction => {
    const itemsList = order.orderItems && order.orderItems.length > 0
      ? order.orderItems.map((oi: any) => `${oi.quantity}x ${oi.menuItem?.name || 'Item'}`).join(', ')
      : 'Order';
    const createdAt = new Date(order.createdAt);
    const timeStr = createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    return {
      id: order.id,
      time: timeStr,
      items: itemsList,
      orderNumber: order.orderNumber,
      amount: order.total,
      status: order.status === 'PAID' ? 'Paid' : 'Unpaid',
      waiter: order.waiter || 'Desalegn',
      paymentChannel: order.paymentChannel || undefined,
    };
  };

  const fetchMenuItems = useCallback(async () => {
    try {
      const res = await fetch('/api/menu');
      if (res.ok) {
        const data = await res.json();
        setMenuItems(data);
      }
    } catch (err) {
      console.error('Failed to fetch menu:', err);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.map(mapOrderToTransaction));
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  }, []);

  useEffect(() => {
    fetchMenuItems();
    fetchOrders();
  }, [fetchMenuItems, fetchOrders]);

  const handleFinalizeOrder = () => {
    if (items.length > 0) {
      setShowPaymentModal(true);
    }
  };

  const handleConfirmPayment = async () => {
    if (isSubmitting || items.length === 0) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.menuItem.id,
            price: item.menuItem.price,
            quantity: item.quantity,
          })),
          subtotal: summary.subtotal,
          vat: summary.vat,
          total: summary.total,
          paymentChannel: selectedPayment || 'CASH',
          waiter: selectedWaiter,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const createdOrder = await res.json();
      const newTransaction = mapOrderToTransaction(createdOrder);

      setTransactions(prev => [newTransaction, ...prev]);
      clearCart();
      setShowPaymentModal(false);
      setSelectedPayment(null);
    } catch (error) {
      console.error('Error confirming order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingTransaction) return;

    try {
      const res = await fetch(`/api/orders/${editingTransaction.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editingTransaction.status === 'Paid' ? 'PAID' : 'UNPAID',
          paymentChannel: editingTransaction.paymentChannel,
          waiter: editingTransaction.waiter,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        const mapped = mapOrderToTransaction(updated);
        setTransactions(prev => prev.map(t => t.id === mapped.id ? mapped : t));
        setShowEditModal(false);
        setEditingTransaction(null);
      } else {
        alert('Failed to update transaction');
      }
    } catch (err) {
      console.error('Error saving transaction:', err);
      alert('Error updating transaction');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setTransactions(prev => prev.filter(t => t.id !== id));
        } else {
          alert('Failed to delete transaction from database');
        }
      } catch (err) {
        console.error('Error deleting order:', err);
        alert('Error deleting transaction');
      }
    }
  };

  const handleTransactionChange = (field: string, value: any) => {
    if (editingTransaction) {
      setEditingTransaction({ ...editingTransaction, [field]: value });
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header showSearch={true} role="cashier" />

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <POSMenu 
              items={menuItems}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              onAddItem={(item) => addItem(item)}
            />

            <TransactionsTable
              transactions={transactions}
              waiterFilter={waiterFilter}
              paymentFilter={paymentFilter}
              onWaiterFilterChange={setWaiterFilter}
              onPaymentFilterChange={setPaymentFilter}
              onEditTransaction={(t) => {
                setEditingTransaction(t);
                setShowEditModal(true);
              }}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>

          <LiveOrderPanel
            items={items}
            selectedWaiter={selectedWaiter}
            onWaiterChange={setSelectedWaiter}
            onUpdateQuantity={updateQuantity}
            onClearCart={clearCart}
            onFinalizeOrder={handleFinalizeOrder}
            summary={summary}
          />
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        selectedPayment={selectedPayment}
        selectedWaiter={selectedWaiter}
        totalAmount={summary.total}
        onClose={() => setShowPaymentModal(false)}
        onSelectPayment={setSelectedPayment}
        onConfirm={handleConfirmPayment}
      />

      <EditTransactionModal
        isOpen={showEditModal}
        transaction={editingTransaction}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        onTransactionChange={handleTransactionChange}
      />
    </>
  );
}
