// src/screens/CategoryScreen.tsx
import React from 'react';
import { View, FlatList, StyleSheet, Text, Alert } from 'react-native';
import { BOOKS } from '../src/contants/books';
import { BookCard } from '../components/BookCard';
import { GLOBAL_STYLES } from '../src/globalStyles';
import { useNavigation } from '@react-navigation/native';

const CategoryScreen = ({ route }: any) => {
  const navigation = useNavigation<any>();
  const { categoryName } = route.params;

  const filteredBooks = BOOKS.filter(book => book.category === categoryName);

  const handleAddToCart = (title: string) => {
    Alert.alert("Sepet", `${title} sepete eklendi.`);
  };

  const handleNavigateDetail = (book: any) => {
    navigation.navigate('BookDetail', { book });
  };

  return (
    <View style={[GLOBAL_STYLES.container, { backgroundColor: '#f5f5f5' }]}>
      <FlatList
        data={filteredBooks}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <BookCard 
              item={item} 
              onPress={() => handleNavigateDetail(item)}
              onAddToCart={() => handleAddToCart(item.title)}
            />
          </View>
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Bu kategoride henüz kitap bulunamadı.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 15,
    paddingBottom: 20,
  },
  cardWrapper: {
    flex: 1,
    padding: 5, 
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  }
});

export default CategoryScreen;