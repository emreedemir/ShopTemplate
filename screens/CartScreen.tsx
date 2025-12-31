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
    SafeAreaView,
    ActivityIndicator
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../src/contants/colors";
import { addItemToCartAsync, removeItemFromCartAsync, clearCart } from "../store/slices/cartSlice"; 
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
    const [isProcessing, setIsProcessing] = useState(false);

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
            setIsSheetVisible(false);
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
            setIsProcessing(true);
        
            await authService.processPurchase(user.uid, items, totalAmount);
        
            dispatch(clearCart());
            const updatedUserData = await authService.getUserData(user.uid);
            dispatch(setUser(updatedUserData));

            Alert.alert(
                "Başarılı!", 
                "Siparişiniz alındı. Keyifli okumalar!",
                [{ text: "Tamam", onPress: () => navigation.navigate("HomeTab",{screen:"Home"}) }]
            );
        } catch (error) {
            Alert.alert("Hata", "Ödeme işlemi sırasında bir hata oluştu.");
        } finally {
            setIsProcessing(false);
        }
    };

    const renderCartItem = ({ item }: any) => (
        <View style={styles.cartCard}>
            <Image source={{ uri: item.image }} style={styles.cartImage} />
            <View style={styles.cartInfo}>
                <Text style={styles.cartTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.cartPrice}>{Number(item.price).toFixed(2)} TL</Text>
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

            <View style={[styles.footerSection, !user && { flex: 0.6 }]}>
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
                                <Text style={styles.infoNoteText}>Ürünler adresinize en geç 3 iş günü içinde kargolanacaktır.</Text>
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
                    style={[styles.checkoutButton, (!user || items.length === 0) && { backgroundColor: '#bdc3c7' }]} 
                    onPress={handleCheckout}
                    disabled={isProcessing}
                >
                    {isProcessing ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.checkoutButtonText}>
                            {user ? "Satın Almayı Tamamla" : "Tamamlamak İçin Giriş Yapın"}
                        </Text>
                    )}
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
        flex: 1.8, 
        backgroundColor: '#fff', 
        borderTopLeftRadius: 35, 
        borderTopRightRadius: 35, 
        padding: 25, 
        elevation: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 10
    },
    sectionHeader: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#1a1a1a' },
    cartCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 15, padding: 12, marginBottom: 12, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05 },
    cartImage: { width: 50, height: 75, borderRadius: 6 },
    cartInfo: { flex: 1, marginLeft: 15 },
    cartTitle: { fontWeight: 'bold', fontSize: 15, color: '#2d3436' },
    cartPrice: { color: COLORS.primary, fontWeight: '800', marginTop: 4, fontSize: 16 },
    actionContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F2F6', borderRadius: 10, padding: 6 },
    itemCountText: { marginHorizontal: 12, fontWeight: 'bold', fontSize: 16 },
    smallButton: { padding: 5 },
    subTitleText: { fontSize: 16, fontWeight: '700', marginTop: 18, marginBottom: 10, color: '#2c3e50' },
    horizontalScroll: { marginBottom: 10 },
    addressCard: { width: 160, height: 85, backgroundColor: '#F8F9FA', borderRadius: 15, padding: 12, marginRight: 12, borderWidth: 1, borderColor: '#EEE', justifyContent: 'space-between' },
    cardMini: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 15, padding: 15, marginRight: 12, borderWidth: 1, borderColor: '#EEE', minWidth: 140 },
    selectedBorder: { borderColor: COLORS.primary, borderWidth: 2, backgroundColor: '#F0F7FF' },
    addressCardText: { fontSize: 12, color: '#636e72', lineHeight: 16 },
    cardMiniText: { marginLeft: 10, fontWeight: '600', fontSize: 14, color: '#2d3436' },
    addSmallButton: { width: 50, height: 85, backgroundColor: '#FFF', borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#d1d1d1' },
    infoNoteBox: { flexDirection: 'row', backgroundColor: '#F1F2F6', padding: 12, borderRadius: 12, alignItems: 'center', marginTop: 20 },
    infoNoteText: { fontSize: 11, color: '#7f8c8d', marginLeft: 8, flex: 1 },
    summaryBox: { marginTop: 25, paddingVertical: 15, borderTopWidth: 1, borderColor: '#F1F2F6' },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    totalLabel: { fontSize: 20, fontWeight: 'bold', color: '#2d3436' },
    totalValue: { fontSize: 22, fontWeight: '900', color: '#27ae60' },
    checkoutButton: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10, elevation: 5 },
    checkoutButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
    guestBanner: { alignItems: 'center', paddingVertical: 30 },
    guestText: { textAlign: 'center', color: '#7f8c8d', marginTop: 12, fontSize: 14, paddingHorizontal: 20 },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#b2bec3', fontSize: 16, fontStyle: 'italic' }
});