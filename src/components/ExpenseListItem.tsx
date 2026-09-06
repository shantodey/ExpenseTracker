import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Expense } from '../types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from './CategoryPicker';

interface ExpenseListItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export const ExpenseListItem: React.FC<ExpenseListItemProps> = ({
  expense,
  onEdit,
  onDelete,
}) => {
  const categoryColor = CATEGORY_COLORS[expense.category] || '#64748B';
  const categoryIcon = CATEGORY_ICONS[expense.category] || '🏷️';

  const formattedDate = (() => {
    try {
      const d = new Date(expense.date);
      if (isNaN(d.getTime())) return expense.date;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return expense.date;
    }
  })();

  const handleDeletePress = () => {
    Alert.alert(
      'Delete Expense',
      `Are you sure you want to delete this $${expense.amount.toFixed(2)} ${expense.category} expense?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(expense.id),
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onEdit(expense)}
      style={styles.card}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: `${categoryColor}22`, borderColor: `${categoryColor}44` },
        ]}>
        <Text style={styles.icon}>{categoryIcon}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.categoryTitle}>{expense.category}</Text>
          <Text style={styles.amountText}>-${expense.amount.toFixed(2)}</Text>
        </View>

        <View style={styles.subRow}>
          <Text
            style={styles.noteText}
            numberOfLines={1}
            ellipsizeMode="tail">
            {expense.note && expense.note.trim().length > 0
              ? expense.note
              : 'No description'}
          </Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={handleDeletePress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#334155',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
  },
  subRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteText: {
    fontSize: 13,
    color: '#94A3B8',
    flex: 1,
    marginRight: 8,
  },
  dateText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  actions: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },
});
