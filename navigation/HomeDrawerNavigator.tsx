import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CategoryScreen from '../screens/CategoryScreen';
import { COLORS } from '../src/contants/colors';
import { HomeScreen } from '../screens/HomeScreen';
import { CustomDrawerContent } from './CustomDrawerNavigation';

const Drawer = createDrawerNavigator();

export const HomeDrawerNavigator = () => {
  return (
    <Drawer.Navigator
        drawerContent={(props)=><CustomDrawerContent {...props}/>}
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: '#fff',
        drawerActiveTintColor: COLORS.primary,
      }}
    >
        <Drawer.Screen
            name='MainHome'
            component={HomeScreen}
            options={{title:'Ana Sayfa'}}
        />

      <Drawer.Screen 
        name="CategoryScreen" 
        component={CategoryScreen}
        options={({route}:any)=>({
            title:route.params?.categoryName||'Kategori',
            drawerItemStyle :{display:'none'}
        })}
      />
    </Drawer.Navigator>
  );
};