import React, { useState, useEffect } from 'react';

interface InventoryItem {
  id?: number;
  name: string;
  unit: string;
  quantity: number;
  minimumThreshold: number;
  costPerUnit: number;
  supplierId: number;
  expiryDate: string;
  lastRestocked: string;
}

interface Supplier {
  id: number;
  name: string;
}

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<InventoryItem>) => void;
  item: Partial<InventoryItem> | null;
  suppliers: Supplier[];
}

const ItemModal: React.FC<ItemModalProps> = ({ isOpen, onClose, onSave, item, suppliers }) => {
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: '',
    unit: 'kg',
    quantity: 0,
    minimumThreshold: 0,
    costPerUnit: 0,
    supplierId: suppliers[0]?.id || 1,
    expiryDate: '',
    lastRestocked: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    } else {
      setFormData({
        name: '',
        unit: 'kg',
        quantity: 0,
        minimumThreshold: 0,
        costPerUnit: 0,
        supplierId: suppliers[0]?.id || 1,
        expiryDate: '',
        lastRestocked: new Date().toISOString().split('T')[0]
      });
    }
  }, [item, suppliers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? Number(value) : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {item ? 'Edit Inventory Item' : 'Add New Inventory Item'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Item Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                Unit
              </label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="g">Grams (g)</option>
                <option value="liters">Liters</option>
                <option value="ml">Milliliters (ml)</option>
                <option value="pcs">Pieces</option>
                <option value="boxes">Boxes</option>
              </select>
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="minimumThreshold" className="block text-sm font-medium text-gray-700">
                Minimum Threshold
              </label>
              <input
                type="number"
                id="minimumThreshold"
                name="minimumThreshold"
                value={formData.minimumThreshold}
                onChange={handleChange}
                min="0"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="costPerUnit" className="block text-sm font-medium text-gray-700">
                Cost Per Unit (KES)
              </label>
              <input
                type="number"
                id="costPerUnit"
                name="costPerUnit"
                value={formData.costPerUnit}
                onChange={handleChange}
                min="0"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700">
              Supplier
            </label>
            <select
              id="supplierId"
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="lastRestocked" className="block text-sm font-medium text-gray-700">
                Last Restocked
              </label>
              <input
                type="date"
                id="lastRestocked"
                name="lastRestocked"
                value={formData.lastRestocked}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {item ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemModal;
