
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { StatusBar } from 'expo-status-bar';

import { TabNavigator } from './navigation/TabNavigator';
import { BookDetailScreen } from './screens/BookDetailScreen';
import { authService } from './src/services/authService';
import { setUser } from './store/authSlice';
import { RootState } from './store/store';
import { COLORS } from './src/contants/colors';

const Stack = createNativeStackNavigator();

export default function RootContent() {
  const dispatch = useDispatch();
  const { user, isInitiliazed } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const unsubscribe = authService.subscribe(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await authService.getUserData(firebaseUser.uid);
          dispatch(setUser(userData || { uid: firebaseUser.uid, email: firebaseUser.email }));
        } catch (error) {
          console.error("User data fetch error:", error);
          dispatch(setUser(null));
        }
      } else {
        dispatch(setUser(null));
      }
    });

    return unsubscribe;
  }, [dispatch]);

  if (!isInitiliazed) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator>
        <Stack.Screen 
          name="Main" 
          component={TabNavigator} 
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='BookDetail'
          component={BookDetailScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});