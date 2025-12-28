import { View,StyleSheet, TouchableOpacity,Text,TextInput} from "react-native";
import { authenticationStyles } from "../src/styles/authenticationStyles";

import { useState } from "react";

export const SignUp =({onSwitch}:{onSwitch:()=>void})=>
{
    const[form,setForm]=useState({name:'',email:'',password:''});
    
    return(
            <View style={authenticationStyles.container}>
                <Text style={authenticationStyles.title}>Yeni Hesap Oluştur</Text>
                <TextInput
                    style ={authenticationStyles.input}
                    placeholder="Email"
                    onChangeText ={(val:string)=>setForm({...form,name:val})}
                />
                <TextInput
                    style ={authenticationStyles.input}
                    placeholder="Şifre"
                    secureTextEntry
                    onChangeText ={(val:string)=>setForm({...form,name:val})}
                />
                <TouchableOpacity style={authenticationStyles.button}>
                    <Text style={authenticationStyles.buttonText}></Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onSwitch}>
                    <Text style={authenticationStyles.linkText}>Zaten Hesabın Varmı? Giriş Yap</Text>
                </TouchableOpacity>
            </View>
        );    
}
