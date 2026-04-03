import React, { useMemo } from 'react';
import { useFinanceStore, useFinancialMetrics, useAnalytics } from '../store';
import { formatCurrency, formatDate } from '../utils/formatters';

const Insights = () => {
  // Store state
  const transactions = useFinanceStore((state) => state.transactions);
  
  // Use the new selector hooks
  const { totalIncome, totalExpenses, totalBalance, savingsRate } = useFinancialMetrics();
  const { balanceTrend, monthlyComparison, topSpendingCategory, averageMonthlyExpense, bestSavingMonth, smartInsights } = useAnalytics();

  // Calculate additional metrics
  const financialHealthScore = useMemo(() => {
    let score = 0;
    
    // Savings rate (40% of score)
    if (savingsRate >= 30) score += 40;
    else if (savingsRate >= 20) score += 30;
    else if (savingsRate >= 10) score += 20;
    else if (savingsRate >= 5) score += 10;
    
    // Income vs expenses balance (30% of score)
    const balanceRatio = totalIncome > 0 ? (totalIncome - totalExpenses) / totalIncome : 0;
    if (balanceRatio >= 0.3) score += 30;
    else if (balanceRatio >= 0.2) score += 25;
    else if (balanceRatio >= 0.1) score += 20;
    else if (balanceRatio >= 0) score += 15;
    
    // Transaction consistency (20% of score)
    if (transactions.length >= 50) score += 20;
    else if (transactions.length >= 30) score += 15;
    else if (transactions.length >= 15) score += 10;
    else if (transactions.length >= 5) score += 5;
    
    // Category diversity (10% of score)
    const categories = [...new Set(transactions.map(t => t.category))];
    if (categories.length >= 8) score += 10;
    else if (categories.length >= 6) score += 8;
    else if (categories.length >= 4) score += 6;
    else if (categories.length >= 2) score += 4;
    
    return Math.min(100, score);
  }, [savingsRate, totalIncome, totalExpenses, transactions]);

  const getHealthScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getHealthScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'trend':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'category':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        );
      case 'savings':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getInsightColor = (severity) => {
    switch (severity) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200';
      case 'danger':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200';
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Insights Available</h3>
          <p className="text-gray-500 dark:text-gray-400">Add transactions to see AI-powered insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-4 sm:p-6 lg:p-8 text-white shadow-2xl overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5"></div>
        
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 truncate">AI-Powered Insights</h1>
            <p className="text-emerald-100 text-sm sm:text-base lg:text-lg">Intelligent analysis of your financial patterns</p>
          </div>
          <div className="text-center sm:text-right flex-shrink-0">
            <p className="text-sm sm:text-base text-emerald-100 mb-1">Health Score</p>
            <p className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${getHealthScoreColor(financialHealthScore)}`}>
              {financialHealthScore}/100
            </p>
            <p className="text-sm sm:text-base mt-2 px-3 py-1 rounded-full inline-block bg-white/20 text-white">
              {getHealthScoreLabel(financialHealthScore)}
            </p>
          </div>
        </div>
      </div>

      {/* Smart Insights */}
      {smartInsights.length > 0 && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-lg dark:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">Smart Insights</h3>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
          <div className="space-y-3">
            {smartInsights.map((insight, index) => (
              <div 
                key={index} 
                className={`flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer ${getInsightColor(insight.severity)}`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium break-words">{insight.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {insight.type === 'trend' ? 'Trend Analysis' : 
                     insight.type === 'category' ? 'Category Analysis' : 
                     insight.type === 'savings' ? 'Savings Analysis' : 'General Insight'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Top Spending Category */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg dark:shadow-2xl border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Top Spending</h4>
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 truncate">
            {topSpendingCategory[0] || 'N/A'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {topSpendingCategory[1] ? formatCurrency(topSpendingCategory[1]) : '₹0'}
          </p>
        </div>

        {/* Average Monthly Expense */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg dark:shadow-2xl border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Avg Monthly Expense</h4>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {formatCurrency(averageMonthlyExpense)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Per month</p>
        </div>

        {/* Best Saving Month */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg dark:shadow-2xl border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Best Saving Month</h4>
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {bestSavingMonth ? new Date(bestSavingMonth.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {bestSavingMonth ? formatCurrency(bestSavingMonth.net) : 'No savings'}
          </p>
        </div>
      </div>

      {/* Monthly Comparison Table */}
      {monthlyComparison.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg dark:shadow-2xl border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Month</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Income</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Expenses</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Net</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {monthlyComparison.slice(-6).reverse().map((month) => {
                  const monthSavingsRate = month.income > 0 ? ((month.income - month.expenses) / month.income * 100) : 0;
                  const isPositive = month.net > 0;
                  
                  return (
                    <tr key={month.month} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                        {new Date(month.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-green-600 dark:text-green-400 font-medium">
                        {formatCurrency(month.income)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-red-600 dark:text-red-400 font-medium">
                        {formatCurrency(month.expenses)}
                      </td>
                      <td className={`py-3 px-4 text-sm text-right font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {isPositive ? '+' : ''}{formatCurrency(month.net)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          isPositive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {monthSavingsRate.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savingsRate < 10 && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex-shrink-0">
                <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Increase Savings Rate</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Your savings rate is below 10%. Consider reducing expenses or increasing income.</p>
              </div>
            </div>
          )}
          
          {topSpendingCategory[1] > totalIncome * 0.4 && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex-shrink-0">
                <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Review {topSpendingCategory[0]} Expenses</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">This category represents over 40% of your spending. Look for optimization opportunities.</p>
              </div>
            </div>
          )}
          
          {monthlyComparison.length >= 2 && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg flex-shrink-0">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Track Monthly Trends</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Continue monitoring your monthly patterns to identify improvement areas.</p>
              </div>
            </div>
          )}
          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Set Financial Goals</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Establish clear savings goals and track your progress regularly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
