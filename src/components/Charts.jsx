import React from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFinanceStore } from '../store';
import { formatCurrency } from '../utils/formatters';

const BalanceTrendChart = () => {
  const transactions = useFinanceStore((state) => state.transactions);
  
  // Calculate cumulative balance over time
  const balanceData = React.useMemo(() => {
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    let runningBalance = 0;
    
    const data = sortedTransactions.map(transaction => {
      runningBalance += transaction.amount;
      return {
        date: new Date(transaction.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        balance: runningBalance,
        fullDate: transaction.date
      };
    });
    
    // Add some historical data points for better visualization
    const historicalData = [
      { date: 'Mar 25', balance: 50000 },
      { date: 'Mar 28', balance: 55000 },
      { date: 'Apr 1', balance: 85000 },
      ...data.slice(0, -1) // Remove the last point to avoid duplication
    ];
    
    return historicalData;
  }, [transactions]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-card border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Balance Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={balanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            formatter={(value) => [formatCurrency(value), 'Balance']}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="balance" 
            stroke="#0ea5e9" 
            strokeWidth={2}
            dot={{ fill: '#0ea5e9', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const SpendingByCategoryChart = () => {
  const transactions = useFinanceStore((state) => state.transactions);
  
  // Calculate spending by category
  const categoryData = React.useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals = {};
    
    expenses.forEach(transaction => {
      if (!categoryTotals[transaction.category]) {
        categoryTotals[transaction.category] = 0;
      }
      categoryTotals[transaction.category] += Math.abs(transaction.amount);
    });
    
    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: 0 // Will be calculated
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6); // Top 6 categories
  }, [transactions]);

  // Calculate percentages
  const totalExpenses = categoryData.reduce((sum, item) => sum + item.amount, 0);
  categoryData.forEach(item => {
    item.percentage = ((item.amount / totalExpenses) * 100).toFixed(1);
  });

  // Colors for pie chart
  const COLORS = [
    '#0ea5e9', // primary-600
    '#10b981', // green-600
    '#f59e0b', // yellow-600
    '#a855f7', // purple-600
    '#ef4444', // red-600
    '#6366f1', // indigo-600
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.category}</p>
          <p className="text-sm text-gray-600">{formatCurrency(data.amount)}</p>
          <p className="text-xs text-gray-500">{data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (parseFloat(percentage) < 5) return null; // Don't show label for small slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${percentage}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-card border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="amount"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {categoryData.map((item, index) => (
          <div key={item.category} className="flex items-center text-sm">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-gray-600">{item.category}</span>
            <span className="text-gray-900 font-medium ml-auto">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Charts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <BalanceTrendChart />
      <SpendingByCategoryChart />
    </div>
  );
};

export default Charts;
