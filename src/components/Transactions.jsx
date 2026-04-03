import React, { useState, useMemo } from 'react';
import { useFinanceStore, useFilteredTransactions } from '../store';
import { formatCurrency, formatDate, getCategoryIcon, getCategoryColor } from '../utils/formatters';
import TransactionModal from './TransactionModal';
import ConfirmationModal from './ConfirmationModal';

const Transactions = () => {
  // Store state
  const role = useFinanceStore((state) => state.role);
  const filters = useFinanceStore((state) => state.filters);
  const sortConfig = useFinanceStore((state) => state.sortConfig);
  const categories = useFinanceStore((state) => state.getCategories());
  const availableMonths = useFinanceStore((state) => state.getAvailableMonths());
  
  // Store actions
  const updateFilter = useFinanceStore((state) => state.updateFilter);
  const clearAllFilters = useFinanceStore((state) => state.clearAllFilters);
  const toggleSortOrder = useFinanceStore((state) => state.toggleSortOrder);
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction);
  const setEditingTransaction = useFinanceStore((state) => state.setEditingTransaction);
  const setShowAddModal = useFinanceStore((state) => state.setShowAddModal);
  
  // Use the new filtered transactions selector
  const filteredTransactions = useFilteredTransactions();
  
  // Local state
  const [selectedTransactions, setSelectedTransactions] = useState(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    updateFilter(filterName, value);
  };

  // Handle sorting
  const handleSort = (field) => {
    toggleSortOrder(field);
  };

  // Transaction selection
  const toggleTransactionSelection = (id) => {
    const newSelected = new Set(selectedTransactions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTransactions(newSelected);
  };

  const selectAllTransactions = () => {
    if (selectedTransactions.size === filteredTransactions.length) {
      setSelectedTransactions(new Set());
    } else {
      setSelectedTransactions(new Set(filteredTransactions.map(t => t.id)));
    }
  };

  // Transaction actions
  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDeleteTransaction = (transaction) => {
    setShowDeleteModal(transaction);
  };

  const confirmDelete = async () => {
    if (!showDeleteModal) return;
    
    setIsDeleting(true);
    try {
      const success = deleteTransaction(showDeleteModal.id);
      if (success) {
        setShowDeleteModal(null);
        // Clear selection if deleted transaction was selected
        setSelectedTransactions(prev => {
          const newSet = new Set(prev);
          newSet.delete(showDeleteModal.id);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Export selected transactions
  const exportSelectedTransactions = () => {
    const selectedData = filteredTransactions.filter(t => selectedTransactions.has(t.id));
    const csv = [
      ['Date', 'Description', 'Category', 'Type', 'Amount'],
      ...selectedData.map(t => [
        t.date,
        t.description,
        t.category,
        t.type,
        t.amount.toString()
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}-${selectedData.length} ${selectedData.length === 1 ? 'transaction' : 'transactions'}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortConfig.field !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortConfig.order === 'asc' ? (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
      </svg>
    );
  };

  // Check if any filters are active
  const hasActiveFilters = filters.search || filters.category || filters.type || filters.month || filters.dateRange.start || filters.dateRange.end;

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-xl p-4 sm:p-6 lg:p-8 text-white shadow-2xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 truncate">Transaction Management</h1>
            <p className="text-purple-100 text-sm sm:text-base">Complete control over your financial transactions</p>
          </div>
          <div className="text-center sm:text-right flex-shrink-0">
            <p className="text-sm text-purple-100 mb-1">Total Transactions</p>
            <p className="text-3xl sm:text-4xl font-bold">{filteredTransactions.length}</p>
            {selectedTransactions.size > 0 && (
              <p className="text-sm text-purple-200 mt-2">{selectedTransactions.size} selected</p>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg dark:shadow-2xl border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Filters</h3>
          <div className="flex items-center gap-2 flex-shrink-0">
            {selectedTransactions.size > 0 && (
              <button
                onClick={exportSelectedTransactions}
                className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="hidden sm:inline">Export Selected ({selectedTransactions.size})</span>
                <span className="sm:hidden">Export ({selectedTransactions.size})</span>
              </button>
            )}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear All
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search transactions..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {/* Month Filter */}
          <select
            value={filters.month}
            onChange={(e) => handleFilterChange('month', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Months</option>
            {availableMonths.map(month => {
              const [year, monthNum] = month.split('-');
              const date = new Date(year, monthNum - 1);
              const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
              return (
                <option key={month} value={month}>{monthName}</option>
              );
            })}
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            {filters.search && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                Search: "{filters.search}"
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="ml-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                Category: {filters.category}
                <button
                  onClick={() => handleFilterChange('category', '')}
                  className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {filters.type && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                Type: {filters.type}
                <button
                  onClick={() => handleFilterChange('type', '')}
                  className="ml-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {filters.month && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                Month: {filters.month}
                <button
                  onClick={() => handleFilterChange('month', '')}
                  className="ml-2 text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {(filters.dateRange.start || filters.dateRange.end) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                Date Range
                <button
                  onClick={() => handleFilterChange('dateRange', { start: '', end: '' })}
                  className="ml-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Add Transaction Button for Admin */}
      {role === 'admin' && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white rounded-xl hover:from-purple-700 hover:via-pink-700 hover:to-red-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 font-medium text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg dark:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedTransactions.size === filteredTransactions.length && filteredTransactions.length > 0}
                    onChange={selectAllTransactions}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left">
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    Date
                    {getSortIcon('date')}
                  </button>
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </span>
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left hidden sm:table-cell">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </span>
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left">
                  <button
                    onClick={() => handleSort('amount')}
                    className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    Amount
                    {getSortIcon('amount')}
                  </button>
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left hidden md:table-cell">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </span>
                </th>
                {role === 'admin' && (
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions.map((transaction) => (
                <tr 
                  key={transaction.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                    selectedTransactions.has(transaction.id) ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                  }`}
                >
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <input
                      type="checkbox"
                      checked={selectedTransactions.has(transaction.id)}
                      onChange={() => toggleTransactionSelection(transaction.id)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-900 dark:text-white">
                    <div className="max-w-[150px] sm:max-w-xs truncate" title={transaction.description}>
                      {transaction.description}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${getCategoryColor(transaction.category)} mr-3`}>
                        {getCategoryIcon(transaction.category)}
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white">{transaction.category}</span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${
                      transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden md:table-cell">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  {role === 'admin' && (
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditTransaction(transaction)}
                          className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200 hover:scale-105"
                          title="Edit Transaction"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteTransaction(transaction)}
                          className="inline-flex items-center justify-center p-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-all duration-200 hover:scale-105"
                          title="Delete Transaction"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No transactions found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {hasActiveFilters 
                ? 'Try adjusting your filters' 
                : 'Add your first transaction to get started'}
            </p>
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      <TransactionModal />
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!showDeleteModal}
        onClose={() => setShowDeleteModal(null)}
        onConfirm={confirmDelete}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${showDeleteModal?.description}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Transactions;
