---
name: expense-tracker-rn
description: "Use this skill when the user wants to build, scaffold, or extend a React Native Expense Tracker mobile app (Expo-based). Covers project setup, screen structure, local persistence with AsyncStorage, navigation, and category-based spending charts. Trigger on requests like 'build the expense tracker app', 'scaffold the RN expense app', 'add a new screen to the expense tracker', or 'implement expense CRUD'. Do NOT use for backend-only work, web apps, or unrelated mobile app ideas."
license: Proprietary. LICENSE.txt has complete terms
---

# React Native Expense Tracker — Build Guide

A minimal, local-first expense tracking app built with Expo. This skill defines the exact
scope, stack, file layout, and build order so an agent can implement it end-to-end without
re-deriving architecture decisions.

## Scope (do not exceed without user request)

**In scope:**
- Add / edit / delete an expense (amount, category, date, optional note)
- List expenses grouped by date or category
- Monthly total + category breakdown chart
- Local persistence only (AsyncStorage) — survives app restarts

**Out of scope unless explicitly asked:**
- Backend, auth, cloud sync (Firebase/Express+Mongo) — this is a *later* extension, not v1
- Multi-currency, budgets/alerts, CSV export, recurring expenses
- Redux/MobX or any state library beyond `useState`/`useContext`

If the user asks for something in "out of scope," confirm it's an intentional extension before building it — don't silently scope-creep the base app.

## Stack (fixed — do not substitute without asking)

| Concern | Choice | Why |
|---|---|---|
| Framework | Expo (managed workflow) | Fastest setup, no native build tooling needed |
| Navigation | `@react-navigation/native` + `@react-navigation/native-stack` | Standard for Expo |
| Storage | `@react-native-async-storage/async-storage` | Simple key-value, sufficient for this data size |
| Charts | `react-native-chart-kit` (+ `react-native-svg`) | Lightweight, good enough for one pie/bar chart |
| Forms | Plain controlled components (`useState`) | No form library needed at this scale |
| Language | TypeScript | Catch expense-shape bugs early |

## Data model

```ts
type Expense = {
  id: string;        // uuid
  amount: number;     // positive, 2 decimal places
  category: string;   // one of CATEGORIES
  date: string;        // ISO 8601, e.g. "2026-09-06"
  note?: string;
};

const CATEGORIES = ["Food", "Transport", "Bills", "Shopping", "Health", "Other"] as const;
```

Store as a single JSON array under one AsyncStorage key (`"expenses"`) — not one key per
expense. At this scale (a personal expense log), one read/write per app action is simpler and
avoids key-management bugs.

## File structure to create

```
expense-tracker/
├── App.tsx
├── app.json
├── package.json
├── tsconfig.json
├── src/
│   ├── types.ts                 # Expense, CATEGORIES
│   ├── storage/
│   │   └── expenseStorage.ts    # getAll, add, update, remove — all AsyncStorage I/O lives here
│   ├── context/
│   │   └── ExpenseContext.tsx   # useContext provider wrapping storage, exposes CRUD + list to screens
│   ├── navigation/
│   │   └── RootNavigator.tsx    # native-stack: Home, AddExpense, Stats
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── AddExpenseScreen.tsx
│   │   └── StatsScreen.tsx
│   └── components/
│       ├── ExpenseListItem.tsx
│       ├── CategoryPicker.tsx
│       └── MonthTotal.tsx
```

**Rule:** no screen talks to AsyncStorage directly — always through `ExpenseContext`. This
keeps persistence swappable later (e.g. to SQLite or a backend) without touching screen code.

## Build order (follow this sequence — each step should run before the next starts)

1. **Scaffold**: `npx create-expo-app expense-tracker --template expo-template-blank-typescript`
2. **Install deps**: navigation, async-storage, chart-kit, svg, uuid (see commands below)
3. **`src/types.ts`** — define `Expense` and `CATEGORIES` first; everything else depends on this shape
4. **`src/storage/expenseStorage.ts`** — implement and manually verify `getAll`/`add`/`update`/`remove` against AsyncStorage before wiring any UI
5. **`src/context/ExpenseContext.tsx`** — wrap storage functions, expose `expenses`, `addExpense`, `updateExpense`, `removeExpense`, `loading`
6. **`RootNavigator.tsx`** — stack with 3 empty placeholder screens, confirm navigation works before adding real UI
7. **`HomeScreen`** — list + `MonthTotal`, empty-state message when no expenses
8. **`AddExpenseScreen`** — form (amount, `CategoryPicker`, date, note), validates amount > 0 before submit
9. **`StatsScreen`** — aggregate `expenses` by category in-memory (`useMemo`), feed into chart-kit pie chart
10. **Polish**: edit/delete from `HomeScreen` (swipe or long-press), loading states, empty states

Do not jump ahead to Stats/charts before CRUD (steps 4–8) is working — the chart is the
easiest step to get wrong silently (wrong aggregation) if tested against fake instead of real
stored data.

## Install commands

```bash
npx create-expo-app expense-tracker --template expo-template-blank-typescript
cd expense-tracker
npx expo install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
npx expo install @react-native-async-storage/async-storage
npx expo install react-native-svg
npm install react-native-chart-kit uuid
npm install --save-dev @types/uuid
```

Use `npx expo install` (not plain `npm install`) for any package with native code — it pins
the version Expo's current SDK expects. Plain `npm install` is fine for pure-JS packages
(`react-native-chart-kit`, `uuid`).

## Gotchas

- **AsyncStorage is async everywhere.** Every context method must be `async`/return a
  `Promise`; screens must handle a loading state on first mount, not assume data is
  immediately available.
- **Don't store `Date` objects.** AsyncStorage is string-only (JSON). Store ISO date strings,
  parse to `Date` only where needed for display/sorting.
- **chart-kit needs non-empty data.** Guard the `StatsScreen` chart render — if `expenses` is
  empty, show an empty-state message instead of passing a zero-length data array to the chart
  (it will throw or render broken).
- **IDs must be stable and unique.** Use `uuid` (`uuidv4()`), never array index — index breaks
  edit/delete once the list is filtered or re-sorted.
- **Category values are a closed set.** `CategoryPicker` should render from `CATEGORIES`, not
  a free-text field — keeps `StatsScreen` aggregation correct.

## Verification before calling a step done

- Add an expense → force-close and reopen the app (or reload) → expense still appears
- Delete an expense → total on `HomeScreen`/`StatsScreen` updates immediately
- Add expenses in 2+ categories → `StatsScreen` chart shows correct proportions, not just "renders something"
- Empty state: fresh install with zero expenses shows a message, not a blank screen or crash

## Extension points (only build if user asks)

- Swap `expenseStorage.ts` internals for `expo-sqlite` — context/screens shouldn't need to change if the interface (`getAll`/`add`/`update`/`remove`) stays the same
- Cloud sync: add an Express + MongoDB backend, sync on app foreground
- Budgets: add a `monthlyBudget` setting, show progress bar on `HomeScreen`
