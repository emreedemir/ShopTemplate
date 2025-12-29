import React, { useState } from "react";
import { Text, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { authenticationStyles } from "../src/styles/authenticationStyles";
import { authService } from "../src/services/authService";

interface SignInProps {
    onSwitch: () => void;
    onForget: () => void;
}

export const SignIn = ({ onSwitch, onForget }: SignInProps) => {
    const [email, setEmail] = useState('');    
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const handleLogin = async() => {
       
        try
        {
            await authService.login(email,password);
            Alert.alert("Giriş","Giriş Yapıldı");
        }
        catch(error:any)
        {
            Alert.alert("Giriş başarısız");
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={authenticationStyles.container}>
            
            <Text style={authenticationStyles.title}>Giriş Yap</Text>
            
            <TextInput
                style={authenticationStyles.input}
                placeholder="E-Posta"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={authenticationStyles.input}
                placeholder="Şifre"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={authenticationStyles.button} onPress={handleLogin}>
                <Text style={authenticationStyles.buttonText}>Giriş Yap</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onForget}>
               <Text style={authenticationStyles.linkText}>Şifreni mi Unuttun? Sıfırla!</Text> 
            </TouchableOpacity>

            <TouchableOpacity onPress={onSwitch}>
               <Text style={authenticationStyles.linkText}>Hesabın yok mu? Kayıt Ol</Text> 
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};