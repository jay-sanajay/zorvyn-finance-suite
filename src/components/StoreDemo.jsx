import React from 'react';
import { useFinanceStore } from '../store';
import { shallow } from 'zustand/shallow';
import { formatCurrency } from '../utils/formatters';

const StoreDemo = () => {
  const { addTransaction, role } = useFinanceStore(
    (state) => ({
      addTransaction: state.addTransaction,
      role: state.role
    }),
    shallow
  );

  const handleAddSampleTransaction = () => {
    const newTransaction = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      amount: -200.00,
      category: 'Food & Dining',
      type: 'expense',
      description: 'Sample transaction - Masala Dosa'
    };
    
    addTransaction(newTransaction);
  };

  if (role !== 'admin') {
    return null;
  }

  return (
    <div className="glass-card rounded-2xl p-6 mb-6">
      <h3 className="text-lg font-semibold text-white mb-3">Store Demo (Admin Only)</h3>
      <button
        onClick={handleAddSampleTransaction}
        className="btn-primary text-sm px-4 py-2"
      >
        Add Sample Transaction ({formatCurrency(200)})
      </button>
      <p className="text-xs text-gray-400 mt-2">
        This demonstrates the Zustand store functionality. Only admins can see this.
      </p>
    </div>
  );
};

export default StoreDemo;
