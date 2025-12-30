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


    const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
    const [selectedCardIndex, setSelectedCardIndex] = useState(0);


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
        } catch (error) {
            Alert.alert("Hata", "Bilgiler kaydedilemedi.");
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
                <Text style={styles.cartPrice}>{item.price} TL</Text>
            </View>
            <View style={styles.actionContainer}>
                <TouchableOpacity onPress={() => dispatch(removeItemFromCartAsync(item.id))} style={styles.smallButton}>
                    <Ionicons name={item.quantity > 1 ? "remove" : "trash-outline"} size={16} color="#FF4757" />
                </TouchableOpacity>
                <Text style={styles.itemCountText}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => dispatch(addItemToCartAsync(item.id))} style={styles.smallButton}>
                    <Ionicons name="add" size={16} color={COLORS.primary} />
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

            <View style={[styles.footerSection, !user && { flex: 0.5 }]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {user ? (
                        <>
                            <Text style={styles.subTitleText}>Teslimat Adresi Seçin</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                                {user.addresses?.map((addr: string, index: number) => (
                                    <TouchableOpacity 
                                        key={index}
                                        style={[styles.addressCard, selectedAddressIndex === index && styles.selectedBorder]}
                                        onPress={() => setSelectedAddressIndex(index)}
                                    >
                                        <Ionicons name={selectedAddressIndex === index ? "radio-button-on" : "radio-button-off"} size={16} color={COLORS.primary} />
                                        <Text style={styles.addressCardText} numberOfLines={2}>{addr}</Text>
                                    </TouchableOpacity>
                                ))}
                                <TouchableOpacity style={styles.addSmallButton} onPress={() => { setSheetType('address'); setIsSheetVisible(true); }}>
                                    <Ionicons name="add" size={20} color={COLORS.primary} />
                                </TouchableOpacity>
                            </ScrollView>
                            <Text style={styles.subTitleText}>Ödeme Kartı Seçin</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                                {user.cards?.map((card: string, index: number) => (
                                    <TouchableOpacity 
                                        key={index}
                                        style={[styles.cardMini, selectedCardIndex === index && styles.selectedBorder]}
                                        onPress={() => setSelectedCardIndex(index)}
                                    >
                                        <Ionicons name="card" size={18} color={selectedCardIndex === index ? COLORS.primary : "#ccc"} />
                                        <Text style={styles.cardMiniText}>{card}</Text>
                                    </TouchableOpacity>
                                ))}
                                <TouchableOpacity style={styles.addSmallButton} onPress={() => { setSheetType('card'); setIsSheetVisible(true); }}>
                                    <Ionicons name="add" size={20} color={COLORS.primary} />
                                </TouchableOpacity>
                            </ScrollView>
                            <View style={styles.infoNoteBox}>
                                <Ionicons name="information-circle-outline" size={16} color="#888" />
                                <Text style={styles.infoNoteText}>Kitap alışverişlerinde taksit yapılamamaktadır. Tek çekim uygulanır.</Text>
                            </View>
                        </>
                    ) : (
                        <View style={styles.guestBanner}>
                            <Ionicons name="lock-closed-outline" size={40} color="#ccc" />
                            <Text style={styles.guestText}>Ödeme adımına geçmek için giriş yapmalısınız.</Text>
                        </View>
                    )}

                    <View style={styles.summaryBox}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.totalLabel}>Toplam</Text>
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
    listSection: { flex: 1, padding: 15 },
    footerSection: { 
        flex: 1.6, 
        backgroundColor: '#fff', 
        borderTopLeftRadius: 30, 
        borderTopRightRadius: 30, 
        padding: 20, 
        elevation: 20 
    },
    sectionHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    cartCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 10, marginBottom: 10, alignItems: 'center', elevation: 2 },
    cartImage: { width: 40, height: 60, borderRadius: 4 },
    cartInfo: { flex: 1, marginLeft: 12 },
    cartTitle: { fontWeight: 'bold', fontSize: 14 },
    cartPrice: { color: COLORS.primary, fontWeight: 'bold', marginTop: 2 },
    actionContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 8, padding: 4 },
    itemCountText: { marginHorizontal: 8, fontWeight: 'bold' },
    smallButton: { padding: 4 },
    subTitleText: { fontSize: 15, fontWeight: '700', marginTop: 15, marginBottom: 8, color: '#333' },
    horizontalScroll: { marginBottom: 5 },
    addressCard: { width: 140, height: 75, backgroundColor: '#F8F9FA', borderRadius: 12, padding: 10, marginRight: 10, borderWidth: 1, borderColor: '#EEE', justifyContent: 'space-between' },
    cardMini: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 12, padding: 12, marginRight: 10, borderWidth: 1, borderColor: '#EEE', minWidth: 120 },
    selectedBorder: { borderColor: COLORS.primary, borderWidth: 1.5, backgroundColor: '#F0F7FF' },
    addressCardText: { fontSize: 11, color: '#666' },
    cardMiniText: { marginLeft: 8, fontWeight: '600', fontSize: 13 },
    addSmallButton: { width: 45, height: 75, backgroundColor: '#FFF', borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc' },
    infoNoteBox: { flexDirection: 'row', backgroundColor: '#F1F2F6', padding: 10, borderRadius: 10, alignItems: 'center', marginTop: 15 },
    infoNoteText: { fontSize: 10, color: '#777', marginLeft: 6, flex: 1 },
    summaryBox: { marginTop: 20, padding: 15, borderTopWidth: 1, borderColor: '#EEE' },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    totalLabel: { fontSize: 18, fontWeight: 'bold' },
    totalValue: { fontSize: 18, fontWeight: 'bold', color: '#27ae60' },
    checkoutButton: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    checkoutButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    guestBanner: { alignItems: 'center', padding: 20 },
    guestText: { textAlign: 'center', color: '#888', marginTop: 10, fontSize: 13 },
    emptyText: { textAlign: 'center', marginTop: 40, color: '#999' }
});