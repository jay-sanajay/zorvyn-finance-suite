import React, { useState, useMemo } from 'react';
import { useFinanceStore } from '../store';
import { formatCurrency, formatDate, getCategoryIcon, getCategoryColor } from '../utils/formatters';

const TransactionTable = () => {
  // Use global filtered transactions from store
  const filteredTransactions = useFinanceStore((state) => state.getFilteredTransactions());
  const allTransactions = useFinanceStore((state) => state.transactions);
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'amount'

  // Sort transactions (filtering is handled by store)
  const sortedTransactions = useMemo(() => {
    const sorted = [...filteredTransactions].sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'desc' 
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'amount') {
        return sortOrder === 'desc'
          ? b.amount - a.amount
          : a.amount - b.amount;
      }
      return 0;
    });

    return sorted;
  }, [filteredTransactions, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
      );
    }
    
    return sortOrder === 'desc' ? (
      <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
      </svg>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card dark:shadow-card-dark border border-gray-100 dark:border-gray-700 transition-colors duration-200">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-200">All Transactions</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
            Showing {sortedTransactions.length} of {allTransactions.length} transactions
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Date
                  <SortIcon field="date" />
                </button>
              </th>
              <th className="px-4 sm:px-6 py-3 text-left">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider transition-colors duration-200">
                  Category
                </span>
              </th>
              <th className="px-4 sm:px-6 py-3 text-left hidden sm:table-cell">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider transition-colors duration-200">
                  Description
                </span>
              </th>
              <th className="px-4 sm:px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('amount')}
                  className="flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Amount
                  <SortIcon field="amount" />
                </button>
              </th>
              <th className="px-4 sm:px-6 py-3 text-left hidden sm:table-cell">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider transition-colors duration-200">
                  Type
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 transition-colors duration-200">
            {sortedTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white transition-colors duration-200">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${getCategoryColor(transaction.category)} mr-3`}>
                      {getCategoryIcon(transaction.category)}
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white transition-colors duration-200">{transaction.category}</span>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 dark:text-white hidden sm:table-cell">
                  <div className="max-w-xs truncate" title={transaction.description}>
                    {transaction.description}
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-semibold ${
                    transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  } transition-colors duration-200`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    transaction.type === 'income' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  } transition-colors duration-200`}>
                    {transaction.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
