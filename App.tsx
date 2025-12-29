// App.tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './navigation/TabNavigator';
import { STRINGS } from './src/contants/strings';
import {COLORS} from './src/contants/colors';
import { Provider } from 'react-redux';
import { store } from './store/store';
 
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator>
        <Stack.Screen 
          name="Main" 
          component={TabNavigator} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
}