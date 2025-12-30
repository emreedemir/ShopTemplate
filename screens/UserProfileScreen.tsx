import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, SafeAreaView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { COLORS } from "../src/contants/colors";
import { Ionicons } from "@expo/vector-icons";
import { authService } from '../src/services/authService';
import { setUser } from '../store/authSlice';
import { AddInfoBottomSheet } from '../components/AddInfoBottomSheet';

export const UserProfileScreen = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);

    const [isSheetVisible, setIsSheetVisible] = useState(false);
    const [sheetType, setSheetType] = useState<'address' | 'card' | 'name' | 'email' | 'password' | 'password_delete'>('address');
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    const handleSaveInfo = async (value: string) => {
        if (!user) return;
        try {
            if (sheetType === 'password_delete') {
                Alert.alert("DİKKAT: Hesap Silme", "Hesabınız kalıcı olarak silinecektir. Emin misiniz?", [
                    { text: "Vazgeç", style: "cancel" },
                    { text: "Evet, Sil", style: "destructive", onPress: async () => {
                        try {
                            await authService.deleteUserAccount(value);
                            dispatch(setUser(null));
                            Alert.alert("Başarılı", "Hesabınız silindi.");
                        } catch (e) { Alert.alert("Hata", "Şifre doğrulanamadı."); }
                    }}
                ]);
            } else {
                switch (sheetType) {
                    case 'address': await authService.addAddress(user.uid, value); break;
                    case 'card': await authService.addCard(user.uid, value); break;
                    case 'name': await authService.updateUserName(user.uid, value); break;
                    case 'email': await authService.updateEmail(value); break;
                    case 'password': await authService.updatePassword(value); break;
                }
                const updatedData = await authService.getUserData(user.uid);
                dispatch(setUser(updatedData));
                Alert.alert("Başarılı", "İşlem tamamlandı.");
            }
        } catch (error: any) { Alert.alert("Hata", error.message); }
    };

    const handleDeleteItem = async (type: 'address' | 'card', value: string) => {
        Alert.alert("Sil", "Bu bilgiyi silmek istiyor musunuz?", [
            { text: "Vazgeç", style: "cancel" },
            { text: "Sil", style: "destructive", onPress: async () => {
                await authService.removeItem(user.uid, type, value);
                const updatedData = await authService.getUserData(user.uid);
                dispatch(setUser(updatedData));
            }}
        ]);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                
                {/* 1. HEADER */}
                <View style={styles.headerCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                        </Text>
                    </View>
                    <Text style={styles.userName}>{user?.displayName || "Kullanıcı"}</Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                    
                    <View style={styles.headerButtonsRow}>
                        <TouchableOpacity style={styles.smallEditBtn} onPress={() => { setSheetType('name'); setIsSheetVisible(true); }}>
                            <Ionicons name="person-outline" size={14} color="#fff" /><Text style={styles.smallEditBtnText}> İsim</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.smallEditBtn} onPress={() => { setSheetType('email'); setIsSheetVisible(true); }}>
                            <Ionicons name="mail-outline" size={14} color="#fff" /><Text style={styles.smallEditBtnText}> Mail</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.smallEditBtn} onPress={() => { setSheetType('password'); setIsSheetVisible(true); }}>
                            <Ionicons name="lock-closed-outline" size={14} color="#fff" /><Text style={styles.smallEditBtnText}> Şifre</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Siparişlerim</Text>
                    {user?.orders?.length > 0 ? user.orders.map((order: any) => (
                        <TouchableOpacity key={order.id} style={styles.orderCard} onPress={() => setSelectedOrder(order)}>
                            <View><Text style={styles.orderId}>Sipariş #{order.id}</Text><Text style={styles.orderDate}>{order.date}</Text></View>
                            <View style={[styles.statusBadgeBase, { backgroundColor: '#E8F5E9' }]}><Text style={[styles.statusText, { color: '#2E7D32' }]}>{order.status}</Text></View>
                        </TouchableOpacity>
                    )) : <Text style={styles.emptyText}>Henüz siparişiniz yok.</Text>}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Adreslerim</Text>
                    {user?.addresses?.map((addr: string, index: number) => (
                        <View key={index} style={styles.infoRow}><Text style={styles.infoText}>{addr}</Text>
                        <TouchableOpacity onPress={() => handleDeleteItem('address', addr)}><Ionicons name="trash-outline" size={20} color="#FF4757" /></TouchableOpacity></View>
                    ))}
                    <TouchableOpacity style={styles.addButton} onPress={() => { setSheetType('address'); setIsSheetVisible(true); }}>
                        <Ionicons name="add-circle" size={22} color={COLORS.primary} /><Text style={styles.addText}> Yeni Adres Ekle</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ödeme Yöntemlerim</Text>
                    {user?.cards?.map((card: string, index: number) => (
                        <View key={index} style={styles.infoRow}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}><Ionicons name="card-outline" size={20} color={COLORS.primary} /><Text style={[styles.infoText, { marginLeft: 12 }]}>{card}</Text></View>
                            <TouchableOpacity onPress={() => handleDeleteItem('card', card)}><Ionicons name="trash-outline" size={20} color="#FF4757" /></TouchableOpacity></View>
                    ))}
                    <TouchableOpacity style={styles.addButton} onPress={() => { setSheetType('card'); setIsSheetVisible(true); }}>
                        <Ionicons name="add-circle" size={22} color={COLORS.primary} /><Text style={styles.addText}> Yeni Kart Ekle</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <TouchableOpacity style={styles.logoutRow} onPress={() => authService.logout()}>
                        <Text style={styles.logoutText}>Oturumu Kapat</Text><Ionicons name="log-out-outline" size={22} color="#FF4757" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dangerRow} onPress={() => { setSheetType('password_delete'); setIsSheetVisible(true); }}>
                        <Text style={styles.dangerText}>Hesabımı Kalıcı Olarak Sil</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 40 }} />
            </ScrollView>

            <AddInfoBottomSheet visible={isSheetVisible} type={sheetType} onClose={() => setIsSheetVisible(false)} onSave={handleSaveInfo} />

            <Modal visible={!!selectedOrder} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}><View style={styles.modalContent}>
                    <View style={styles.modalHeader}><Text style={styles.modalTitle}>Sipariş Detayı</Text><TouchableOpacity onPress={() => setSelectedOrder(null)}><Ionicons name="close-circle" size={32} color="#ccc" /></TouchableOpacity></View>
                    {selectedOrder && <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.detailBox}><Text style={styles.detailLabel}>Sipariş No</Text><Text style={styles.detailValue}>#{selectedOrder.id}</Text></View>
                        <View style={styles.detailBox}><Text style={styles.detailLabel}>Tarih</Text><Text style={styles.detailValue}>{selectedOrder.date}</Text></View>
                        <View style={styles.divider} />
                        <Text style={[styles.detailLabel, {marginBottom: 10}]}>Ürünler</Text>
                        {selectedOrder.items.map((item: any, i: number) => (
                            <View key={i} style={styles.orderItemRow}><Text style={styles.detailValue}>• {item.title}</Text><Text style={styles.itemQty}>{item.quantity} Adet</Text></View>
                        ))}
                        <View style={styles.divider} />
                        <View style={styles.rowBetween}><Text style={styles.detailLabel}>Toplam</Text><Text style={styles.totalValue}>{Number(selectedOrder.total).toFixed(2)} TL</Text></View>
                    </ScrollView>}
                </View></View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F4F7FA' },
    container: { flex: 1 },
    headerCard: { backgroundColor: COLORS.primary, paddingTop: 20, paddingBottom: 40, alignItems: 'center', borderBottomLeftRadius: 40, borderBottomRightRadius: 40, elevation: 10 },
    avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    avatarText: { fontSize: 36, fontWeight: 'bold', color: COLORS.primary },
    userName: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
    userEmail: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 2 },
    headerButtonsRow: { flexDirection: 'row', marginTop: 20, gap: 8 },
    smallEditBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
    smallEditBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
    section: { paddingHorizontal: 20, marginTop: 25 },
    sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 15, color: '#2D3436' },
    orderCard: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', padding: 18, borderRadius: 20, marginBottom: 10, elevation: 3 },
    orderId: { fontWeight: 'bold', color: '#2D3436', fontSize: 15 },
    orderDate: { fontSize: 12, color: '#A2A2A2', marginTop: 4 },
    statusBadgeBase: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
    statusText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 18, borderRadius: 18, marginBottom: 10, borderWidth: 1, borderColor: '#E1E8EE' },
    infoText: { flex: 1, fontSize: 14, color: '#4A4A4A' },
    addButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
    addText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 14 },
    logoutRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: '#EEE' },
    logoutText: { color: '#FF4757', fontWeight: 'bold', fontSize: 16 },
    dangerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 15 },
    dangerText: { color: '#FF4757', fontSize: 13, textDecorationLine: 'underline' },
    emptyText: { color: '#B2BEC3', fontStyle: 'italic', textAlign: 'center' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, maxHeight: '85%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 22, fontWeight: 'bold' },
    detailBox: { marginBottom: 12 },
    detailLabel: { fontSize: 13, color: '#888', fontWeight: '600', marginBottom: 2 },
    detailValue: { fontSize: 15, color: '#333', fontWeight: '500' },
    divider: { height: 1, backgroundColor: '#EEE', marginVertical: 15 },
    orderItemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    itemQty: { color: '#888', fontSize: 13 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    totalValue: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary }
});