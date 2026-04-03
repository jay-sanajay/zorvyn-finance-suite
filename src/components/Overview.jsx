import React, { useMemo, useCallback, memo } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFinancialMetrics, useAnalytics } from '../store';
import { formatCurrency, formatDate } from '../utils/formatters';

// Memoized tooltip component to prevent re-renders
const CustomTooltip = memo(({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
});

CustomTooltip.displayName = 'CustomTooltip';

// Memoized Line Chart Component
const MemoizedLineChart = memo(({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
      <XAxis dataKey="date" stroke="#6b7280" />
      <YAxis stroke="#6b7280" />
      <Tooltip content={<CustomTooltip />} />
      <Line type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={2} dot={false} />
    </LineChart>
  </ResponsiveContainer>
));

MemoizedLineChart.displayName = 'MemoizedLineChart';

// Memoized Pie Chart Component
const MemoizedPieChart = memo(({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={100}
        paddingAngle={5}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
    </PieChart>
  </ResponsiveContainer>
));

MemoizedPieChart.displayName = 'MemoizedPieChart';

// Memoized Bar Chart Component
const MemoizedBarChart = memo(({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
      <XAxis dataKey="month" stroke="#6b7280" />
      <YAxis stroke="#6b7280" />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Bar dataKey="income" fill="#10b981" />
      <Bar dataKey="expense" fill="#ef4444" />
    </BarChart>
  </ResponsiveContainer>
));

MemoizedBarChart.displayName = 'MemoizedBarChart';

const Overview = () => {
  const { totalBalance, totalIncome, totalExpenses, savingsRate } = useFinancialMetrics();
  const { balanceTrend, monthlyComparison, smartInsights } = useAnalytics();

  // Static data - completely stable
  const expenseData = useMemo(() => [
    { name: 'Food', value: 4000, color: '#6366f1' },
    { name: 'Transport', value: 3000, color: '#8b5cf6' },
    { name: 'Shopping', value: 2000, color: '#ec4899' },
    { name: 'Bills', value: 2780, color: '#f59e0b' },
    { name: 'Others', value: 1890, color: '#10b981' }
  ], []);

  const monthlyData = useMemo(() => [
    { month: 'Jan', income: 4000, expense: 2400 },
    { month: 'Feb', income: 3000, expense: 1398 },
    { month: 'Mar', income: 2000, expense: 9800 },
    { month: 'Apr', income: 2780, expense: 3908 },
    { month: 'May', income: 1890, expense: 4800 },
    { month: 'Jun', income: 2390, expense: 3800 }
  ], []);

  // Memoize balance trend with stable reference
  const chartBalanceData = useMemo(() => {
    if (!balanceTrend || balanceTrend.length === 0) return [];
    return balanceTrend.slice(-6).map(item => ({
      balance: Number(item.balance) || 0,
      date: item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''
    }));
  }, [balanceTrend]);

  // Memoize insights with stable reference
  const displayInsights = useMemo(() => {
    if (!smartInsights || smartInsights.length === 0) return [];
    return smartInsights.slice(0, 3).map(insight => ({
      ...insight,
      message: insight.message || ''
    }));
  }, [smartInsights]);

  return (
    <div className="space-y-6">
      {/* Simple Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Balance</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalBalance)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Income</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Expenses</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Savings Rate</p>
          <p className="text-2xl font-bold text-blue-600">{savingsRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance Trend */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Balance Trend</h3>
          <MemoizedLineChart data={chartBalanceData} />
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Expense Breakdown</h3>
          <MemoizedPieChart data={expenseData} />
        </div>
      </div>

      {/* Monthly Comparison */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Comparison</h3>
        <MemoizedBarChart data={monthlyData} />
      </div>

      {/* Quick Insights */}
      {displayInsights.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Insights</h3>
          <div className="space-y-3">
            {displayInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{insight.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
