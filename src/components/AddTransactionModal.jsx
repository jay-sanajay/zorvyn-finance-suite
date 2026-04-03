import React, { useState } from 'react';
import { useFinanceStore } from '../store';

const AddTransactionModal = ({ isOpen, onClose }) => {
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const transactions = useFinanceStore((state) => state.transactions);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: '',
    type: 'expense',
    description: ''
  });

  const [errors, setErrors] = useState({});

  // Get unique categories from existing transactions
  const categories = [...new Set(transactions.map(t => t.category))].sort();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Please select or enter a category';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newTransaction = {
      id: Date.now(),
      date: formData.date,
      amount: formData.type === 'expense' 
        ? -Math.abs(parseFloat(formData.amount))
        : Math.abs(parseFloat(formData.amount)),
      category: formData.category.trim(),
      type: formData.type,
      description: formData.description.trim()
    };

    addTransaction(newTransaction);
    
    // Reset form and close modal
    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      category: '',
      type: 'expense',
      description: ''
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Add Transaction</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleInputChange('type', 'income')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.type === 'income'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('type', 'expense')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.type === 'expense'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Expense
                </button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.amount ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              />
              {errors.amount && (
                <p className="mt-1 text-xs text-red-600">{errors.amount}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="e.g., Food & Dining, Transport"
                list="categories"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              />
              <datalist id="categories">
                {categories.map(category => (
                  <option key={category} value={category} />
                ))}
              </datalist>
              {errors.category && (
                <p className="mt-1 text-xs text-red-600">{errors.category}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter transaction description..."
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-600">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
