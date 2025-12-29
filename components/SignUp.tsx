import { View,StyleSheet, TouchableOpacity,Text,TextInput, Alert} from "react-native";
import { authenticationStyles } from "../src/styles/authenticationStyles";

import { useState } from "react";
import { authService } from "../src/services/authService";

export const SignUp =({onSwitch}:{onSwitch:()=>void})=>
{
    const[form,setForm]=useState({name:'',email:'',password:''});
    
    const [loading,setLoading]=useState(false);

    const handleRegister =async()=>{
        if(!form.email ||!form.password ||!form.name)
            {
                Alert.alert("Hata","Lütfen tüm alanları doldurunuz");
            }
            setLoading(true);

            try
            {
                await authService.register(form.email,form.password,form.name);
                Alert.alert("Succes","Giriş Başarılı");
            }
            catch(error:any)
            {
                Alert.alert("Kayıt Hatası",error.message);
            }
            finally
            {
                setLoading(false);
            }

    };

    return(
            <View style={authenticationStyles.container}>
                <Text style={authenticationStyles.title}>Yeni Hesap Oluştur</Text>
                <TextInput
                    style ={authenticationStyles.input}
                    placeholder="Adınız"
                    onChangeText ={(val:string)=>setForm({...form,name:val})}
                />
                <TextInput
                    style ={authenticationStyles.input}
                    placeholder="Email"
                    onChangeText ={(val:string)=>setForm({...form,email:val})}
                />
                <TextInput
                    style ={authenticationStyles.input}
                    placeholder="Şifre"
                    secureTextEntry
                    onChangeText ={(val:string)=>setForm({...form,password:val})}
                />
                <TouchableOpacity style={authenticationStyles.button}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    <Text style={authenticationStyles.buttonText}></Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onSwitch}>
                    <Text style={authenticationStyles.linkText}>Zaten Hesabın Varmı? Giriş Yap</Text>
                </TouchableOpacity>
            </View>
        );    
}
