const STORAGE_KEYS = {
  EXPENSES: 'bizo_expenses',
  BUDGETS: 'bizo_budgets',
};

// Initialize default data if none exists
const initializeStorage = () => {
  if (typeof window === 'undefined') return;

  const expenses = localStorage.getItem(STORAGE_KEYS.EXPENSES);
  const budgets = localStorage.getItem(STORAGE_KEYS.BUDGETS);

  if (!expenses) {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify([]));
  }

  if (!budgets) {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify([
      {
        id: Date.now(),
        amount: 1000,
        source_name: 'Initial Budget',
        updated_at: new Date().toISOString(),
      }
    ]));
  }
};

// Expenses operations
export const getExpenses = () => {
  if (typeof window === 'undefined') return [];
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
  return data ? JSON.parse(data) : [];
};

export const addExpense = (expense) => {
  const expenses = getExpenses();
  const newExpense = {
    id: Date.now(),
    amount: expense.amount,
    source_name: expense.source_name || 'Unnamed Expense',
    created_at: new Date().toISOString(),
  };
  expenses.push(newExpense);
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  return newExpense;
};

export const deleteExpense = (id) => {
  const expenses = getExpenses();
  const filtered = expenses.filter(expense => expense.id !== id);
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(filtered));
  return true;
};

export const getTotalExpenses = () => {
  const expenses = getExpenses();
  return expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
};

// Budget operations
export const getBudgets = () => {
  if (typeof window === 'undefined') return [];
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
  return data ? JSON.parse(data) : [];
};

export const getCurrentBudget = () => {
  const budgets = getBudgets();
  if (budgets.length === 0) return { amount: 1000 };

  // Sort by updated_at and get the most recent
  const sorted = budgets.sort((a, b) =>
    new Date(b.updated_at) - new Date(a.updated_at)
  );
  return sorted[0];
};

export const addBudget = (budget) => {
  const budgets = getBudgets();
  const newBudget = {
    id: Date.now(),
    amount: budget.amount,
    source_name: budget.source_name || 'Budget Update',
    updated_at: new Date().toISOString(),
  };
  budgets.push(newBudget);
  localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  return newBudget;
};

export const deleteBudget = (id) => {
  const budgets = getBudgets();
  const filtered = budgets.filter(budget => budget.id !== id);
  localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(filtered));
  return true;
};

// Clear all data (useful for reset)
export const clearAllData = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.EXPENSES);
  localStorage.removeItem(STORAGE_KEYS.BUDGETS);
  initializeStorage();
};

// Export data to JSON
export const exportToJSON = () => {
  const data = {
    expenses: getExpenses(),
    budgets: getBudgets(),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
};

// Import data from JSON
export const importFromJSON = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    if (data.expenses) {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(data.expenses));
    }
    if (data.budgets) {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(data.budgets));
    }
    return true;
  } catch (error) {
    console.error('Error importing JSON:', error);
    return false;
  }
};
