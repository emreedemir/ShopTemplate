import React, { useState, useEffect } from 'react';
import { 
    Modal, View, Text, TextInput, TouchableOpacity, 
    StyleSheet, KeyboardAvoidingView, Platform, 
    TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { COLORS } from '../src/contants/colors';
import { Ionicons } from '@expo/vector-icons';

interface BottomSheetProps {
    visible: boolean;
    onClose: () => void;
    onSave: (value: string) => void;
    type: 'address' | 'card' | 'name' | 'email' | 'password' | 'password_delete';
}

export const AddInfoBottomSheet = ({ visible, onClose, onSave, type }: BottomSheetProps) => {
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (visible) setInputValue('');
    }, [visible]);

    const getTitle = () => {
        switch(type) {
            case 'address': return 'Yeni Adres Ekle';
            case 'card': return 'Yeni Ödeme Yöntemi';
            case 'name': return 'İsim Değiştir';
            case 'email': return 'E-posta Güncelle';
            case 'password': return 'Şifre Değiştir';
            case 'password_delete': return 'Hesabı Silmeyi Onayla';
            default: return 'Bilgi Giriniz';
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); onClose(); }}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <KeyboardAvoidingView 
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={styles.sheetContainer}
                        >
                            <View style={styles.handleBar} />
                            <View style={styles.header}>
                                <Text style={styles.title}>{getTitle()}</Text>
                                <TouchableOpacity onPress={onClose}>
                                    <Ionicons name="close-circle" size={28} color="#ccc" />
                                </TouchableOpacity>
                            </View>

                            <TextInput
                                style={[styles.input, type === 'address' && { height: 100, textAlignVertical: 'top' }]}
                                placeholder={type === 'password_delete' ? 'Onay için şifrenizi girin' : 'Buraya yazınız...'}
                                value={inputValue}
                                onChangeText={setInputValue}
                                multiline={type === 'address'}
                                secureTextEntry={type === 'password' || type === 'password_delete'}
                                autoFocus
                                keyboardType={type === 'email' ? 'email-address' : 'default'}
                                autoCapitalize={type === 'email' || type === 'password' ? 'none' : 'sentences'}
                                placeholderTextColor="#999"
                            />

                            <TouchableOpacity 
                                style={[styles.saveButton, inputValue.trim().length === 0 && { backgroundColor: '#ccc' }]} 
                                onPress={() => { onSave(inputValue); onClose(); }}
                                disabled={inputValue.trim().length === 0}
                            >
                                <Text style={styles.saveButtonText}>
                                    {type === 'password_delete' ? 'HESABI KALICI OLARAK SİL' : 'Kaydet ve Güncelle'}
                                </Text>
                            </TouchableOpacity>
                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    sheetContainer: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, paddingBottom: Platform.OS === 'ios' ? 40 : 30, elevation: 20 },
    handleBar: { width: 40, height: 5, backgroundColor: '#E0E0E0', borderRadius: 3, alignSelf: 'center', marginBottom: 15 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
    input: { backgroundColor: '#F8F9FA', borderRadius: 15, padding: 15, fontSize: 16, marginBottom: 25, borderWidth: 1, borderColor: '#E9ECEF', color: '#333' },
    saveButton: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 15, alignItems: 'center' },
    saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});