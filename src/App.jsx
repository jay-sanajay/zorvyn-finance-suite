import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import StoreDemo from './components/StoreDemo';
import { RoleSwitcher, DarkModeToggle } from './components';
import Overview from './components/Overview';
import Transactions from './components/Transactions';
import Insights from './components/Insights';
import NavigationTabs from './components/NavigationTabs';
import TransactionModal from './components/TransactionModal';
import { useFinanceStore } from './store';
import { shallow } from 'zustand/shallow';
import { transactions as mockTransactions } from './data';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Initialize data on mount
  useEffect(() => {
    const currentState = useFinanceStore.getState();
    if (currentState.transactions.length === 0) {
      useFinanceStore.setState({ transactions: mockTransactions });
    }
  }, []);
  
  // Store state for modals - using single selector to prevent infinite loop
  const { showAddModal, editingTransaction, setShowAddModal, setEditingTransaction } = useFinanceStore(
    (state) => ({
      showAddModal: state.showAddModal,
      editingTransaction: state.editingTransaction,
      setShowAddModal: state.setShowAddModal,
      setEditingTransaction: state.setEditingTransaction
    }),
    shallow
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'transactions':
        return <Transactions />;
      case 'insights':
        return <Insights />;
      default:
        return <Overview />;
    }
  };

  return (
    <Layout>
      {/* Store Demo Component */}
      <StoreDemo />
      
      {/* Role Switcher */}
      <RoleSwitcher />
      
      {/* Navigation Tabs */}
      <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Tab Content */}
      <div className="w-full animate-fade-in">
        {renderActiveTab()}
      </div>

      {/* Global Transaction Modal */}
      <TransactionModal 
        isOpen={!!showAddModal || !!editingTransaction}
        onClose={() => {
          setShowAddModal(false);
          setEditingTransaction(null);
        }}
        transaction={editingTransaction}
      />
    </Layout>
  );
}

export default App;
