import { useState } from "react";
import { View ,Text,StyleSheet} from "react-native";

import { AuthenticationScreen } from "./AuthenticationScreen";
import { UserProfileScreen } from "./UserProfileScreen";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export default function ProfileScreen()
{    
    const isAuthenticated =useSelector((state:RootState)=>state.auth.isAuthenticated);

    return(
        <View style={styles.container}>
            {isAuthenticated?<UserProfileScreen/>:<AuthenticationScreen/>}
        </View>
    );
}

const styles =StyleSheet.create({
    container:
    {   
        flex:1
    }
})