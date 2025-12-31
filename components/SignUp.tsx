import { View,StyleSheet, TouchableOpacity,Text,TextInput, Alert} from "react-native";
import { authenticationStyles } from "../src/styles/authenticationStyles";

import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { authService } from "../src/services/authService";

export const SignUp = ({ onSwitch }: { onSwitch: () => void }) => {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!form.email || !form.password || !form.name) return Alert.alert("Hata", "Lütfen tüm alanları doldurunuz.");
        setLoading(true);
        try {
            await authService.register(form.email, form.password, form.name);
            Alert.alert("Başarılı", "Hesabınız oluşturuldu!");
        } catch (error: any) {
            Alert.alert("Kayıt Hatası", error.message);
        } finally { setLoading(false); }
    };

    return (
        <View style={authenticationStyles.container}>
            <Text style={authenticationStyles.title}>Aramıza Katıl</Text>
            <Text style={authenticationStyles.subtitle}>Binlerce kitap dünyasına adım at.</Text>
            
            <TextInput style={authenticationStyles.input} placeholder="Ad Soyad" onChangeText={(val) => setForm({ ...form, name: val })} />
            <TextInput style={authenticationStyles.input} placeholder="E-Posta" keyboardType="email-address" autoCapitalize="none" onChangeText={(val) => setForm({ ...form, email: val })} />
            <TextInput style={authenticationStyles.input} placeholder="Şifre" secureTextEntry onChangeText={(val) => setForm({ ...form, password: val })} />
            
            <TouchableOpacity style={authenticationStyles.button} onPress={handleRegister} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={authenticationStyles.buttonText}>Kayıt Ol</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={authenticationStyles.linkContainer} onPress={onSwitch}>
                <Text style={authenticationStyles.linkText}>Zaten hesabın var mı? <Text style={authenticationStyles.linkAction}>Giriş Yap</Text></Text>
            </TouchableOpacity>
        </View>
    );
};