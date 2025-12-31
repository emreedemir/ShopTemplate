import React, { useState } from "react";
import { Text, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput, Alert,View } from "react-native";
import { useDispatch } from "react-redux";
import { authenticationStyles } from "../src/styles/authenticationStyles";
import { authService } from "../src/services/authService";
import { ActivityIndicator } from "react-native";

interface SignInProps {
    onSwitch: () => void;
    onForget: () => void;
}

export const SignIn = ({ onSwitch, onForget }: SignInProps) => {
    const [email, setEmail] = useState('');    
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async() => {
        if(!email || !password) return Alert.alert("Hata", "Lütfen bilgilerinizi girin.");
        setLoading(true);
        try {
            await authService.login(email, password);
        } catch(error: any) {
            Alert.alert("Hata", "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
        } finally { setLoading(false); }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={authenticationStyles.container}>
            <Text style={authenticationStyles.title}>Tekrar Merhaba!</Text>
            <Text style={authenticationStyles.subtitle}>Favori kitapların seni bekliyor.</Text>
            
            <TextInput style={authenticationStyles.input} placeholder="E-Posta" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={authenticationStyles.input} placeholder="Şifre" value={password} onChangeText={setPassword} secureTextEntry />

            <TouchableOpacity style={authenticationStyles.button} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={authenticationStyles.buttonText}>Giriş Yap</Text>}
            </TouchableOpacity>

            <View style={authenticationStyles.linkContainer}>
                <TouchableOpacity onPress={onForget}><Text style={authenticationStyles.linkText}>Şifreni mi Unuttun? <Text style={authenticationStyles.linkAction}>Sıfırla</Text></Text></TouchableOpacity>
                <TouchableOpacity onPress={onSwitch}><Text style={authenticationStyles.linkText}>Hesabın yok mu? <Text style={authenticationStyles.linkAction}>Kayıt Ol</Text></Text></TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};