import React, { useMemo } from 'react';
import { useFinanceStore } from '../store';

const Filters = () => {
  // Get filter state and actions from store
  const filterText = useFinanceStore((state) => state.filterText);
  const categoryFilter = useFinanceStore((state) => state.categoryFilter);
  const typeFilter = useFinanceStore((state) => state.typeFilter);
  const transactions = useFinanceStore((state) => state.transactions);
  
  const setFilter = useFinanceStore((state) => state.setFilter);
  const setCategoryFilter = useFinanceStore((state) => state.setCategoryFilter);
  const setTypeFilter = useFinanceStore((state) => state.setTypeFilter);
  const clearAllFilters = useFinanceStore((state) => state.clearAllFilters);

  // Get unique categories for dropdown
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(transactions.map(t => t.category))];
    return uniqueCategories.sort();
  }, [transactions]);

  // Check if any filters are active
  const hasActiveFilters = filterText || categoryFilter || typeFilter;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card dark:shadow-card-dark border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-200">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* General Search */}
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
            Search Transactions
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="search"
              type="text"
              value={filterText}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search by description, category, or type..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="lg:w-64">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
            Category
          </label>
          <div className="relative">
            <select
              id="category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none transition-colors duration-200"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Type Filter */}
        <div className="lg:w-48">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
            Type
          </label>
          <div className="relative">
            <select
              id="type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="block w-full pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none transition-colors duration-200"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="lg:w-32 flex items-end">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 transition-colors duration-200">
          <div className="flex flex-wrap gap-2">
            {filterText && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 transition-colors duration-200">
                Search: "{filterText}"
                <button
                  onClick={() => setFilter('')}
                  className="ml-2 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors duration-200"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {categoryFilter && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 transition-colors duration-200">
                Category: {categoryFilter}
                <button
                  onClick={() => setCategoryFilter('')}
                  className="ml-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors duration-200"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {typeFilter && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 transition-colors duration-200">
                Type: {typeFilter}
                <button
                  onClick={() => setTypeFilter('')}
                  className="ml-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-200"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
