import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../src/contants/colors";
import { addItemToCartAsync, removeItemFromCartAsync } from "../store/slices/cartSlice";

interface CartItem {
    id: string;
    title: string;
    author: string;
    price: number;
    image: string;
    quantity: number;
}

export default function CartScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const { items, totalAmount } = useSelector((state: RootState) => state.cart);

    const renderCartItem = ({ item }: { item: CartItem }) => (
        <View style={styles.cartCard}>
            <Image source={{ uri: item.image }} style={styles.cartImage} />

            <View style={styles.cartInfo}>
                <Text style={styles.cartTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.cartAuthor}>{item.author}</Text>

                <View style={styles.priceRow}>
                    <Text style={styles.cartPrice}>{item.price} TL</Text>
                    <View style={styles.quantityBadge}>
                        <Text style={styles.quantityText}>x{item.quantity}</Text>
                    </View>
                </View>
            </View>

            {/* MİKTAR KONTROL BUTONLARI */}
            <View style={styles.actionContainer}>
                <TouchableOpacity
                    onPress={() => dispatch(removeItemFromCartAsync(item.id))}
                    style={styles.smallRemoveButton}
                >
                    <Ionicons 
                        name={item.quantity > 1 ? "remove" : "trash-outline"} 
                        size={18} 
                        color="#FF4757" 
                    />
                </TouchableOpacity>

                <Text style={styles.itemCountText}>{item.quantity}</Text>

                <TouchableOpacity
                    onPress={() => dispatch(addItemToCartAsync(item.id))}
                    style={styles.smallAddButton}
                >
                    <Ionicons name="add" size={18} color={COLORS.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.listSection}>
                <Text style={styles.sectionHeader}>Sepetim ({items.length})</Text>
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id}
                    renderItem={renderCartItem}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<Text style={styles.emptyText}>Sepetiniz henüz boş...</Text>}
                />
            </View>
            <View style={styles.footerSection}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.subTitleText}>Teslimat Bilgileri</Text>
                    <TouchableOpacity style={styles.infoBox}>
                        <Ionicons name="location-outline" size={20} color={COLORS.primary} />
                        <Text style={styles.infoBoxText}>Ev Adresim: Kadıköy/İstanbul</Text>
                        <Ionicons name="chevron-forward" size={16} color="#ccc" />
                    </TouchableOpacity>

                    <Text style={styles.subTitleText}>Ödeme Yöntemi</Text>
                    <TouchableOpacity style={styles.infoBox}>
                        <Ionicons name="card-outline" size={20} color={COLORS.primary} />
                        <Text style={styles.infoBoxText}>**** **** **** 4242</Text>
                        <Ionicons name="chevron-forward" size={16} color="#ccc" />
                    </TouchableOpacity>

                    <View style={styles.summaryBox}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Ara Toplam</Text>
                            <Text style={styles.summaryValue}>{totalAmount.toFixed(2)} TL</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Kargo</Text>
                            <Text style={[styles.summaryValue, {color: '#27ae60'}]}>Ücretsiz</Text>
                        </View>
                        <View style={styles.diveder} />
                        <View style={styles.summaryRow}>
                            <Text style={styles.totalLabel}>Toplam</Text>
                            <Text style={styles.totalValue}>{totalAmount.toFixed(2)} TL</Text>
                        </View>
                    </View>
                    <View style={{ height: 20 }} />
                </ScrollView>

                <TouchableOpacity style={styles.checkoutButton}>
                    <Text style={styles.checkoutButtonText}>Satın Almayı Tamamla</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F5'
    },
    listSection: { flex: 1, padding: 20 },
    footerSection: { 
        flex: 1.3, 
        backgroundColor: '#fff', 
        borderTopLeftRadius: 30, 
        borderTopRightRadius: 30, 
        padding: 25, 
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 10
    },
    sectionHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333'
    },
    cartCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5
    },
    cartImage: {
        width: 50,
        height: 75,
        borderRadius: 5
    },
    cartInfo: {
        flex: 1, marginLeft: 15
    },
    cartTitle: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#2c3e50'
    },
    cartAuthor: {
        color: '#888',
        fontSize: 12
    },
    cartPrice: {
        color: COLORS.primary,
        fontWeight: 'bold',
        marginTop: 4
    },
    subTitleText: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 15,
        marginBottom: 10,
        color: '#333'
    },
    infoBox: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 15, 
        backgroundColor: '#F8F9FA', 
        borderRadius: 12, 
        marginBottom: 10 
    },
    infoBoxText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: '#444'
    },
    summaryBox: { 
        marginTop: 10, 
        padding: 15, 
        backgroundColor: '#F8F9FA', 
        borderRadius: 15 
    },
    summaryRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 8 
    },
    summaryLabel: { color: '#666' },
    summaryValue: { fontWeight: '600' },
    diveder: { 
        height: 1, 
        backgroundColor: '#DDD', 
        marginVertical: 10 
    },
    totalLabel: { fontSize: 18, fontWeight: 'bold' },
    totalValue: { fontSize: 18, fontWeight: 'bold', color: '#27ae60' },
    checkoutButton: { 
        backgroundColor: COLORS.primary, 
        padding: 18, 
        borderRadius: 15, 
        alignItems: 'center', 
        marginTop: 10 
    },
    checkoutButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    emptyText: { textAlign: 'center', marginTop: 40, color: '#999' },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    quantityBadge: {
        backgroundColor: '#F0F2F5',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 5,
        marginLeft: 10,
    },
    quantityText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#555',
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 10,
        padding: 5,
    },
    itemCountText: {
        marginHorizontal: 10,
        fontWeight: 'bold',
        fontSize: 14,
    },
    smallRemoveButton: {
        padding: 5,
    },
    smallAddButton: {
        padding: 5,
    }
});