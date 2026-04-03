import React, { useState } from 'react';
import { useFinanceStore } from '../store';
import AddTransactionModal from './AddTransactionModal';

const AddTransactionButton = () => {
  const role = useFinanceStore((state) => state.role);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Only render if user is admin
  if (role !== 'admin') {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Transaction
      </button>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default AddTransactionButton;
