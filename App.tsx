import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { ExpenseProvider } from './src/context/ExpenseContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { StyleSheet, View } from 'react-native';

const customTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#38BDF8',
    background: '#0F172A',
    card: '#0F172A',
    text: '#F8FAFC',
    border: '#334155',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <ExpenseProvider>
            <NavigationContainer theme={customTheme}>
              <RootNavigator />
            </NavigationContainer>
          </ExpenseProvider>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  safeArea: {
    flex: 1,
  },
});
