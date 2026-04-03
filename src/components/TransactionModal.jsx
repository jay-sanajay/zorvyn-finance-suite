import React, { useState, useEffect } from 'react';
import { useFinanceStore } from '../store';
import { formatCurrency } from '../utils/formatters';

const TransactionModal = ({ isOpen, onClose, transaction = null }) => {
  const { addTransaction, updateTransaction, validateTransaction, categories } = useFinanceStore();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when editing
  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description || '',
        amount: Math.abs(transaction.amount).toString(),
        category: transaction.category || '',
        type: transaction.type || 'expense',
        date: transaction.date || new Date().toISOString().split('T')[0]
      });
    } else {
      // Reset form for new transaction
      setFormData({
        description: '',
        amount: '',
        category: '',
        type: 'expense',
        date: new Date().toISOString().split('T')[0]
      });
    }
    setErrors([]);
  }, [transaction, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors for this field
    setErrors(prev => prev.filter(error => !error.toLowerCase().includes(name.toLowerCase())));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form data
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      
      const validationErrors = validateTransaction(transactionData);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setIsSubmitting(false);
        return;
      }
      
      // Apply sign based on type
      transactionData.amount = formData.type === 'expense' 
        ? -Math.abs(transactionData.amount) 
        : Math.abs(transactionData.amount);
      
      if (transaction) {
        // Update existing transaction
        const success = updateTransaction(transaction.id, transactionData);
        if (success) {
          onClose();
        }
      } else {
        // Add new transaction
        addTransaction(transactionData);
        onClose();
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
      setErrors(['An unexpected error occurred']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleClose}
        ></div>
        
        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {transaction ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4">
            {/* Error Display */}
            {errors.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-red-900 dark:text-red-100">Please fix the following errors:</p>
                    <ul className="mt-1 text-sm text-red-700 dark:text-red-300 list-disc list-inside">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter transaction description"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            {/* Amount */}
            <div className="mb-4">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  ₹
                </span>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            {/* Type */}
            <div className="mb-4">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  name="type"
                  value="expense"
                  onClick={handleInputChange}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    formData.type === 'expense'
                      ? 'bg-red-600 text-white ring-2 ring-red-600 ring-offset-2'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  name="type"
                  value="income"
                  onClick={handleInputChange}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    formData.type === 'income'
                      ? 'bg-green-600 text-white ring-2 ring-green-600 ring-offset-2'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Income
                </button>
              </div>
            </div>
            
            {/* Category */}
            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* Date */}
            <div className="mb-6">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            {/* Preview */}
            {formData.amount && formData.type && (
              <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Preview:</p>
                <p className={`text-lg font-semibold ${
                  formData.type === 'expense' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                }`}>
                  {formData.type === 'expense' ? '-' : '+'}{formatCurrency(parseFloat(formData.amount) || 0)}
                </p>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  transaction ? 'Update' : 'Add'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
