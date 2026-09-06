import React, { useMemo } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useExpenses } from '../context/ExpenseContext';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../components/CategoryPicker';
import { CATEGORIES, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Stats'>;

const screenWidth = Dimensions.get('window').width;

export const StatsScreen: React.FC<Props> = ({ navigation }) => {
  const { expenses } = useExpenses();

  const { chartData, categoryBreakdown, grandTotal } = useMemo(() => {
    let total = 0;
    const categoryTotals: Record<string, { amount: number; count: number }> = {};

    // Initialize with known categories
    for (const cat of CATEGORIES) {
      categoryTotals[cat] = { amount: 0, count: 0 };
    }

    for (const exp of expenses) {
      const amt = Number(exp.amount) || 0;
      total += amt;
      const cat = exp.category || 'Other';
      if (!categoryTotals[cat]) {
        categoryTotals[cat] = { amount: 0, count: 0 };
      }
      categoryTotals[cat].amount += amt;
      categoryTotals[cat].count += 1;
    }

    // Prepare chart data only for categories that have spend > 0
    const activeData = Object.entries(categoryTotals)
      .filter(([_, data]) => data.amount > 0)
      .map(([cat, data]) => ({
        name: cat,
        population: Number(data.amount.toFixed(2)),
        color: CATEGORY_COLORS[cat] || '#94A3B8',
        legendFontColor: '#CBD5E1',
        legendFontSize: 12,
      }));

    // Prepare sorted list for breakdown
    const breakdown = Object.entries(categoryTotals)
      .filter(([_, data]) => data.amount > 0)
      .map(([cat, data]) => ({
        category: cat,
        amount: data.amount,
        count: data.count,
        percentage: total > 0 ? ((data.amount / total) * 100).toFixed(1) : '0',
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      chartData: activeData,
      categoryBreakdown: breakdown,
      grandTotal: total,
    };
  }, [expenses]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>TOTAL SPENDING</Text>
        <Text style={styles.summaryAmount}>${grandTotal.toFixed(2)}</Text>
        <Text style={styles.summarySub}>
          Across {expenses.length} transaction{expenses.length === 1 ? '' : 's'}
        </Text>
      </View>

      {/* Chart Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category Breakdown</Text>

        {chartData.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyTitle}>No Spending Data Yet</Text>
            <Text style={styles.emptySubtitle}>
              Add some expenses to see your visual category distribution!
            </Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => navigation.navigate('AddExpense')}>
              <Text style={styles.addBtnText}>+ Add First Expense</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.chartWrapper}>
            <PieChart
              data={chartData}
              width={screenWidth - 32}
              height={210}
              chartConfig={{
                backgroundColor: '#1E293B',
                backgroundGradientFrom: '#1E293B',
                backgroundGradientTo: '#1E293B',
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        )}
      </View>

      {/* Detailed Category Table */}
      {categoryBreakdown.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories Ranked by Spend</Text>
          <View style={styles.breakdownList}>
            {categoryBreakdown.map((item) => {
              const color = CATEGORY_COLORS[item.category] || '#64748B';
              const icon = CATEGORY_ICONS[item.category] || '🏷️';

              return (
                <View key={item.category} style={styles.breakdownItem}>
                  <View style={styles.categoryLeft}>
                    <View
                      style={[
                        styles.catIconCircle,
                        { backgroundColor: `${color}25`, borderColor: color },
                      ]}>
                      <Text style={styles.catIconText}>{icon}</Text>
                    </View>
                    <View>
                      <Text style={styles.catName}>{item.category}</Text>
                      <Text style={styles.catCount}>
                        {item.count} transaction{item.count === 1 ? '' : 's'} ({item.percentage}%)
                      </Text>
                    </View>
                  </View>

                  <View style={styles.categoryRight}>
                    <Text style={styles.catAmount}>${item.amount.toFixed(2)}</Text>
                    {/* Visual mini progress bar */}
                    <View style={styles.progressBarTrack}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${Math.min(100, Math.max(4, parseFloat(item.percentage)))}%`,
                            backgroundColor: color,
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  summaryCard: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38BDF8',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  summarySub: {
    fontSize: 13,
    color: '#94A3B8',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E2E8F0',
    letterSpacing: 0.2,
  },
  chartWrapper: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  emptyState: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  emptyIcon: {
    fontSize: 42,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F1F5F9',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 16,
  },
  addBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  breakdownList: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  catIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catIconText: {
    fontSize: 18,
  },
  catName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F1F5F9',
  },
  catCount: {
    fontSize: 12,
    color: '#94A3B8',
  },
  categoryRight: {
    alignItems: 'flex-end',
    width: 110,
  },
  catAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  progressBarTrack: {
    width: '100%',
    height: 5,
    backgroundColor: '#334155',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
