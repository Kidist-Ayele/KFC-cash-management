'use client';

import { useState } from 'react';
import { useOrderStore } from '@/hooks/useOrderStore';
import { usePOSData, type Transaction } from '@/hooks/usePOSData';
import { Header } from '@/components/shared/Header';
import { POSMenu } from '@/components/cashier/POSMenu';
import { LiveOrderPanel } from '@/components/cashier/LiveOrderPanel';
import { TransactionsTable } from '@/components/cashier/TransactionsTable';
import { PaymentModal } from '@/components/cashier/PaymentModal';
import { EditTransactionModal } from '@/components/cashier/EditTransactionModal';
import { AddWaiterModal } from '@/components/cashier/AddWaiterModal';

type PaymentChannelType = 'TELEBIRR' | 'KUKU_CBE' | 'SAMUEL_CBE' | 'CASH';

export default function POSPage() {
  const [activeCategory, setActiveCategory] = useState('SHAWARMA');
  const [selectedWaiter, setSelectedWaiter] = useState<string>('Desalegn');
  const [waiterFilter, setWaiterFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');

  // Modals state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentChannelType | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddWaiterModal, setShowAddWaiterModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cart & Order store
  const { items, addItem, updateQuantity, clearCart, getOrderSummary } = useOrderStore();
  const summary = getOrderSummary();

  // POS Data hook (Menu, Waiters, Orders)
  const {
    menuItems,
    waiters,
    transactions,
    addTransaction,
    updateTransaction,
    removeTransaction,
    addWaiter,
  } = usePOSData();

  // Handle Order Checkout
  const handleConfirmPayment = async (amountPaid: number, tip: number) => {
    if (isSubmitting || items.length === 0) return;
    setIsSubmitting(true);

    try {
      const selectedWaiterObj = waiters.find((w) => w.name === selectedWaiter);

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.menuItem.id,
            price: item.menuItem.price,
            quantity: item.quantity,
          })),
          subtotal: summary.subtotal,
          vat: summary.vat,
          total: summary.total,
          amountPaid,
          tip,
          paymentChannel: selectedPayment || 'CASH',
          waiter: selectedWaiter,
          waiterId: selectedWaiterObj?.id,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const createdOrder = await res.json();
      addTransaction(createdOrder);
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

  // Handle Edit Transaction
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
        updateTransaction(updated);
        setShowEditModal(false);
        setEditingTransaction(null);
      } else {
        alert('Failed to update transaction');
      }
    } catch (err) {
      alert('Error updating transaction');
    }
  };

  // Handle Delete Transaction
  const handleDeleteTransaction = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
        if (res.ok) {
          removeTransaction(id);
        } else {
          alert('Failed to delete transaction from database');
        }
      } catch (err) {
        alert('Error deleting transaction');
      }
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header showSearch={true} role="cashier" />

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* Menu Catalog & Daily Orders Table */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <POSMenu
              items={menuItems}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              onAddItem={(item) => addItem(item)}
            />

            <TransactionsTable
              transactions={transactions}
              waitersList={waiters.map((w) => w.name)}
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

          {/* Right Live Order Panel */}
          <LiveOrderPanel
            items={items}
            waiters={waiters}
            selectedWaiter={selectedWaiter}
            onWaiterChange={setSelectedWaiter}
            onOpenAddWaiter={() => setShowAddWaiterModal(true)}
            onUpdateQuantity={updateQuantity}
            onClearCart={clearCart}
            onFinalizeOrder={() => items.length > 0 && setShowPaymentModal(true)}
            summary={summary}
          />
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        selectedPayment={selectedPayment}
        selectedWaiter={selectedWaiter}
        totalAmount={summary.total}
        onClose={() => setShowPaymentModal(false)}
        onSelectPayment={setSelectedPayment}
        onConfirm={handleConfirmPayment}
      />

      {/* Edit Transaction Modal */}
      <EditTransactionModal
        isOpen={showEditModal}
        transaction={editingTransaction}
        waitersList={waiters.map((w) => w.name)}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        onTransactionChange={(field, val) =>
          editingTransaction && setEditingTransaction({ ...editingTransaction, [field]: val })
        }
      />

      {/* Add Waiter Modal */}
      <AddWaiterModal
        isOpen={showAddWaiterModal}
        onClose={() => setShowAddWaiterModal(false)}
        onWaiterAdded={(newWaiter) => {
          addWaiter(newWaiter);
          setSelectedWaiter(newWaiter.name);
        }}
      />
    </>
  );
}
