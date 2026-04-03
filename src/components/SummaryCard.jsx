import React from 'react';
import { useFinanceStore } from '../store';
import { formatCurrency } from '../utils/formatters';

const SummaryCard = ({ title, amount, change, changeType, icon, colorClass }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-card dark:shadow-card-dark border border-gray-100 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 transition-colors duration-200">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">{formatCurrency(amount)}</p>
          {change && (
            <p className={`text-xs mt-2 ${
              changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            } transition-colors duration-200`}>
              {changeType === 'positive' ? '+' : '-'}{change} from last month
            </p>
          )}
        </div>
        <div className={`${colorClass} p-3 rounded-lg ml-4`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const SummaryCards = () => {
  // Get calculated values from store
  const totalBalance = useFinanceStore((state) => state.getTotalBalance());
  const totalIncome = useFinanceStore((state) => state.getTotalIncome());
  const totalExpenses = useFinanceStore((state) => state.getTotalExpenses());

  // Icons for each card
  const balanceIcon = (
    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const incomeIcon = (
    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
    </svg>
  );

  const expenseIcon = (
    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
    </svg>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <SummaryCard
        title="Total Balance"
        amount={totalBalance}
        change="12.5%"
        changeType="positive"
        icon={balanceIcon}
        colorClass="bg-primary-50"
      />
      
      <SummaryCard
        title="Total Income"
        amount={totalIncome}
        change="8.2%"
        changeType="positive"
        icon={incomeIcon}
        colorClass="bg-green-50"
      />
      
      <SummaryCard
        title="Total Expenses"
        amount={totalExpenses}
        change="3.1%"
        changeType="negative"
        icon={expenseIcon}
        colorClass="bg-red-50"
      />
    </div>
  );
};

export default SummaryCards;
