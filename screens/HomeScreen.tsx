import React from "react";

import { View,Text,StyleSheet } from "react-native";
import { GLOBAL_STYLES } from "../src/globalStyles";
import { STRINGS } from "../src/contants/strings";
import { COLORS } from "../src/contants/colors";

export const HomeScreen =()=>
{
    return(
        <View style={GLOBAL_STYLES.container}>
            <Text style={GLOBAL_STYLES.headerTitle}>{STRINGS.homeScreen.welcome}</Text>
            <Text style={styles.subText}>{STRINGS.homeScreen.subtitle}</Text>
        </View>
    );
};

const styles =StyleSheet.create({
    subText:{
        color:COLORS.textSecondary,
        fontSize:16,
        textAlign:'center',
        marginTop:8
    }
});