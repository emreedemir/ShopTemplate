import React, { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    Alert, 
    ActivityIndicator, 
    FlatList 
} from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { AppDispatch } from "../store/store";
import { addItemToCartAsync } from "../store/slices/cartSlice";
import { bookService } from "../src/services/BookService";
import { BookCard } from "../components/BookCard";
import { COLORS } from "../src/contants/colors";

export const HomeScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<any>();

    const [books, setBooks] = useState<any[]>([]);
    const [lastDoc, setLastDoc] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isMoreLoading, setIsMoreLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const result = await bookService.getBooksPaginated(null, null);
            setBooks(result.books);
            setLastDoc(result.lastVisible);
        } catch (error) {
            Alert.alert("Hata", "Veriler yüklenemedi.");
        } finally {
            setLoading(false);
        }
    };

    const loadMoreBooks = async () => {
        if (isMoreLoading || !hasMore || !lastDoc) return;

        setIsMoreLoading(true);
        try {
            const result = await bookService.getBooksPaginated(null, lastDoc);
            
            if (result.books.length === 0) {
                setHasMore(false);
            } else {
                setBooks(prev => [...prev, ...result.books]);
                setLastDoc(result.lastVisible);
            }
        } catch (error) {
            console.error("Yükleme hatası:", error);
        } finally {
            setIsMoreLoading(false);
        }
    };

    const handleAddToCart = (id: string) => {
        dispatch(addItemToCartAsync(id))
            .unwrap()
            .then(() => Alert.alert("Başarılı", "Sepete eklendi"))
            .catch(() => Alert.alert("Hata", "Eklenemedi"));
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <Text style={styles.mainTitle}>Keşfet</Text>
            <Text style={styles.subTitle}>Senin için seçtiğimiz en yeni kitaplar</Text>
        </View>
    );

    const renderFooter = () => (
        isMoreLoading ? (
            <View style={styles.loaderFooter}>
                <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
        ) : <View style={{ height: 20 }} />
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={books}
                numColumns={2}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.cardWrapper}>
                        <BookCard
                            item={item}
                            onPress={() => navigation.navigate('BookDetail', { book: item })}
                            onAddToCart={() => handleAddToCart(item.id)}
                        />
                    </View>
                )}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                onEndReached={loadMoreBooks}
                onEndReachedThreshold={0.5}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listPadding}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    headerContainer: { padding: 20 },
    mainTitle: { fontSize: 28, fontWeight: 'bold', color: '#333' },
    subTitle: { fontSize: 14, color: '#888', marginTop: 4 },
    listPadding: { paddingBottom: 20 },
    cardWrapper: { flex: 0.5, alignItems: 'center', padding: 5 },
    loaderFooter: { marginVertical: 20, alignItems: 'center' }
});