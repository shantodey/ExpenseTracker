import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useExpenses } from '../context/ExpenseContext';
import { CategoryPicker } from '../components/CategoryPicker';
import { Category, Expense, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddExpense'>;

export const AddExpenseScreen: React.FC<Props> = ({ navigation, route }) => {
  const existingExpense = route.params?.expense;
  const isEditing = Boolean(existingExpense);

  const { addExpense, updateExpense } = useExpenses();

  const getTodayISO = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  const [amount, setAmount] = useState<string>(
    existingExpense ? existingExpense.amount.toString() : ''
  );
  const [category, setCategory] = useState<Category | string>(
    existingExpense ? existingExpense.category : 'Food'
  );
  const [date, setDate] = useState<string>(
    existingExpense ? existingExpense.date : getTodayISO()
  );
  const [note, setNote] = useState<string>(
    existingExpense?.note || ''
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    const parsedAmount = parseFloat(amount.trim());

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }

    // Validate date format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date.trim()) || isNaN(new Date(date.trim()).getTime())) {
      Alert.alert(
        'Invalid Date',
        'Please enter a valid date in the format YYYY-MM-DD.'
      );
      return;
    }

    try {
      setIsSubmitting(true);
      if (isEditing && existingExpense) {
        const updatedItem: Expense = {
          id: existingExpense.id,
          amount: Number(parsedAmount.toFixed(2)),
          category,
          date: date.trim(),
          note: note.trim() || undefined,
        };
        await updateExpense(updatedItem);
      } else {
        await addExpense({
          amount: Number(parsedAmount.toFixed(2)),
          category,
          date: date.trim(),
          note: note.trim() || undefined,
        });
      }
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save expense:', error);
      Alert.alert('Error', 'Failed to save expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    setDate(d.toISOString().split('T')[0]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          {/* Amount input */}
          <Text style={styles.sectionLabel}>Amount ($)</Text>
          <View style={styles.amountInputWrapper}>
            <Text style={styles.currencyPrefix}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor="#64748B"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              autoFocus={!isEditing}
            />
          </View>

          {/* Category Picker */}
          <CategoryPicker
            selectedCategory={category}
            onSelectCategory={(cat) => setCategory(cat)}
          />

          {/* Date input with quick shortcuts */}
          <Text style={styles.sectionLabel}>Date (YYYY-MM-DD)</Text>
          <View style={styles.dateInputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#64748B"
              value={date}
              onChangeText={setDate}
            />
            <View style={styles.quickDateRow}>
              <TouchableOpacity
                onPress={() => handleQuickDate(0)}
                style={[
                  styles.quickDateBtn,
                  date === getTodayISO() && styles.quickDateBtnActive,
                ]}>
                <Text
                  style={[
                    styles.quickDateText,
                    date === getTodayISO() && styles.quickDateTextActive,
                  ]}>
                  Today
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleQuickDate(1)}
                style={styles.quickDateBtn}>
                <Text style={styles.quickDateText}>Yesterday</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Note / Description */}
          <Text style={styles.sectionLabel}>Note (Optional)</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="e.g., Lunch with team, Groceries at Walmart..."
            placeholderTextColor="#64748B"
            multiline
            numberOfLines={3}
            value={note}
            onChangeText={setNote}
          />

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.8}
            style={[styles.submitButton, isSubmitting && styles.disabledButton]}>
            <Text style={styles.submitButtonText}>
              {isSubmitting
                ? 'Saving...'
                : isEditing
                ? 'Update Expense'
                : 'Add Expense'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  formContainer: {
    gap: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  currencyPrefix: {
    fontSize: 28,
    fontWeight: '700',
    color: '#38BDF8',
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  dateInputWrapper: {
    gap: 8,
  },
  textInput: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#F8FAFC',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  quickDateRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickDateBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  quickDateBtnActive: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  quickDateText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  quickDateTextActive: {
    color: '#FFFFFF',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#0284C7',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
