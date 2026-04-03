import React from 'react';
import { useFinanceStore } from '../store';
import { shallow } from 'zustand/shallow';

const NavigationTabs = ({ activeTab, onTabChange }) => {
  const { role } = useFinanceStore(
    (state) => ({ role: state.role }),
    shallow
  );

  const tabs = [
    { 
      id: 'overview', 
      icon: '◈', 
      label: 'Overview',
      description: 'Financial summary and metrics'
    },
    { 
      id: 'transactions', 
      icon: '⇄', 
      label: 'Transactions',
      description: 'Manage your transactions'
    },
    { 
      id: 'insights', 
      icon: '◎', 
      label: 'Insights',
      description: 'Analytics and recommendations'
    }
  ];

  return (
    <div className="w-full">
      {/* Mobile Navigation */}
      <div className="sm:hidden">
        <div className="flex overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-2 py-2 min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm
                  transition-all duration-200 whitespace-nowrap
                  ${activeTab === tab.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
              >
                <span className="text-lg leading-none">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden sm:block">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-1">
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center gap-3 flex-1 px-6 py-3 rounded-xl font-medium text-sm
                  transition-all duration-200 relative group
                  ${activeTab === tab.id 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                  }
                `}
              >
                <span className="text-xl leading-none">{tab.icon}</span>
                <span>{tab.label}</span>
                
                {/* Active indicator */}
                {activeTab === tab.id && (
                  <div className="absolute inset-0 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/25"></div>
                )}
                
                {/* Hover effect */}
                <div className={`
                  absolute inset-0 rounded-xl bg-gray-50 dark:bg-gray-800 opacity-0 
                  group-hover:opacity-100 transition-opacity duration-200
                  ${activeTab === tab.id ? 'hidden' : ''}
                `}></div>
                
                <span className="relative z-10 flex items-center gap-3">
                  <span className="text-xl leading-none">{tab.icon}</span>
                  <span>{tab.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Description */}
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
        {tabs.find(tab => tab.id === activeTab)?.description}
      </div>
    </div>
  );
};

export default NavigationTabs;
