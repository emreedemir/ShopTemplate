import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ScrollView,
    Image,
    Alert,
    SafeAreaView
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../src/contants/colors";
import { addItemToCartAsync, removeItemFromCartAsync } from "../store/slices/cartSlice";
import { useNavigation } from '@react-navigation/native';
import { authService } from '../src/services/authService';
import { setUser } from '../store/authSlice';
import { AddInfoBottomSheet } from '../components/AddInfoBottomSheet';

export default function CartScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<any>();

    const { items, totalAmount } = useSelector((state: RootState) => state.cart);
    const { user } = useSelector((state: RootState) => state.auth);
    const [isSheetVisible, setIsSheetVisible] = useState(false);
    const [sheetType, setSheetType] = useState<'address' | 'card'>('address');
    const handleSaveInfo = async (value: string) => {
        if (!user) return;
        try {
            if (sheetType === 'address') {
                await authService.addAddress(user.uid, value);
            } else {
                await authService.addCard(user.uid, value);
            }
            const updatedData = await authService.getUserData(user.uid);
            dispatch(setUser(updatedData));
            Alert.alert("Başarılı", "Bilgileriniz başarıyla güncellendi.");
        } catch (error) {
            Alert.alert("Hata", "Bilgiler kaydedilirken bir sorun oluştu.");
        }
    };

    const handleCheckout = async () => {
        if (!user) {
            navigation.navigate("Profile");
            return;
        }

        if (items.length === 0) {
            Alert.alert("Uyarı", "Sepetiniz boş.");
            return;
        }

        if (!user.addresses?.length || !user.cards?.length) {
            Alert.alert("Eksik Bilgi", "Lütfen teslimat adresi ve ödeme yöntemi ekleyin.");
            return;
        }

        try {
            await authService.processPurchase(user.uid, items, totalAmount);
            Alert.alert("Başarılı!", "Siparişiniz alındı. Keyifli okumalar!");
        } catch (error) {
            Alert.alert("Hata", "Ödeme işlemi sırasında bir hata oluştu.");
        }
    };

    const renderCartItem = ({ item }: any) => (
        <View style={styles.cartCard}>
            <Image source={{ uri: item.image }} style={styles.cartImage} />
            <View style={styles.cartInfo}>
                <Text style={styles.cartTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.cartAuthor}>{item.author}</Text>
                <Text style={styles.cartPrice}>{item.price} TL</Text>
            </View>

            <View style={styles.actionContainer}>
                <TouchableOpacity onPress={() => dispatch(removeItemFromCartAsync(item.id))} style={styles.smallButton}>
                    <Ionicons name={item.quantity > 1 ? "remove" : "trash-outline"} size={18} color="#FF4757" />
                </TouchableOpacity>
                <Text style={styles.itemCountText}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => dispatch(addItemToCartAsync(item.id))} style={styles.smallButton}>
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

            <View style={[styles.footerSection, !user && { flex: 0.6 }]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {user ? (
                        <>
                            <View style={styles.rowBetween}>
                                <Text style={styles.subTitleText}>Teslimat Bilgileri</Text>
                                <TouchableOpacity onPress={() => { setSheetType('address'); setIsSheetVisible(true); }}>
                                    <Text style={styles.addLinkText}>+ Yeni Ekle</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.infoBox} onPress={() => { setSheetType('address'); setIsSheetVisible(true); }}>
                                <Ionicons name="location-outline" size={20} color={COLORS.primary} />
                                <Text style={styles.infoBoxText} numberOfLines={1}>
                                    {user.addresses && user.addresses.length > 0 ? user.addresses[user.addresses.length - 1] : "Adres bulunamadı, eklemek için dokunun"}
                                </Text>
                                <Ionicons name="chevron-forward" size={16} color="#ccc" />
                            </TouchableOpacity>

                            <View style={styles.rowBetween}>
                                <Text style={styles.subTitleText}>Ödeme Yöntemi</Text>
                                <TouchableOpacity onPress={() => { setSheetType('card'); setIsSheetVisible(true); }}>
                                    <Text style={styles.addLinkText}>+ Yeni Ekle</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.infoBox} onPress={() => { setSheetType('card'); setIsSheetVisible(true); }}>
                                <Ionicons name="card-outline" size={20} color={COLORS.primary} />
                                <Text style={styles.infoBoxText}>
                                    {user.cards && user.cards.length > 0 ? user.cards[user.cards.length - 1] : "Kart bulunamadı, eklemek için dokunun"}
                                </Text>
                                <Ionicons name="chevron-forward" size={16} color="#ccc" />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <View style={styles.guestBanner}>
                            <Ionicons name="lock-closed-outline" size={40} color="#ccc" />
                            <Text style={styles.guestText}>Ödeme adımına geçmek ve bilgilerinizi kaydetmek için giriş yapmalısınız.</Text>
                        </View>
                    )}

                    <View style={styles.summaryBox}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Toplam Tutar</Text>
                            <Text style={styles.totalValue}>{totalAmount.toFixed(2)} TL</Text>
                        </View>
                    </View>
                </ScrollView>

                <TouchableOpacity 
                    style={[styles.checkoutButton, !user && { backgroundColor: '#576574' }]} 
                    onPress={handleCheckout}
                >
                    <Text style={styles.checkoutButtonText}>
                        {user ? "Satın Almayı Tamamla" : "Tamamlamak İçin Giriş Yapın"}
                    </Text>
                </TouchableOpacity>
            </View>

            <AddInfoBottomSheet 
                visible={isSheetVisible}
                type={sheetType}
                onClose={() => setIsSheetVisible(false)}
                onSave={handleSaveInfo}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F2F5' },
    listSection: { flex: 1, padding: 20 },
    footerSection: { 
        flex: 1.4, 
        backgroundColor: '#fff', 
        borderTopLeftRadius: 30, 
        borderTopRightRadius: 30, 
        padding: 25, 
        elevation: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10
    },
    sectionHeader: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#333' },
    cartCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 15, padding: 12, marginBottom: 12, alignItems: 'center', elevation: 2 },
    cartImage: { width: 50, height: 75, borderRadius: 5 },
    cartInfo: { flex: 1, marginLeft: 15 },
    cartTitle: { fontWeight: 'bold', fontSize: 15 },
    cartAuthor: { color: '#888', fontSize: 12 },
    cartPrice: { color: COLORS.primary, fontWeight: 'bold', marginTop: 4 },
    actionContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 10, padding: 5 },
    itemCountText: { marginHorizontal: 10, fontWeight: 'bold' },
    smallButton: { padding: 5 },
    subTitleText: { fontSize: 16, fontWeight: '700', marginTop: 10, color: '#333' },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    addLinkText: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold' },
    infoBox: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#F8F9FA', borderRadius: 12, marginTop: 10 },
    infoBoxText: { flex: 1, marginLeft: 10, fontSize: 14, color: '#444' },
    summaryBox: { marginTop: 20, padding: 15, backgroundColor: '#F8F9FA', borderRadius: 15 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    summaryLabel: { color: '#666', fontWeight: '600' },
    totalValue: { fontSize: 20, fontWeight: 'bold', color: '#27ae60' },
    checkoutButton: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 15 },
    checkoutButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    guestBanner: { alignItems: 'center', padding: 20 },
    guestText: { textAlign: 'center', color: '#888', marginTop: 10 },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#999' }
});