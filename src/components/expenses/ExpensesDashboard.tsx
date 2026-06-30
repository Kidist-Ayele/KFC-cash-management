'use client';

import { formatCurrency } from '@/lib/utils';

interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  addedBy: string;
}

interface ExpensesDashboardProps {
  expenses: Expense[];
  categories: string[];
  categoryFilter: string;
  onCategoryFilterChange: (filter: string) => void;
  onDeleteExpense: (id: string) => void;
}

export function ExpensesDashboard({
  expenses,
  categories,
  categoryFilter,
  onCategoryFilterChange,
  onDeleteExpense,
}: ExpensesDashboardProps) {
  const filteredExpenses = categoryFilter === 'All' 
    ? expenses 
    : expenses.filter(e => e.category === categoryFilter);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalByCategory = categories.map(cat => ({
    category: cat,
    total: expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0),
    count: expenses.filter(e => e.category === cat).length,
  }));

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Expenses</h3>
            <svg className="w-8 h-8 text-[#E4002B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-[#E4002B]">{formatCurrency(totalExpenses)}</p>
          <p className="text-xs text-gray-500 mt-1">{expenses.length} transactions</p>
        </div>

        {totalByCategory.slice(0, 3).map((cat) => (
          <div key={cat.category} className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">{cat.category}</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(cat.total)}</p>
            <p className="text-xs text-gray-500 mt-1">{cat.count} items</p>
          </div>
        ))}
      </div>

      {/* Expense List */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Expense History</h2>
          <select 
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p>No expenses recorded yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">DATE</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">DESCRIPTION</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">CATEGORY</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">ADDED BY</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">AMOUNT</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm text-gray-600">{expense.date}</td>
                  <td className="py-4 px-4 font-medium">{expense.description}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {expense.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{expense.addedBy}</td>
                  <td className="py-4 px-4 font-bold text-[#E4002B]">{formatCurrency(expense.amount)}</td>
                  <td className="py-4 px-4">
                    <button 
                      onClick={() => onDeleteExpense(expense.id)}
                      className="p-2 hover:bg-gray-200 rounded"
                      title="Delete expense"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
