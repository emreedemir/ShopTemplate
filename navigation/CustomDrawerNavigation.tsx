// src/navigation/CustomDrawerNavigation.tsx
import React from 'react';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { BOOKS } from '../src/contants/books';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../src/contants/colors';

export const CustomDrawerContent = (props: any) => {
  const uniqueCategories = Array.from(new Set(BOOKS.map(book => book.category)));
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} /> 
      <View style={styles.dividerTitleContainer}>
        <Text style={styles.dividerTitle}>KATEGORİLER</Text>
      </View>

      {uniqueCategories.map((category, index) => (
        <DrawerItem
          key={index}
          label={category}
          activeTintColor={COLORS.primary}
          onPress={() => {
            props.navigation.navigate('CategoryScreen', { categoryName: category });
          }}
        />
      ))}
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  dividerTitleContainer: {
    paddingHorizontal: 18,
    marginTop: 20,
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 20
  },
  dividerTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
    letterSpacing: 1
  }
});