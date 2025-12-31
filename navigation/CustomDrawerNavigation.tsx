import React from 'react';
import { 
    DrawerContentScrollView, 
    DrawerItemList, 
    DrawerItem 
} from '@react-navigation/drawer';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/contants/colors';

const STATIC_CATEGORIES = [
    { name: "Tarih", icon: "library-outline" },
    { name: "Macera", icon: "compass-outline" },
    { name: "Bilim Kurgu", icon: "rocket-outline" },
    { name: "Klasik", icon: "book-outline" },
    { name: "Gelişim", icon: "trending-up-outline" }
];

export const CustomDrawerContent = (props: any) => {
    return (
        <DrawerContentScrollView {...props} showsVerticalScrollIndicator={false}>
            <View style={styles.drawerHeader}>
                <View style={styles.logoContainer}>
                    <Ionicons name="book" size={30} color="#fff" />
                </View>
                <Text style={styles.appName}>KİTAP DÜNYASI</Text>
            </View>
            <View style={styles.mainItems}>
                <DrawerItemList {...props} />
            </View>
            <View style={styles.dividerTitleContainer}>
                <Text style={styles.dividerTitle}>KATEGORİLER</Text>
            </View>
            {STATIC_CATEGORIES.map((category, index) => (
                <DrawerItem
                    key={index}
                    label={category.name}
                    labelStyle={styles.categoryLabel}
                    icon={({ color, size }) => (
                        <Ionicons name={category.icon as any} size={20} color={COLORS.primary} />
                    )}
                    onPress={() => {
                        props.navigation.navigate('CategoryScreen', { categoryName: category.name });
                    }}
                    activeTintColor={COLORS.primary}
                    style={styles.drawerItem}
                />
            ))}
            <View style={styles.footer}>
                <Text style={styles.footerText}>Versiyon 1.0.0</Text>
            </View>
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    drawerHeader: {
        height: 150,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: -5,
    },
    logoContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    appName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1
    },
    mainItems: {
        paddingTop: 10
    },
    dividerTitleContainer: {
        paddingHorizontal: 18,
        marginTop: 20,
        marginBottom: 10,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 20
    },
    dividerTitle: {
        fontSize: 11,
        fontWeight: '800',
        color: '#999',
        letterSpacing: 1.5,
        textTransform: 'uppercase'
    },
    categoryLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#444',
        marginLeft: -15 
    },
    drawerItem: {
        borderRadius: 10,
        marginHorizontal: 10,
        marginVertical: 2
    },
    footer: {
        marginTop: 30,
        paddingHorizontal: 20,
        paddingBottom: 20,
        opacity: 0.5
    },
    footerText: {
        fontSize: 10,
        color: '#333',
        textAlign: 'center'
    }
});