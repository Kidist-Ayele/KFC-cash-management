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
    <div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">Total Expenses</h3>
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#E4002B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#E4002B]">{formatCurrency(totalExpenses)}</p>
          <p className="text-xs text-gray-500 mt-1">{expenses.length} transactions</p>
        </div>

        {totalByCategory.slice(0, 3).map((cat) => (
          <div key={cat.category} className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2">{cat.category}</h3>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{formatCurrency(cat.total)}</p>
            <p className="text-xs text-gray-500 mt-1">{cat.count} items</p>
          </div>
        ))}
      </div>

      {/* Expense List */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h2 className="text-lg sm:text-xl font-bold">Expense History</h2>
          <select 
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4002B] text-sm"
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-gray-400">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-sm sm:text-base">No expenses recorded yet</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">DATE</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">DESCRIPTION</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">CATEGORY</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">ADDED BY</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">AMOUNT</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense) => (
                    <tr key={expense.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm text-gray-600">{expense.date}</td>
                      <td className="py-4 px-4 font-medium text-sm">{expense.description}</td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          {expense.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{expense.addedBy}</td>
                      <td className="py-4 px-4 font-bold text-[#E4002B] text-sm">{formatCurrency(expense.amount)}</td>
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
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3">
              {filteredExpenses.map((expense) => (
                <div key={expense.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-[#E4002B] text-base">{formatCurrency(expense.amount)}</p>
                      <p className="text-xs text-gray-500">{expense.date}</p>
                    </div>
                    <button 
                      onClick={() => onDeleteExpense(expense.id)}
                      className="p-2 hover:bg-gray-200 rounded"
                      title="Delete expense"
                    >
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <p className="font-medium text-sm text-gray-900 mb-2">{expense.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {expense.category}
                    </span>
                    <span className="text-xs text-gray-500">Added by {expense.addedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
