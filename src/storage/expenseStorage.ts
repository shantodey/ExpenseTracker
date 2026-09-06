import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { Expense } from '../types';

const STORAGE_KEY = 'expenses';

function generateUniqueId(): string {
  try {
    return uuidv4();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
}

export const expenseStorage = {
  /**
   * Retrieves all expenses sorted by date descending (most recent first).
   */
  async getAll(): Promise<Expense[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (!jsonValue) {
        return [];
      }
      const parsed = JSON.parse(jsonValue);
      if (!Array.isArray(parsed)) {
        return [];
      }
      // Sort by date descending
      return parsed.sort((a: Expense, b: Expense) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    } catch (error) {
      console.error('Failed to load expenses from AsyncStorage:', error);
      return [];
    }
  },

  /**
   * Adds a new expense, generating an ID if not provided.
   */
  async add(expenseInput: Omit<Expense, 'id'> | Expense): Promise<Expense> {
    const expenses = await this.getAll();
    const newExpense: Expense = {
      ...expenseInput,
      id: 'id' in expenseInput && expenseInput.id ? expenseInput.id : generateUniqueId(),
      amount: Number(Number(expenseInput.amount).toFixed(2)),
    };

    const updated = [newExpense, ...expenses];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newExpense;
  },

  /**
   * Updates an existing expense by ID.
   */
  async update(updatedExpense: Expense): Promise<Expense> {
    const expenses = await this.getAll();
    const normalized: Expense = {
      ...updatedExpense,
      amount: Number(Number(updatedExpense.amount).toFixed(2)),
    };

    const updatedList = expenses.map((item) =>
      item.id === normalized.id ? normalized : item
    );

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return normalized;
  },

  /**
   * Removes an expense by ID.
   */
  async remove(id: string): Promise<void> {
    const expenses = await this.getAll();
    const filtered = expenses.filter((item) => item.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  /**
   * Utility for testing or resetting storage.
   */
  async clearAll(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },
};
