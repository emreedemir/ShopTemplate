import { StyleSheet } from "react-native";
import { COLORS } from "./contants/colors";


export const GLOBAL_STYLES =StyleSheet.create({

    container:{
        flex:1,
        backgroundColor:COLORS.background,
        paddingHorizontal:16
    },
    shadow:
    {
        shadowColor:'#000',
        shadowOffset:{
            width:0,
            height:2
        },
        shadowOpacity:0.25,
        shadowRadius:3.84,
        elevation:5
    },
    headerTitle:
    {
        fontSize:24,
        fontWeight:'bold',
        color:COLORS.text,
        marginBottom:10
    }
});