import React, { useEffect, useState } from 'react';
import { 
    View, 
    FlatList, 
    StyleSheet, 
    Text, 
    Alert, 
    ActivityIndicator, 
    SafeAreaView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

// Bileşen ve Servisler
import { BookCard } from '../components/BookCard';
import { GLOBAL_STYLES } from '../src/globalStyles';
import { COLORS } from '../src/contants/colors';
import { bookService } from '../src/services/BookService';
import { AppDispatch } from '../store/store';
import { addItemToCartAsync } from '../store/slices/cartSlice';

const CategoryScreen = ({ route }: any) => {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch<AppDispatch>();
    const { categoryName } = route.params;
    const [books, setBooks] = useState<any[]>([]);
    const [lastDoc, setLastDoc] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isMoreLoading, setIsMoreLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        loadInitialData();
    }, [categoryName]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            setHasMore(true);
            const result = await bookService.getBooksPaginated(categoryName, null);
            setBooks(result.books);
            setLastDoc(result.lastVisible);
            if (result.books.length < 10) setHasMore(false);
            
        } catch (error) {
            console.error("İlk yükleme hatası:", error);
            Alert.alert("Hata", "Kitaplar yüklenirken bir sorun oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const loadMoreData = async () => {
        if (isMoreLoading || !hasMore || !lastDoc) return;

        try {
            setIsMoreLoading(true);
            const result = await bookService.getBooksPaginated(categoryName, lastDoc);

            if (result.books.length === 0) {
                setHasMore(false);
            } else {
                setBooks(prev => [...prev, ...result.books]);
                setLastDoc(result.lastVisible);
                
                if (result.books.length < 10) setHasMore(false);
            }
        } catch (error) {
            console.error("Daha fazla yükleme hatası:", error);
        } finally {
            setIsMoreLoading(false);
        }
    };

    const handleAddToCart = (id: string) => {
        dispatch(addItemToCartAsync(id))
            .unwrap()
            .then(() => Alert.alert("Başarılı", "Kitap sepete eklendi."))
            .catch(() => Alert.alert("Hata", "Eklenemedi."));
    };


    const renderFooter = () => (
        isMoreLoading ? (
            <View style={styles.loaderFooter}>
                <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
        ) : <View style={{ height: 30 }} />
    );

    if (loading) {
        return (
            <View style={[GLOBAL_STYLES.container, styles.centered]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>{categoryName} hazırlanıyor...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={[GLOBAL_STYLES.container, { backgroundColor: '#F8F9FA' }]}>
            <View style={styles.header}>
                <Text style={styles.title}>{categoryName}</Text>
                <Text style={styles.subtitle}>En sevilen {categoryName.toLowerCase()} kitaplarını keşfet</Text>
            </View>

            <FlatList
                data={books}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.cardWrapper}>
                        <BookCard 
                            item={item} 
                            onPress={() => navigation.navigate('BookDetail', { book: item })}
                            onAddToCart={() => handleAddToCart(item.id)}
                        />
                    </View>
                )}
                onEndReached={loadMoreData}
                onEndReachedThreshold={0.5} 
                ListFooterComponent={renderFooter}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="book-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>Bu kategoride henüz kitap bulunamadı.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    listContainer: { paddingHorizontal: 10, paddingBottom: 20 },
    cardWrapper: { flex: 0.5, padding: 5, alignItems: 'center' },
    centered: { justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 15, color: COLORS.primary, fontWeight: '500' },
    header: { padding: 20, backgroundColor: '#fff', marginBottom: 5 },
    title: { fontSize: 26, fontWeight: 'bold', color: '#2D3436' },
    subtitle: { fontSize: 13, color: '#888', marginTop: 4 },
    loaderFooter: { marginVertical: 20, alignItems: 'center' },
    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyText: { marginTop: 15, color: '#999', fontSize: 16 }
});

export default CategoryScreen;