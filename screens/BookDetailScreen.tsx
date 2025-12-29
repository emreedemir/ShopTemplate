import React from 'react';
import { ScrollView, StyleSheet, Image, View, Text, TouchableOpacity, Dimensions } from "react-native";
import { COLORS } from "../src/contants/colors";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { addItemToCartAsync } from '../store/slices/cartSlice';
import { Alert } from 'react-native';
const { width } = Dimensions.get('window');

export const BookDetailScreen = ({ route }: any) => {
    const { book } = route.params;
    const navigation =useNavigation();

    const dispatch =useDispatch<AppDispatch>();

    const handleAddToCart =(id:string)=>{

        dispatch(addItemToCartAsync(id))
        .unwrap()
        .then((res:any)=>{
            Alert.alert("Başarılı Kitap Eklendi")
        })
        .catch(()=>
        {
            Alert.alert("Hata","Ürün sepete eklenmedi");
        });
    };

    return (
        <View style={styles.mainContainer}>
            <TouchableOpacity style={styles.backButton}
            onPress={()=>navigation.goBack()}>
                <Ionicons name="chevron-back" size={28} color="#333"/>
            </TouchableOpacity>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: book.image }} style={styles.detailImage} />
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.headerRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title}>{book.title}</Text>
                            <Text style={styles.author}>{book.author}</Text>
                        </View>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{book.category}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Kitap Açıklaması</Text>
                    <Text style={styles.description}>
                        {book.description}
                    </Text>
                    <View style={{ height: 100 }} />
                </View>
            </ScrollView>
            <View style={styles.bottomBar}>
                <View>
                    <Text style={styles.priceLabel}>Fiyat</Text>
                    <Text style={styles.priceText}>{book.price} TL</Text>
                </View>
                <TouchableOpacity style={styles.buyButton} 
                onPress={()=>handleAddToCart(book.id)}>
                    <Text style={styles.buyButtonText}>Sepete Ekle</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
    },
    imageContainer: {
        backgroundColor: '#F5F5F5',
        width: width,
        height: 450,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    detailImage: {
        width: width * 0.6,
        height: '80%',
        borderRadius: 10,
        resizeMode: 'stretch',
    },
    infoContainer: {
        padding: 25,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: 5,
    },
    author: {
        fontSize: 18,
        color: '#666',
        fontWeight: '500',
    },
    categoryBadge: {
        backgroundColor: COLORS.primary + '15',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    categoryText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#EEE',
        marginVertical: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#555',
        lineHeight: 26,
        textAlign: 'justify',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        paddingBottom: 35,
    },
    priceLabel: {
        fontSize: 14,
        color: '#999',
    },
    priceText: {
        fontSize: 24,
        fontWeight: '900',
        color: '#27ae60',
    },
    buyButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 15,
        elevation: 3,
    },
    buyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButton:
    {
        position:'absolute',
        top:50,
        left:20,
        zIndex:10,
        backgroundColor:COLORS.background,
        padding:8,
        borderRadius:12,
        elevation:5,
        shadowColor:'#000',
        shadowOffset:{width:0,height:2},
        shadowOpacity:0.2,
        shadowRadius:4
    }
});