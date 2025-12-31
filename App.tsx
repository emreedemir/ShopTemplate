// App.tsx
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './navigation/TabNavigator';
import { STRINGS } from './src/contants/strings';
import {COLORS} from './src/contants/colors';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { RootState, store } from './store/store';
import { BookDetailScreen } from './screens/BookDetailScreen';
import { authService } from './src/services/authService';
import { setUser } from './store/authSlice';
import RootContent from './RootContent';

 const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <Provider store={store}>
      <RootContent/>
    </Provider>
  );
}