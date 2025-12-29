import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { COLORS } from "../src/contants/colors";
import { Ionicons } from "@expo/vector-icons";
import { removeAddress, removeCard } from '../store/slices/profileSlice';

export const UserProfileScreen = () => {
    const dispatch = useDispatch();
    const { user, addresses, cards, orders } = useSelector((state: RootState) => state.profile);

    const renderSectionTitle = (title: string) => (
        <Text style={styles.sectionTitle}>{title}</Text>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

            <View style={styles.headerCard}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                </View>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editButtonText}>Profili Düzenle</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                {renderSectionTitle("Siparişlerim")}
                {orders.map(order => (
                    <View key={order.id} style={styles.orderCard}>
                        <View>
                            <Text style={styles.orderId}>Sipariş #{order.id}</Text>
                            <Text style={styles.orderDate}>{order.date}</Text>
                        </View>
                        <View style={[
    styles.statusBadgeBase, 
    { backgroundColor: order.status === 'Hazırlanıyor' ? '#FFF3CD' : order.status === 'Yolda' ? '#D1ECF1' : '#D4EDDA' }
]}>
    <Text style={styles.statusText}>{order.status}</Text>
</View>
                    </View>
                ))}
            </View>

            {/* 3. ADRESLERİM */}
            <View style={styles.section}>
                {renderSectionTitle("Adreslerim")}
                {addresses.map((addr, index) => (
                    <View key={index} style={styles.infoRow}>
                        <Text style={styles.infoText}>{addr}</Text>
                        <TouchableOpacity onPress={() => dispatch(removeAddress(index))}>
                            <Ionicons name="trash-outline" size={20} color="red" />
                        </TouchableOpacity>
                    </View>
                ))}
                <TouchableOpacity style={styles.addButton}><Text style={styles.addText}>+ Yeni Adres Ekle</Text></TouchableOpacity>
            </View>

            <View style={styles.section}>
                {renderSectionTitle("Ödeme Yöntemlerim")}
                {cards.map((card, index) => (
                    <View key={index} style={styles.infoRow}>
                        <Ionicons name="card-outline" size={20} color={COLORS.primary} />
                        <Text style={[styles.infoText, { marginLeft: 10 }]}>{card}</Text>
                        <TouchableOpacity onPress={() => dispatch(removeCard(index))}>
                            <Ionicons name="trash-outline" size={20} color="red" />
                        </TouchableOpacity>
                    </View>
                ))}
                <TouchableOpacity style={styles.addButton}><Text style={styles.addText}>+ Yeni Kart Ekle</Text></TouchableOpacity>
            </View>

            {/* 5. HESAP AYARLARI */}
            <View style={styles.section}>
                {renderSectionTitle("Hesap Ayarları")}
                <TouchableOpacity style={styles.dangerRow} onPress={() => Alert.alert("Hesabı Sil", "Bu işlem geri alınamaz.")}>
                    <Text style={styles.dangerText}>Hesabı Sil</Text>
                    <Ionicons name="alert-circle-outline" size={20} color="red" />
                </TouchableOpacity>
            </View>

            <View style={{ height: 50 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    headerCard: { backgroundColor: COLORS.primary, padding: 30, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    avatarText: { fontSize: 32, fontWeight: 'bold', color: COLORS.primary },
    userName: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
    userEmail: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
    editButton: { marginTop: 15, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
    editButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    section: { padding: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
    orderCard: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 10, elevation: 2 },
    orderId: { fontWeight: 'bold', color: '#333' },
    orderDate: { fontSize: 12, color: '#888' },
    statusBadgeBase: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    statusText: { 
        fontSize: 12, 
        fontWeight: 'bold', 
        color: '#333' 
    },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 8 },
    infoText: { flex: 1, fontSize: 14, color: '#444' },
    addButton: { paddingVertical: 10 },
    addText: { color: COLORS.primary, fontWeight: 'bold' },
    dangerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#FFEBEB', borderRadius: 12 },
    dangerText: { color: 'red', fontWeight: 'bold' }
});