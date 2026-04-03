// ─── NEXUS FINANCE SUITE ───
// Premium Financial Intelligence Platform

// ─── GLOBAL STATE ─────────────────────────────────────────────
const STATE = {
  transactions: [],
  role: 'admin',
  theme: 'dark',
  currentSection: 'overview',
  charts: {},
  filters: {
    search: '',
    type: '',
    category: '',
    sort: 'date-desc'
  }
};

// ─── ENHANCED MOCK DATA ───────────────────────────────────────────
const SEED_TRANSACTIONS = [
  { id: 1, date: '2026-01-15', desc: 'Monthly Salary', category: 'Salary', type: 'income', amount: 85000 },
  { id: 2, date: '2026-01-16', desc: 'Grocery Shopping', category: 'Food & Dining', type: 'expense', amount: 3500 },
  { id: 3, date: '2026-01-17', desc: 'Electric Bill', category: 'Utilities', type: 'expense', amount: 1200 },
  { id: 4, date: '2026-01-18', desc: 'Freelance Project', category: 'Investment', type: 'income', amount: 15000 },
  { id: 5, date: '2026-01-19', desc: 'Netflix Subscription', category: 'Entertainment', type: 'expense', amount: 649 },
  { id: 6, date: '2026-01-20', desc: 'Gym Membership', category: 'Healthcare', type: 'expense', amount: 2000 },
  { id: 7, date: '2026-01-21', desc: 'Uber Ride', category: 'Transportation', type: 'expense', amount: 450 },
  { id: 8, date: '2026-01-22', desc: 'Investment Returns', category: 'Investment', type: 'income', amount: 5000 },
  { id: 9, date: '2026-01-23', desc: 'Restaurant Dinner', category: 'Food & Dining', type: 'expense', amount: 1800 },
  { id: 10, date: '2026-01-24', desc: 'Online Shopping', category: 'Shopping', type: 'expense', amount: 3500 },
  { id: 11, date: '2026-01-25', desc: 'Rent Payment', category: 'Rent & Housing', type: 'expense', amount: 25000 },
  { id: 12, date: '2026-01-26', desc: 'Bonus Payment', category: 'Salary', type: 'income', amount: 20000 },
  { id: 13, date: '2026-01-27', desc: 'Coffee Shop', category: 'Food & Dining', type: 'expense', amount: 350 },
  { id: 14, date: '2026-01-28', desc: 'Mobile Recharge', category: 'Utilities', type: 'expense', amount: 299 },
  { id: 15, date: '2026-01-29', desc: 'Stock Dividend', category: 'Investment', type: 'income', amount: 2500 }
];

// ─── UTILITY FUNCTIONS ───────────────────────────────────────────
const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN', { 
  day: 'numeric', 
  month: 'short', 
  year: 'numeric' 
});

const showToast = (message, type = 'info') => {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const iconMap = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  };
  
  toast.innerHTML = `
    <div class="toast-icon">${iconMap[type]}</div>
    <div class="toast-content">
      <div class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// ─── THEME MANAGEMENT ───────────────────────────────────────────
const applyTheme = () => {
  document.documentElement.setAttribute('data-theme', STATE.theme);
  const darkBtn = document.getElementById('themeDark');
  const lightBtn = document.getElementById('themeLight');
  
  if (STATE.theme === 'dark') {
    darkBtn?.classList.add('active');
    lightBtn?.classList.remove('active');
  } else {
    lightBtn?.classList.add('active');
    darkBtn?.classList.remove('active');
  }
  
  localStorage.setItem('nexus_theme', STATE.theme);
};

// ─── NAVIGATION ─────────────────────────────────────────────────
const navigate = (section) => {
  STATE.currentSection = section;
  
  // Update nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.section === section) {
      item.classList.add('active');
    }
  });
  
  // Update sections
  document.querySelectorAll('.page-section').forEach(sec => {
    sec.classList.remove('active');
  });
  document.getElementById(`section-${section}`)?.classList.add('active');
  
  // Update page title
  const titles = {
    overview: 'Financial Overview',
    transactions: 'Transaction Management',
    reports: 'Financial Reports',
    settings: 'System Settings'
  };
  const titleElement = document.getElementById('pageTitle');
  if (titleElement) titleElement.textContent = titles[section] || 'Dashboard';
  
  // Re-render content for the active section
  if (section === 'overview') renderOverview();
  if (section === 'transactions') renderTransactions();
  if (section === 'reports') renderReports();
  if (section === 'settings') renderSettings();
};

// ─── DATA CALCULATIONS ───────────────────────────────────────────
const calculateMetrics = () => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyTx = STATE.transactions.filter(tx => {
    const txDate = new Date(tx.date);
    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
  });
  
  const income = monthlyTx.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
  const expenses = monthlyTx.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);
  const balance = STATE.transactions.reduce((sum, tx) => 
    tx.type === 'income' ? sum + tx.amount : sum - tx.amount, 0);
  const savings = income - expenses;
  const savingsRate = income > 0 ? (savings / income * 100).toFixed(1) : 0;
  
  return { balance, income, expenses, savings, savingsRate };
};

const getFilteredTransactions = () => {
  let filtered = [...STATE.transactions];
  
  if (STATE.filters.search) {
    filtered = filtered.filter(tx => 
      tx.desc.toLowerCase().includes(STATE.filters.search.toLowerCase()) ||
      tx.category.toLowerCase().includes(STATE.filters.search.toLowerCase())
    );
  }
  
  if (STATE.filters.type) {
    filtered = filtered.filter(tx => tx.type === STATE.filters.type);
  }
  
  if (STATE.filters.category) {
    filtered = filtered.filter(tx => tx.category === STATE.filters.category);
  }
  
  // Sort
  filtered.sort((a, b) => {
    switch (STATE.filters.sort) {
      case 'date-desc': return new Date(b.date) - new Date(a.date);
      case 'date-asc': return new Date(a.date) - new Date(b.date);
      case 'amount-desc': return b.amount - a.amount;
      case 'amount-asc': return a.amount - b.amount;
      default: return 0;
    }
  });
  
  return filtered;
};

// ─── RENDERING FUNCTIONS ─────────────────────────────────────────
const renderOverview = () => {
  const metrics = calculateMetrics();
  
  // Update metric cards
  const balanceElement = document.getElementById('totalBalance');
  const incomeElement = document.getElementById('totalIncome');
  const expenseElement = document.getElementById('totalExpense');
  const savingsElement = document.getElementById('netSavings');
  
  if (balanceElement) balanceElement.textContent = formatCurrency(metrics.balance);
  if (incomeElement) incomeElement.textContent = formatCurrency(metrics.income);
  if (expenseElement) expenseElement.textContent = formatCurrency(metrics.expenses);
  if (savingsElement) savingsElement.textContent = formatCurrency(metrics.savings);
  
  // Update header stats
  const headerBalance = document.getElementById('headerBalance');
  const headerGrowth = document.getElementById('headerGrowth');
  const headerTransactions = document.getElementById('headerTransactions');
  
  if (headerBalance) headerBalance.textContent = formatCurrency(metrics.balance);
  if (headerGrowth) headerGrowth.textContent = `+${metrics.savingsRate}%`;
  if (headerTransactions) headerTransactions.textContent = STATE.transactions.length;
  
  // Render recent transactions table
  const recentTbody = document.getElementById('recentTxTableBody');
  if (recentTbody) {
    const recentTx = getFilteredTransactions().slice(0, 5);
    recentTbody.innerHTML = recentTx.map(tx => `
      <tr>
        <td>${formatDate(tx.date)}</td>
        <td>${tx.desc}</td>
        <td><span class="cat-chip">${tx.category}</span></td>
        <td><span class="type-badge ${tx.type}">${tx.type}</span></td>
        <td class="text-right ${tx.type}">${formatCurrency(tx.amount)}</td>
      </tr>
    `).join('');
  }
  
  // Render charts
  renderBalanceTrendChart();
  renderCategoryChart();
};

const renderTransactions = () => {
  const filtered = getFilteredTransactions();
  const tbody = document.getElementById('txTableBody');
  
  if (!tbody) return;
  
  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-tertiary);">
          No transactions found
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = filtered.map(tx => `
    <tr>
      <td>${formatDate(tx.date)}</td>
      <td>${tx.desc}</td>
      <td><span class="cat-chip">${tx.category}</span></td>
      <td><span class="type-badge ${tx.type}">${tx.type}</span></td>
      <td class="text-right ${tx.type}">${formatCurrency(tx.amount)}</td>
      <td>
        <div class="table-actions">
          <button class="action-link edit" onclick="editTransaction(${tx.id})">Edit</button>
          <button class="action-link delete" onclick="deleteTransaction(${tx.id})">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
};

const renderReports = () => {
  const container = document.getElementById('reportsContainer');
  if (!container) return;
  
  // Load existing reports from localStorage
  const reports = JSON.parse(localStorage.getItem('nexus_reports') || '[]');
  
  if (reports.length === 0) {
    container.innerHTML = `
      <div class="no-reports">
        <p>No reports generated yet. Create your first financial report above.</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = reports.map(report => `
    <div class="report-item">
      <div class="report-info">
        <div class="report-title">${report.title}</div>
        <div class="report-date">${formatDate(report.generatedAt)}</div>
        <div class="report-type">${report.type}</div>
      </div>
      <div class="report-actions">
        <button class="btn btn-sm btn-secondary" onclick="downloadReport('${report.id}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          Download
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteReport('${report.id}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/>
          </svg>
          Delete
        </button>
      </div>
    </div>
  `).join('');
};

const renderSettings = () => {
  // Load saved settings
  const settings = JSON.parse(localStorage.getItem('nexus_settings') || '{}');
  
  // Apply saved settings to form
  if (settings.adminName) {
    const adminNameInput = document.getElementById('adminName');
    if (adminNameInput) adminNameInput.value = settings.adminName;
  }
  
  if (settings.adminEmail) {
    const adminEmailInput = document.getElementById('adminEmail');
    if (adminEmailInput) adminEmailInput.value = settings.adminEmail;
  }
  
  if (settings.currency) {
    const currencySelect = document.getElementById('currencySelect');
    if (currencySelect) currencySelect.value = settings.currency;
  }
  
  // Apply checkbox settings
  const checkboxes = ['emailNotifications', 'budgetAlerts', 'monthlyReports', 'autoSave', 'animations'];
  checkboxes.forEach(id => {
    const checkbox = document.getElementById(id);
    if (checkbox && settings[id] !== undefined) {
      checkbox.checked = settings[id];
    }
  });
  
  if (settings.dateFormat) {
    const dateFormatSelect = document.getElementById('dateFormat');
    if (dateFormatSelect) dateFormatSelect.value = settings.dateFormat;
  }
};

const generateReport = (type) => {
  const metrics = calculateMetrics();
  const now = new Date().toISOString();
  
  const reportData = {
    id: Date.now().toString(),
    title: `${type.charAt(0).toUpperCase() + type.slice(1)} Financial Report`,
    type: type.charAt(0).toUpperCase() + type.slice(1),
    generatedAt: now,
    data: {
      totalBalance: metrics.balance,
      monthlyIncome: metrics.income,
      monthlyExpenses: metrics.expenses,
      netSavings: metrics.savings,
      savingsRate: metrics.savingsRate,
      totalTransactions: STATE.transactions.length
    },
    transactions: STATE.transactions
  };
  
  // Save report to localStorage
  const reports = JSON.parse(localStorage.getItem('nexus_reports') || '[]');
  reports.unshift(reportData);
  localStorage.setItem('nexus_reports', JSON.stringify(reports));
  
  showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} report generated successfully!`, 'success');
  renderReports();
  
  // Auto-download the report
  downloadReport(reportData.id);
};

const downloadReport = (reportId) => {
  const reports = JSON.parse(localStorage.getItem('nexus_reports') || '[]');
  const report = reports.find(r => r.id === reportId);
  
  if (!report) return;
  
  // Create CSV content
  const csvContent = [
    `${report.title}`,
    `Generated: ${formatDate(report.generatedAt)}`,
    '',
    'Summary',
    `Total Balance,${report.data.totalBalance}`,
    `Monthly Income,${report.data.monthlyIncome}`,
    `Monthly Expenses,${report.data.monthlyExpenses}`,
    `Net Savings,${report.data.netSavings}`,
    `Savings Rate,${report.data.savingsRate}%`,
    `Total Transactions,${report.data.totalTransactions}`,
    '',
    'Transactions',
    'Date,Description,Category,Type,Amount',
    ...report.transactions.map(tx => 
      `${tx.date},"${tx.desc}",${tx.category},${tx.type},${tx.amount}`
    )
  ].join('\n');
  
  // Download the file
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${report.type}_Report_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
  
  showToast('Report downloaded successfully!', 'success');
};

const deleteReport = (reportId) => {
  if (confirm('Are you sure you want to delete this report?')) {
    const reports = JSON.parse(localStorage.getItem('nexus_reports') || '[]');
    const filteredReports = reports.filter(r => r.id !== reportId);
    localStorage.setItem('nexus_reports', JSON.stringify(filteredReports));
    
    showToast('Report deleted successfully', 'success');
    renderReports();
  }
};

const saveSettings = () => {
  const settings = {
    adminName: document.getElementById('adminName')?.value || 'Jay Takalgavankar',
    adminEmail: document.getElementById('adminEmail')?.value || 'jay@zorvynfinance.com',
    currency: document.getElementById('currencySelect')?.value || 'INR',
    dateFormat: document.getElementById('dateFormat')?.value || 'DD/MM/YYYY',
    emailNotifications: document.getElementById('emailNotifications')?.checked || false,
    budgetAlerts: document.getElementById('budgetAlerts')?.checked || false,
    monthlyReports: document.getElementById('monthlyReports')?.checked || false,
    autoSave: document.getElementById('autoSave')?.checked || false,
    animations: document.getElementById('animations')?.checked || false
  };
  
  localStorage.setItem('nexus_settings', JSON.stringify(settings));
  showToast('Settings saved successfully!', 'success');
};

const exportAllData = () => {
  const data = {
    transactions: STATE.transactions,
    settings: JSON.parse(localStorage.getItem('nexus_settings') || '{}'),
    reports: JSON.parse(localStorage.getItem('nexus_reports') || '[]'),
    theme: STATE.theme,
    exportedAt: new Date().toISOString()
  };
  
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Zorvyn_Finance_Backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  window.URL.revokeObjectURL(url);
  
  showToast('All data exported successfully!', 'success');
};

const clearAllData = () => {
  if (confirm('⚠️ WARNING: This will permanently delete ALL your financial data, transactions, reports, and settings. This action cannot be undone. Are you absolutely sure?')) {
    if (confirm('This is your final warning. All data will be lost forever. Click OK to proceed.')) {
      localStorage.removeItem('nexus_transactions');
      localStorage.removeItem('nexus_settings');
      localStorage.removeItem('nexus_reports');
      localStorage.removeItem('nexus_theme');
      
      STATE.transactions = [...SEED_TRANSACTIONS];
      STATE.theme = 'dark';
      
      showToast('All data has been cleared. The dashboard has been reset to default.', 'info');
      
      // Reload the page to reset everything
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }
};

// ─── CHART RENDERING ─────────────────────────────────────────────
const renderBalanceTrendChart = () => {
  const ctx = document.getElementById('balanceTrendChart')?.getContext('2d');
  if (!ctx) return;
  
  if (STATE.charts.balanceTrend) {
    STATE.charts.balanceTrend.destroy();
  }
  
  const last6Months = [];
  const balanceData = [];
  let runningBalance = 0;
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStr = date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    last6Months.push(monthStr);
    
    // Calculate cumulative balance
    const monthTx = STATE.transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === date.getMonth() && txDate.getFullYear() === date.getFullYear();
    });
    
    monthTx.forEach(tx => {
      runningBalance += tx.type === 'income' ? tx.amount : -tx.amount;
    });
    balanceData.push(runningBalance);
  }
  
  STATE.charts.balanceTrend = new Chart(ctx, {
    type: 'line',
    data: {
      labels: last6Months,
      datasets: [{
        label: 'Balance Trend',
        data: balanceData,
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#00d4ff',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          cornerRadius: 8,
          titleFont: { size: 14, weight: '600' },
          bodyFont: { size: 12 },
          callbacks: {
            label: (context) => `Balance: ${formatCurrency(context.parsed.y)}`
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#9ca3af', font: { size: 11 } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { 
            color: '#9ca3af', 
            font: { size: 11 },
            callback: (value) => formatCurrency(value)
          }
        }
      }
    }
  });
};

const renderCategoryChart = () => {
  const ctx = document.getElementById('categoryChart')?.getContext('2d');
  if (!ctx) return;
  
  if (STATE.charts.category) {
    STATE.charts.category.destroy();
  }
  
  const categoryData = {};
  STATE.transactions
    .filter(tx => tx.type === 'expense')
    .forEach(tx => {
      categoryData[tx.category] = (categoryData[tx.category] || 0) + tx.amount;
    });
  
  const sortedCategories = Object.entries(categoryData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6);
  
  STATE.charts.category = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: sortedCategories.map(([cat]) => cat),
      datasets: [{
        data: sortedCategories.map(([, amount]) => amount),
        backgroundColor: [
          '#00d4ff', '#7c3aed', '#10b981', '#f59e0b', 
          '#ef4444', '#06b6d4'
        ],
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { 
            color: '#9ca3af',
            padding: 15,
            font: { size: 11 },
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (context) => `${context.label}: ${formatCurrency(context.parsed)}`
          }
        }
      },
      cutout: '65%'
    }
  });
};

const renderMonthlyCompareChart = () => {
  const ctx = document.getElementById('monthlyCompareChart')?.getContext('2d');
  if (!ctx) return;
  
  if (STATE.charts.monthlyCompare) {
    STATE.charts.monthlyCompare.destroy();
  }
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const incomeData = months.map(() => Math.floor(Math.random() * 50000) + 50000);
  const expenseData = months.map(() => Math.floor(Math.random() * 40000) + 30000);
  
  STATE.charts.monthlyCompare = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          backgroundColor: '#10b981',
          borderRadius: 6
        },
        {
          label: 'Expenses',
          data: expenseData,
          backgroundColor: '#ef4444',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { color: '#9ca3af', font: { size: 12 } }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (context) => `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#9ca3af', font: { size: 11 } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { 
            color: '#9ca3af', 
            font: { size: 11 },
            callback: (value) => formatCurrency(value)
          }
        }
      }
    }
  });
};

const renderIncomeExpenseChart = () => {
  const ctx = document.getElementById('incomeExpenseChart')?.getContext('2d');
  if (!ctx) return;
  
  if (STATE.charts.incomeExpense) {
    STATE.charts.incomeExpense.destroy();
  }
  
  STATE.charts.incomeExpense = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'Income',
          data: [20000, 25000, 22000, 28000],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        },
        {
          label: 'Expenses',
          data: [15000, 18000, 16000, 20000],
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { color: '#9ca3af', font: { size: 12 } }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (context) => `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#9ca3af', font: { size: 11 } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { 
            color: '#9ca3af', 
            font: { size: 11 },
            callback: (value) => formatCurrency(value)
          }
        }
      }
    }
  });
};

// ─── MODAL FUNCTIONS ─────────────────────────────────────────────
const openModal = (title = 'Add Transaction') => {
  const modal = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const fDate = document.getElementById('fDate');
  
  if (modalTitle) modalTitle.textContent = title;
  if (fDate) fDate.value = new Date().toISOString().split('T')[0];
  if (modal) modal.classList.add('open');
};

const closeModal = () => {
  const modal = document.getElementById('modalOverlay');
  if (modal) modal.classList.remove('open');
  
  // Clear form
  const fDesc = document.getElementById('fDesc');
  const fAmount = document.getElementById('fAmount');
  const fType = document.getElementById('fType');
  const fCategory = document.getElementById('fCategory');
  
  if (fDesc) fDesc.value = '';
  if (fAmount) fAmount.value = '';
  if (fType) fType.value = 'expense';
  if (fCategory) fCategory.selectedIndex = 0;
};

const saveTransaction = () => {
  const fDesc = document.getElementById('fDesc');
  const fAmount = document.getElementById('fAmount');
  const fType = document.getElementById('fType');
  const fCategory = document.getElementById('fCategory');
  const fDate = document.getElementById('fDate');
  
  const desc = fDesc?.value.trim();
  const amount = parseFloat(fAmount?.value);
  const type = fType?.value;
  const category = fCategory?.value;
  const date = fDate?.value;
  
  if (!desc || !amount || !date) {
    showToast('Please fill all required fields', 'error');
    return;
  }
  
  const newTx = {
    id: Date.now(),
    desc,
    amount,
    type,
    category,
    date
  };
  
  STATE.transactions.unshift(newTx);
  persist();
  
  closeModal();
  showToast('Transaction added successfully', 'success');
  
  // Re-render current section
  navigate(STATE.currentSection);
};

const editTransaction = (id) => {
  const tx = STATE.transactions.find(t => t.id === id);
  if (!tx) return;
  
  const fDesc = document.getElementById('fDesc');
  const fAmount = document.getElementById('fAmount');
  const fType = document.getElementById('fType');
  const fCategory = document.getElementById('fCategory');
  const fDate = document.getElementById('fDate');
  const modalSave = document.getElementById('modalSave');
  
  if (fDesc) fDesc.value = tx.desc;
  if (fAmount) fAmount.value = tx.amount;
  if (fType) fType.value = tx.type;
  if (fCategory) fCategory.value = tx.category;
  if (fDate) fDate.value = tx.date;
  
  openModal('Edit Transaction');
  
  // Update save button to handle edit
  if (modalSave) {
    modalSave.onclick = () => {
      tx.desc = fDesc?.value.trim();
      tx.amount = parseFloat(fAmount?.value);
      tx.type = fType?.value;
      tx.category = fCategory?.value;
      tx.date = fDate?.value;
      
      persist();
      closeModal();
      showToast('Transaction updated successfully', 'success');
      navigate(STATE.currentSection);
      
      // Restore original save function
      modalSave.onclick = saveTransaction;
    };
  }
};

const deleteTransaction = (id) => {
  if (confirm('Are you sure you want to delete this transaction?')) {
    STATE.transactions = STATE.transactions.filter(tx => tx.id !== id);
    persist();
    showToast('Transaction deleted successfully', 'success');
    navigate(STATE.currentSection);
  }
};

// ─── PERSISTENCE ─────────────────────────────────────────────────
const persist = () => {
  localStorage.setItem('nexus_transactions', JSON.stringify(STATE.transactions));
};

// ─── EVENT BINDING ───────────────────────────────────────────────
const bindEvents = () => {
  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(item.dataset.section);
    });
  });
  
  // Mobile menu
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const sidebar = document.getElementById('sidebar');
  if (mobileMenuToggle && sidebar) {
    mobileMenuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
  
  // Theme controls
  const themeDark = document.getElementById('themeDark');
  const themeLight = document.getElementById('themeLight');
  
  if (themeDark) {
    themeDark.addEventListener('click', () => {
      STATE.theme = 'dark';
      applyTheme();
    });
  }
  
  if (themeLight) {
    themeLight.addEventListener('click', () => {
      STATE.theme = 'light';
      applyTheme();
    });
  }
  
  // Modal controls
  const addTransactionBtn = document.getElementById('addTransactionBtn');
  const addTxBtn = document.getElementById('addTxBtn');
  const modalClose = document.getElementById('modalClose');
  const modalCancel = document.getElementById('modalCancel');
  const modalSave = document.getElementById('modalSave');
  
  if (addTransactionBtn) addTransactionBtn.addEventListener('click', () => openModal());
  if (addTxBtn) addTxBtn.addEventListener('click', () => openModal());
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalCancel) modalCancel.addEventListener('click', closeModal);
  if (modalSave) modalSave.addEventListener('click', saveTransaction);
  
  // Close modal on overlay click
  const modalOverlay = document.getElementById('modalOverlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target.id === 'modalOverlay') closeModal();
    });
  }
  
  // Filters
  const searchInput = document.getElementById('searchInput');
  const filterType = document.getElementById('filterType');
  const filterCategory = document.getElementById('filterCategory');
  const sortSelect = document.getElementById('sortSelect');
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      STATE.filters.search = e.target.value;
      renderTransactions();
    });
  }
  
  if (filterType) {
    filterType.addEventListener('change', (e) => {
      STATE.filters.type = e.target.value;
      renderTransactions();
    });
  }
  
  if (filterCategory) {
    filterCategory.addEventListener('change', (e) => {
      STATE.filters.category = e.target.value;
      renderTransactions();
    });
  }
  
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      STATE.filters.sort = e.target.value;
      renderTransactions();
    });
  }
  
  // Chart period controls
  document.querySelectorAll('.chart-control').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const parent = e.target.closest('.chart-controls');
      parent?.querySelectorAll('.chart-control').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderBalanceTrendChart(); // Re-render with new period
    });
  });
  
  // Header actions
  const exportBtn = document.getElementById('exportBtn');
  const refreshBtn = document.getElementById('refreshBtn');
  const notificationBtn = document.getElementById('notificationBtn');
  
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      exportAllData();
    });
  }
  
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      navigate(STATE.currentSection);
      showToast('Data refreshed', 'success');
    });
  }
  
  if (notificationBtn) {
    notificationBtn.addEventListener('click', () => {
      showToast('No new notifications', 'info');
    });
  }
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    if (e.ctrlKey && e.key === 'n') {
      e.preventDefault();
      openModal();
    }
  });
  
  // Reports section event listeners
  document.querySelectorAll('.generate-report').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const type = e.target.dataset.type;
      generateReport(type);
    });
  });
  
  // Settings section event listeners
  const saveProfileBtn = document.getElementById('saveProfileBtn');
  const saveNotificationsBtn = document.getElementById('saveNotificationsBtn');
  const saveSystemBtn = document.getElementById('saveSystemBtn');
  const exportDataBtn = document.getElementById('exportDataBtn');
  const clearDataBtn = document.getElementById('clearDataBtn');
  
  if (saveProfileBtn) saveProfileBtn.addEventListener('click', saveSettings);
  if (saveNotificationsBtn) saveNotificationsBtn.addEventListener('click', saveSettings);
  if (saveSystemBtn) saveSystemBtn.addEventListener('click', saveSettings);
  if (exportDataBtn) exportDataBtn.addEventListener('click', exportAllData);
  if (clearDataBtn) clearDataBtn.addEventListener('click', clearAllData);
  
  const generateReportBtn = document.getElementById('generateReportBtn');
  if (generateReportBtn) {
    generateReportBtn.addEventListener('click', () => {
      generateReport('monthly');
    });
  }
};

// ─── INITIALIZE ───────────────────────────────────────────────────
const init = () => {
  // Load persisted data
  const stored = localStorage.getItem('nexus_transactions');
  STATE.transactions = stored ? JSON.parse(stored) : [...SEED_TRANSACTIONS];
  
  const storedTheme = localStorage.getItem('nexus_theme');
  if (storedTheme) STATE.theme = storedTheme;
  
  // Apply theme
  applyTheme();
  
  // Bind events
  bindEvents();
  
  // Initial render
  navigate('overview');
  
  // Show welcome message
  setTimeout(() => {
    showToast('Welcome to Zorvyn Finance Suite, Jay!', 'success');
  }, 500);
};

// ─── START APPLICATION ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
