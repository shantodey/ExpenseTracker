import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CATEGORIES, Category } from '../types';

export const CATEGORY_COLORS: Record<string, string> = {
  Food: '#FF6B6B',
  Transport: '#4D96FF',
  Bills: '#FFB800',
  Shopping: '#10B981',
  Health: '#8B5CF6',
  Other: '#64748B',
};

export const CATEGORY_ICONS: Record<string, string> = {
  Food: '🍔',
  Transport: '🚗',
  Bills: '📄',
  Shopping: '🛍️',
  Health: '💊',
  Other: '📦',
};

interface CategoryPickerProps {
  selectedCategory: string;
  onSelectCategory: (category: Category) => void;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category</Text>
      <View style={styles.grid}>
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          const color = CATEGORY_COLORS[category] || '#64748B';
          const icon = CATEGORY_ICONS[category] || '🏷️';

          return (
            <TouchableOpacity
              key={category}
              onPress={() => onSelectCategory(category)}
              activeOpacity={0.75}
              style={[
                styles.categoryCard,
                isSelected && {
                  borderColor: color,
                  backgroundColor: `${color}18`,
                  shadowColor: color,
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                  elevation: 3,
                },
              ]}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: isSelected ? color : '#27272A' },
                ]}>
                <Text style={styles.iconText}>{icon}</Text>
              </View>
              <Text
                style={[
                  styles.categoryName,
                  isSelected && { color: color, fontWeight: '700' },
                ]}>
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard: {
    flexBasis: '31%',
    flexGrow: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  iconText: {
    fontSize: 18,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#E2E8F0',
    textAlign: 'center',
  },
});
