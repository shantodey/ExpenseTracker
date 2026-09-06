import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { expenseStorage } from '../storage/expenseStorage';
import { Expense } from '../types';

interface ExpenseContextType {
  expenses: Expense[];
  loading: boolean;
  addExpense: (expense: Omit<Expense, 'id'> | Expense) => Promise<Expense>;
  updateExpense: (expense: Expense) => Promise<Expense>;
  removeExpense: (id: string) => Promise<void>;
  refreshExpenses: () => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshExpenses = useCallback(async () => {
    try {
      const data = await expenseStorage.getAll();
      setExpenses(data);
    } catch (error) {
      console.error('Failed to load expenses:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshExpenses();
  }, [refreshExpenses]);

  const addExpense = useCallback(
    async (expense: Omit<Expense, 'id'> | Expense): Promise<Expense> => {
      const created = await expenseStorage.add(expense);
      // Immediately update local state
      setExpenses((prev) => [created, ...prev.filter((e) => e.id !== created.id)]);
      return created;
    },
    []
  );

  const updateExpense = useCallback(
    async (expense: Expense): Promise<Expense> => {
      const updated = await expenseStorage.update(expense);
      setExpenses((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      return updated;
    },
    []
  );

  const removeExpense = useCallback(async (id: string): Promise<void> => {
    await expenseStorage.remove(id);
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        loading,
        addExpense,
        updateExpense,
        removeExpense,
        refreshExpenses,
      }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export function useExpenses(): ExpenseContextType {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}
