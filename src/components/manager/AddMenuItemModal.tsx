'use client';

interface AddMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: any) => void;
}

export function AddMenuItemModal({ isOpen, onClose, onSave }: AddMenuItemModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const item = {
      name: formData.get('name'),
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category'),
      description: formData.get('description'),
    };
    onSave(item);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Add Menu Item</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
              placeholder="e.g., Spicy Wings"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              name="category"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
            >
              <option value="SHAWARMA">Shawarma</option>
              <option value="ROASTED">Roasted</option>
              <option value="CRISPY">Crispy</option>
              <option value="BURGER">Burger</option>
              <option value="FISH">Fish</option>
              <option value="PIZZA">Pizza</option>
              <option value="DRINKS">Drinks & Juices</option>
              <option value="EXTRAS">Extras & Packaging</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price (ETB)</label>
            <input
              type="number"
              name="price"
              step="0.01"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
              placeholder="Optional description..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#E4002B] text-white rounded-lg hover:bg-[#C4002B]"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
