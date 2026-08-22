'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/shared/Header';
import { AddExpenseForm } from '@/components/expenses/AddExpenseForm';
import { ExpensesDashboard } from '@/components/expenses/ExpensesDashboard';

interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  addedBy: string;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: 0,
    category: 'Supplies',
  });
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Supplies', 'Ingredients', 'Utilities', 'Maintenance', 'Other'];

  const formatCategoryName = (cat: string) => {
    return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
  };

  const mapExpense = (dbExpense: any): Expense => {
    const createdAt = new Date(dbExpense.createdAt);
    return {
      id: dbExpense.id,
      date: createdAt.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      description: dbExpense.description,
      amount: dbExpense.amount,
      category: formatCategoryName(dbExpense.category),
      addedBy: dbExpense.addedBy || 'Cashier',
    };
  };

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await fetch('/api/expenses');
      if (res.ok) {
        const data = await res.json();
        setExpenses(data.map(mapExpense));
      }
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAddExpense = async () => {
    if (newExpense.description && newExpense.amount > 0 && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description: newExpense.description,
            amount: newExpense.amount,
            category: newExpense.category,
            addedBy: 'Lishan B.',
          }),
        });

        if (res.ok) {
          const created = await res.json();
          setExpenses(prev => [mapExpense(created), ...prev]);
          setNewExpense({ description: '', amount: 0, category: 'Supplies' });
        } else {
          alert('Failed to save expense');
        }
      } catch (err) {
        console.error('Error adding expense:', err);
        alert('Error adding expense');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setExpenses(prev => prev.filter(e => e.id !== id));
        } else {
          alert('Failed to delete expense from database');
        }
      } catch (err) {
        console.error('Error deleting expense:', err);
        alert('Error deleting expense');
      }
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header role="cashier" />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <AddExpenseForm
            description={newExpense.description}
            amount={newExpense.amount}
            category={newExpense.category}
            categories={categories}
            onDescriptionChange={(value) => setNewExpense({...newExpense, description: value})}
            onAmountChange={(value) => setNewExpense({...newExpense, amount: value})}
            onCategoryChange={(value) => setNewExpense({...newExpense, category: value})}
            onSubmit={handleAddExpense}
          />

          <ExpensesDashboard
            expenses={expenses}
            categories={categories}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            onDeleteExpense={handleDeleteExpense}
          />
        </div>
      </div>
    </>
  );
}