import React from "react";

import { View,Text,StyleSheet, Alert } from "react-native";
import { GLOBAL_STYLES } from "../src/globalStyles";
import { STRINGS } from "../src/contants/strings";
import { COLORS } from "../src/contants/colors";
import { BOOKS } from "../src/contants/books";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { BookCard } from "../components/BookCard";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { addItemToCartAsync } from "../store/slices/cartSlice";

export const HomeScreen =()=>
{
    const dispatch =useDispatch<AppDispatch>();
    const navigation =useNavigation<any>();
    const newlyReleased =BOOKS.slice(0,20);
    const recomended =BOOKS.slice(10,20);

    const handleNavigationToDetail =(book:any)=>{
        navigation.navigate('BookDetail',{book});
    }
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
    const renderSection =(title:string,data:any[])=>(
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <FlatList
                data={data}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item)=>item.id} 
                renderItem={({item})=><BookCard
                 item={item}
                 onPress={()=>handleNavigationToDetail(item)}
                 onAddToCart={()=>handleAddToCart(item.id)}
                 />}
                contentContainerStyle={styles.listPadding}           
            />
        </View>
    );

    return(
        <ScrollView>
            {renderSection("Yeni Çıkanlar",newlyReleased)}
            {renderSection("Senin İçin Öneriler",recomended)}
        </ScrollView>
    );
};

const styles =StyleSheet.create({
    sectionContainer:
    {
        marginVertical:15
    },
    sectionTitle:
    {
        fontSize:20,
        fontWeight:'bold',
        marginLeft:15,
        marginBottom:10,
        color:'#333'
    },
    listPadding:
    {
        paddingLeft:15,
        paddingRight:10
    }
});