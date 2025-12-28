import React, { useState } from "react"; // React importu TSX dosyaları için gereklidir
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { authenticationStyles } from "../src/styles/authenticationStyles";

interface ForgetPasswordProps {
  onSwitch: () => void;
}

export const ForgetPassword = ({ onSwitch }: ForgetPasswordProps) => {
  const [email, setEmail] = useState<string>("");

  return (
    <View style={authenticationStyles.container}>
      <Text style={authenticationStyles.title}>Şifremi Unuttum</Text>
      
      {/* Yazı rengi ve hizalaması için küçük bir inline stil veya stil dosyanızdan bir ekleme */}
      <Text style={{ textAlign: 'center', marginBottom: 20, color: '#666' }}>
        Şifrenizi sıfırlamak için kayıtlı e-posta adresinizi giriniz.
      </Text>

      <TextInput
        style={authenticationStyles.input}
        placeholder="E-Posta Adresiniz"
        value={email}
        onChangeText={(val: string) => setEmail(val)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={authenticationStyles.button}
        onPress={() => console.log("Sıfırlama kodu gönderildi:", email)}
      >
        <Text style={authenticationStyles.buttonText}>Sıfırlama Linki Gönder</Text>
      </TouchableOpacity>

      {/* DÜZELTME: onSwitch fonksiyonu buradaki onPress'e bağlandı */}
      <TouchableOpacity onPress={onSwitch} style={{ marginTop: 20 }}>
        <Text style={authenticationStyles.linkText}>Giriş Ekranına Dön</Text>
      </TouchableOpacity>
    </View>
  );
};