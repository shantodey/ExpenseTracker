import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Expense } from '../types';

interface MonthTotalProps {
  expenses: Expense[];
}

export const MonthTotal: React.FC<MonthTotalProps> = ({ expenses }) => {
  const currentMonthData = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const monthName = now.toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });

    let monthTotal = 0;
    let monthCount = 0;

    for (const exp of expenses) {
      const expDate = new Date(exp.date);
      if (
        !isNaN(expDate.getTime()) &&
        expDate.getFullYear() === currentYear &&
        expDate.getMonth() === currentMonth
      ) {
        monthTotal += Number(exp.amount) || 0;
        monthCount += 1;
      }
    }

    const allTimeTotal = expenses.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0
    );

    return {
      monthName,
      monthTotal: monthTotal.toFixed(2),
      monthCount,
      allTimeTotal: allTimeTotal.toFixed(2),
    };
  }, [expenses]);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.monthSubtitle}>SPENDING OVERVIEW</Text>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{currentMonthData.monthName}</Text>
        </View>
      </View>

      <View style={styles.amountContainer}>
        <Text style={styles.currencySymbol}>$</Text>
        <Text style={styles.amountText}>{currentMonthData.monthTotal}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.footerRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Transactions this month</Text>
          <Text style={styles.statValue}>{currentMonthData.monthCount}</Text>
        </View>

        <View style={styles.statItemRight}>
          <Text style={styles.statLabel}>All-time total</Text>
          <Text style={styles.statValue}>${currentMonthData.allTimeTotal}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38BDF8',
    letterSpacing: 1.2,
  },
  pill: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  pillText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    marginBottom: 8,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: '#38BDF8',
    marginTop: 4,
    marginRight: 4,
  },
  amountText: {
    fontSize: 38,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 14,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
  },
  statItemRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E2E8F0',
  },
});
