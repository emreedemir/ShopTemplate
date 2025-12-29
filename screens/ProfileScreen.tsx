import { useState } from "react";
import { View ,Text,StyleSheet,ActivityIndicator} from "react-native";
import { AuthenticationScreen } from "./AuthenticationScreen";
import { UserProfileScreen } from "./UserProfileScreen";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

import { COLORS } from "../src/contants/colors";

export default function ProfileScreen()
{    
    const {user,isInitiliazed} =useSelector((state:RootState)=>state.auth);

    if(!isInitiliazed)
        return(
            <View style={[styles.container,styles.center]}>
                <ActivityIndicator size="large" color={COLORS.primary}/>
            </View>
        );

    return(
        <View style={styles.container}>
            {user?<UserProfileScreen/>:<AuthenticationScreen/>}
        </View>
    );
}

const styles =StyleSheet.create({
    container:
    {   
        flex:1,
        backgroundColor:'#fff'
    },
    center:
    {
        justifyContent:'center',
        alignItems:'center'
    }
})