'use client';

interface AddExpenseFormProps {
  description: string;
  amount: number;
  category: string;
  categories: string[];
  onDescriptionChange: (value: string) => void;
  onAmountChange: (value: number) => void;
  onCategoryChange: (value: string) => void;
  onSubmit: () => void;
}

export function AddExpenseForm({
  description,
  amount,
  category,
  categories,
  onDescriptionChange,
  onAmountChange,
  onCategoryChange,
  onSubmit,
}: AddExpenseFormProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
      <h2 className="text-xl font-bold mb-4">Add New Expense</h2>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <input
            type="text"
            placeholder="e.g., Cooking oil, Cleaning supplies..."
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount (ETB)</label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount || ''}
            onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
          />
        </div>
      </div>
      <button 
        onClick={onSubmit}
        disabled={!description || amount <= 0}
        className="mt-4 px-6 py-2 bg-[#E4002B] text-white rounded-lg hover:bg-[#C4002B] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Add Expense
      </button>
    </div>
  );
}
