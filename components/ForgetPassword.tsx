import React, { useState } from "react"; 
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { authenticationStyles } from "../src/styles/authenticationStyles";
import { authService } from "../src/services/authService";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";
import{COLORS} from '../src/contants/colors';

interface ForgetPasswordProps {
  onSwitch: () => void;
}

export const ForgetPassword = ({ onSwitch }: { onSwitch: () => void }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
      if (!email) return Alert.alert("Uyarı", "Lütfen e-posta adresinizi girin.");
      setLoading(true);
      try {
          await authService.resetPassword(email);
          Alert.alert("Bilgi", "Şifre sıfırlama linki e-postanıza gönderildi.");
          onSwitch(); 
      } catch (err: any) {
          Alert.alert("Hata", "Sıfırlama isteği gönderilemedi.");
      } finally { setLoading(false); }
  };

  return (
      <View style={authenticationStyles.container}>
          <Ionicons name="lock-open-outline" size={60} color={COLORS.primary} style={authenticationStyles.infoIcon} />
          <Text style={authenticationStyles.title}>Şifreni Sıfırla</Text>
          <Text style={authenticationStyles.subtitle}>Sana bir sıfırlama linki gönderebilmemiz için e-posta adresini gir.</Text>
          <TextInput style={authenticationStyles.input} placeholder="E-Posta Adresiniz" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TouchableOpacity style={authenticationStyles.button} onPress={handleReset} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={authenticationStyles.buttonText}>Linki Gönder</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={authenticationStyles.linkContainer} onPress={onSwitch}>
              <Text style={authenticationStyles.linkText}>Geri Dön ve <Text style={authenticationStyles.linkAction}>Giriş Yap</Text></Text>
          </TouchableOpacity>
      </View>
  );
};