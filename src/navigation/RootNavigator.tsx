import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { AddExpenseScreen } from '../screens/AddExpenseScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0F172A',
        },
        headerTintColor: '#38BDF8',
        headerTitleStyle: {
          fontWeight: '700',
          color: '#F8FAFC',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: '#0F172A',
        },
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={({ route }) => ({
          title: route.params?.expense ? 'Edit Expense' : 'Add Expense',
          presentation: 'card',
        })}
      />
      <Stack.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          title: 'Spending Analytics',
        }}
      />
    </Stack.Navigator>
  );
};
