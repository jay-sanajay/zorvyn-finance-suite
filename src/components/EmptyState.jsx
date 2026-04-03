import React from 'react';

const EmptyState = ({ type = 'transactions' }) => {
  const getContent = () => {
    switch (type) {
      case 'transactions':
        return {
          icon: (
            <svg className="w-16 h-16 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          ),
          title: 'No transactions yet',
          description: 'Start by adding your first transaction to track your finances.',
          action: 'Add Transaction'
        };
      case 'filtered':
        return {
          icon: (
            <svg className="w-16 h-16 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          ),
          title: 'No transactions found',
          description: 'Try adjusting your filters or search terms to find what you\'re looking for.',
          action: 'Clear Filters'
        };
      default:
        return {
          icon: (
            <svg className="w-16 h-16 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          ),
          title: 'No data available',
          description: 'There\'s no data to display at the moment.',
          action: 'Refresh'
        };
    }
  };

  const content = getContent();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 animate-fade-in">
      <div className="text-center">
        {content.icon}
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
          {content.title}
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          {content.description}
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
