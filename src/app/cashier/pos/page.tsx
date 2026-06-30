'use client';

import { useState } from 'react';
import { useOrderStore } from '@/hooks/useOrderStore';
import { CashierHeader } from '@/components/shared/CashierHeader';
import { POSMenu } from '@/components/cashier/POSMenu';
import { LiveOrderPanel } from '@/components/cashier/LiveOrderPanel';
import { TransactionsTable } from '@/components/cashier/TransactionsTable';
import { PaymentModal } from '@/components/cashier/PaymentModal';
import { EditTransactionModal } from '@/components/cashier/EditTransactionModal';

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

export default function POSPage() {
  const [activeCategory, setActiveCategory] = useState('CHICKEN');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentChannelType | null>(null);
  const [selectedWaiter, setSelectedWaiter] = useState<string>('Desalegn');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [waiterFilter, setWaiterFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const { items, addItem, updateQuantity, clearCart, getOrderSummary } = useOrderStore();
  const summary = getOrderSummary();

  const handleFinalizeOrder = () => {
    if (items.length > 0) {
      setShowPaymentModal(true);
    }
  };

  const handleConfirmPayment = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const orderNumber = `ORDER #${9400 + transactions.length + 1}`;
    const itemsList = items.map(item => `${item.quantity}x ${item.menuItem.name}`).join(', ');
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      time: timeStr,
      items: itemsList,
      orderNumber,
      amount: summary.total,
      status: 'Paid',
      waiter: selectedWaiter,
      paymentChannel: selectedPayment || undefined,
    };
    
    setTransactions([newTransaction, ...transactions]);
    clearCart();
    setShowPaymentModal(false);
    setSelectedPayment(null);
  };

  const handleSaveEdit = () => {
    if (editingTransaction) {
      setTransactions(transactions.map(t => 
        t.id === editingTransaction.id ? editingTransaction : t
      ));
      setShowEditModal(false);
      setEditingTransaction(null);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(transactions.filter(t => t.id !== id));
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
        <CashierHeader title="CASHFLOW PRO" showSearch={true} />

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto">
            <POSMenu 
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
