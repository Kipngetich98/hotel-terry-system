import React, { useState, useEffect } from 'react';

interface Transaction {
  id?: number;
  date: string;
  type: 'sale' | 'expense';
  amount: number;
  description: string;
  paymentMethod: string;
  reference: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Partial<Transaction>) => void;
  transaction: Partial<Transaction> | null;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSave, transaction }) => {
  const [formData, setFormData] = useState<Partial<Transaction>>({
    date: new Date().toISOString().split('T')[0],
    type: 'sale',
    amount: 0,
    description: '',
    paymentMethod: 'mpesa',
    reference: ''
  });

  useEffect(() => {
    if (transaction) {
      setFormData({ ...transaction });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        type: 'sale',
        amount: 0,
        description: '',
        paymentMethod: 'mpesa',
        reference: ''
      });
    }
  }, [transaction]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'amount') {
      const numValue = parseFloat(value);
      const adjustedValue = formData.type === 'expense' ? -Math.abs(numValue) : Math.abs(numValue);
      setFormData({
        ...formData,
        [name]: adjustedValue
      });
    } else if (name === 'type') {
      const currentAmount = formData.amount || 0;
      const adjustedAmount = value === 'expense' ? -Math.abs(currentAmount) : Math.abs(currentAmount);
      
      setFormData({
        ...formData,
        type: value as 'sale' | 'expense',
        amount: adjustedAmount
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'number' ? parseFloat(value) : value
      });
    }
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
            {transaction ? 'Edit Transaction' : 'New Transaction'}
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="sale">Sale</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount (KES)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={Math.abs(formData.amount || 0)}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="mpesa">M-Pesa</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>

            <div>
              <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
                Reference Number
              </label>
              <input
                type="text"
                id="reference"
                name="reference"
                value={formData.reference}
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
              {transaction ? 'Update Transaction' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
