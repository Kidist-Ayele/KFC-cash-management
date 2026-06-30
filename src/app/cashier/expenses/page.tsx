'use client';

import { useState } from 'react';
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

  const categories = ['Supplies', 'Ingredients', 'Utilities', 'Maintenance', 'Other'];

  const handleAddExpense = () => {
    if (newExpense.description && newExpense.amount > 0) {
      const expense: Expense = {
        id: Date.now().toString(),
        date: new Date().toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        description: newExpense.description,
        amount: newExpense.amount,
        category: newExpense.category,
        addedBy: 'Abebe B.',
      };
      
      setExpenses([expense, ...expenses]);
      setNewExpense({ description: '', amount: 0, category: 'Supplies' });
    }
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      setExpenses(expenses.filter(e => e.id !== id));
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