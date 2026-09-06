import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useExpenses } from '../context/ExpenseContext';
import { MonthTotal } from '../components/MonthTotal';
import { ExpenseListItem } from '../components/ExpenseListItem';
import { Expense, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type GroupMode = 'date' | 'category' | 'all';

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { expenses, loading, removeExpense, refreshExpenses } = useExpenses();
  const [groupMode, setGroupMode] = useState<GroupMode>('all');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshExpenses();
    setRefreshing(false);
  };

  const handleEditExpense = (expense: Expense) => {
    navigation.navigate('AddExpense', { expense });
  };

  const handleDeleteExpense = async (id: string) => {
    await removeExpense(id);
  };

  // Grouping / sorting logic
  const displayItems = useMemo(() => {
    if (groupMode === 'category') {
      return [...expenses].sort((a, b) => a.category.localeCompare(b.category));
    }
    // Default by date descending
    return [...expenses].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [expenses, groupMode]);

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Track Your Spend</Text>
          <Text style={styles.headerTitle}>Expense Tracker</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.statsButton}
            onPress={() => navigation.navigate('Stats')}>
            <Text style={styles.statsButtonText}>📊 Stats</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddExpense')}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && expenses.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#38BDF8" />
          <Text style={styles.loadingText}>Loading your expenses...</Text>
        </View>
      ) : (
        <FlatList
          data={displayItems}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#38BDF8"
            />
          }
          ListHeaderComponent={
            <View>
              {/* Monthly Overview Card */}
              <MonthTotal expenses={expenses} />

              {/* Controls bar */}
              <View style={styles.controlsRow}>
                <Text style={styles.recentTitle}>
                  {expenses.length} Transaction{expenses.length === 1 ? '' : 's'}
                </Text>

                <View style={styles.filterPills}>
                  <TouchableOpacity
                    onPress={() => setGroupMode('all')}
                    style={[
                      styles.filterPill,
                      groupMode === 'all' && styles.filterPillActive,
                    ]}>
                    <Text
                      style={[
                        styles.filterPillText,
                        groupMode === 'all' && styles.filterPillTextActive,
                      ]}>
                      Recent
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setGroupMode('category')}
                    style={[
                      styles.filterPill,
                      groupMode === 'category' && styles.filterPillActive,
                    ]}>
                    <Text
                      style={[
                        styles.filterPillText,
                        groupMode === 'category' && styles.filterPillTextActive,
                      ]}>
                      Category
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <ExpenseListItem
              expense={item}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>💸</Text>
              <Text style={styles.emptyTitle}>No Expenses Recorded</Text>
              <Text style={styles.emptySubtitle}>
                Keep track of your spending by logging your first expense!
              </Text>
              <TouchableOpacity
                style={styles.emptyActionButton}
                onPress={() => navigation.navigate('AddExpense')}>
                <Text style={styles.emptyActionButtonText}>+ Add First Expense</Text>
              </TouchableOpacity>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerGreeting: {
    fontSize: 12,
    color: '#38BDF8',
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.3,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  statsButton: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statsButtonText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
  },
  addButton: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
  },
  recentTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  filterPills: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  filterPillActive: {
    backgroundColor: '#0284C7',
  },
  filterPillText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyActionButton: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  emptyActionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
