// Store configuration and state management
// This is where you would set up Redux, Zustand, or other state management

export { default as useFinanceStore, useFilteredTransactions, useFinancialMetrics, useAnalytics } from './useFinanceStore';

export const exampleState = {
  user: null,
  isLoading: false,
  error: null,
};
