import React, { useState, useEffect } from 'react';
import { useFinanceStore } from '../store';
import { shallow } from 'zustand/shallow';

const RoleSwitcher = () => {
  const { role, setRole } = useFinanceStore(
    (state) => ({
      role: state.role,
      setRole: state.setRole
    }),
    shallow
  );
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [role]);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl border transition-all duration-500 ${
      role === 'admin' 
        ? 'border-red-200 dark:border-red-800 shadow-red-100 dark:shadow-red-900/20 scale-[1.02]' 
        : role === 'viewer'
        ? 'border-blue-200 dark:border-blue-800 shadow-blue-100 dark:shadow-blue-900/20 scale-[1.02]'
        : 'border-gray-100 dark:border-gray-700'
    }`}>
      <div className="p-6">
        {/* Header with animated gradient for selected role */}
        <div className={`flex items-center justify-between mb-4 transition-all duration-500 ${
          role === 'admin' ? 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 -m-6 p-6 rounded-t-xl' :
          role === 'viewer' ? 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 -m-6 p-6 rounded-t-xl' : ''
        }`}>
          <div className="flex items-center gap-4">
            <div className={`relative transition-all duration-500 ${
              role !== 'normal' ? 'scale-110' : 'scale-100'
            }`}>
              {role === 'admin' ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-full shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              ) : role === 'viewer' ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-full shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
                  <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Role</span>
              <div className={`text-lg font-bold transition-all duration-500 ${
                role === 'admin' 
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400' 
                  : role === 'viewer'
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400'
                  : 'text-gray-900 dark:text-white'
              }`}>
                {role === 'admin' ? 'Administrator' : role === 'viewer' ? 'Viewer' : 'User'}
              </div>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-500 ${
            role === 'admin'
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
              : role === 'viewer'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              role === 'admin' ? 'bg-white animate-pulse' : 
              role === 'viewer' ? 'bg-white animate-pulse' : 'bg-gray-500'
            }`}></div>
            {role === 'admin' ? 'Full Access' : role === 'viewer' ? 'View Only' : 'Limited'}
          </div>
        </div>

        {/* Role Toggle Buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setRole('viewer')}
            className={`flex-1 relative px-4 py-3 rounded-lg font-medium transition-all duration-300 overflow-hidden group ${
              role === 'viewer'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-800 scale-105'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Viewer
            </span>
            {role === 'viewer' && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
          </button>
          
          <button
            onClick={() => setRole('admin')}
            className={`flex-1 relative px-4 py-3 rounded-lg font-medium transition-all duration-300 overflow-hidden group ${
              role === 'admin'
                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-200 dark:shadow-red-800 scale-105'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Admin
            </span>
            {role === 'admin' && (
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
          </button>
        </div>

        {/* Permissions Display */}
        <div className={`space-y-3 transition-all duration-500 ${
          role !== 'normal' ? 'opacity-100 transform translate-y-0' : 'opacity-75'
        }`}>
          {role === 'admin' ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300">Add, edit, and delete transactions</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300">Access to all reports and analytics</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300">Export and manage data</span>
              </div>
            </div>
          ) : role === 'viewer' ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300">View all transactions and reports</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300">Access analytics and insights</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300">Use advanced filtering and search</span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Select a role to view permissions
            </div>
          )}
        </div>

        {/* Role Animation Effect */}
        {isAnimating && (
          <div className="absolute inset-0 pointer-events-none">
            <div className={`absolute inset-0 rounded-xl animate-pulse ${
              role === 'admin' ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10' :
              role === 'viewer' ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10' :
              'bg-gradient-to-r from-gray-500/10 to-gray-500/10'
            }`}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSwitcher;
