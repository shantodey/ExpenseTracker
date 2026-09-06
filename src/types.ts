export const CATEGORIES = [
  'Food',
  'Transport',
  'Bills',
  'Shopping',
  'Health',
  'Other',
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Expense = {
  id: string; // uuid
  amount: number; // positive, 2 decimal places
  category: Category | string; // one of CATEGORIES
  date: string; // ISO 8601, e.g. "2026-09-06"
  note?: string;
};

export type RootStackParamList = {
  Home: undefined;
  AddExpense: { expense?: Expense } | undefined;
  Stats: undefined;
};
