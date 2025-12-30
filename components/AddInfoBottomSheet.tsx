import React, { useState, useEffect } from 'react';
import { 
    Modal, 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    KeyboardAvoidingView, 
    Platform, 
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { COLORS } from '../src/contants/colors';
import { Ionicons } from '@expo/vector-icons';

interface BottomSheetProps {
    visible: boolean;
    onClose: () => void;
    onSave: (value: string) => void;
    type: 'address' | 'card';
}

export const AddInfoBottomSheet = ({ visible, onClose, onSave, type }: BottomSheetProps) => {
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (visible) setInputValue('');
    }, [visible]);

    const handleSave = () => {
        if (inputValue.trim().length > 0) {
            onSave(inputValue);
            setInputValue('');
            onClose();
        }
    };

    return (
        <Modal 
            visible={visible} 
            animationType="slide" 
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={() => {
                Keyboard.dismiss();
                onClose();
            }}>
                <View style={styles.overlay}>
                
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <KeyboardAvoidingView 
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={styles.sheetContainer}
                        >

                            <View style={styles.handleBar} />

                            <View style={styles.header}>
                                <Text style={styles.title}>
                                    {type === 'address' ? 'Yeni Adres Ekle' : 'Yeni Ödeme Yöntemi'}
                                </Text>
                                <TouchableOpacity onPress={onClose}>
                                    <Ionicons name="close-circle" size={28} color="#ccc" />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.label}>
                                {type === 'address' ? 'Açık Adresiniz' : 'Kart Bilgisi (İsim veya No)'}
                            </Text>
                            
                            <TextInput
                                style={[
                                    styles.input, 
                                    type === 'address' && { height: 100, textAlignVertical: 'top' }
                                ]}
                                placeholder={
                                    type === 'address' 
                                    ? 'Mahalle, Sokak, Kapı No...' 
                                    : 'Örn: Maaş Kartım veya **** 1234'
                                }
                                value={inputValue}
                                onChangeText={setInputValue}
                                multiline={type === 'address'}
                                keyboardType={type === 'card' ? 'default' : 'default'}
                                autoFocus
                                placeholderTextColor="#999"
                            />

                            <TouchableOpacity 
                                style={[
                                    styles.saveButton,
                                    inputValue.trim().length === 0 && { backgroundColor: '#ccc' }
                                ]} 
                                onPress={handleSave}
                                disabled={inputValue.trim().length === 0}
                            >
                                <Text style={styles.saveButtonText}>Bilgileri Kaydet</Text>
                            </TouchableOpacity>
                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.6)', 
        justifyContent: 'flex-end' 
    },
    sheetContainer: { 
        backgroundColor: '#fff', 
        borderTopLeftRadius: 30, 
        borderTopRightRadius: 30, 
        padding: 25, 
        paddingBottom: Platform.OS === 'ios' ? 40 : 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20
    },
    handleBar: {
        width: 40,
        height: 5,
        backgroundColor: '#E0E0E0',
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: 15
    },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 20 
    },
    title: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        color: '#1A1A1A' 
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontWeight: '600'
    },
    input: { 
        backgroundColor: '#F8F9FA', 
        borderRadius: 15, 
        padding: 15, 
        fontSize: 16, 
        marginBottom: 25, 
        borderWidth: 1, 
        borderColor: '#E9ECEF',
        color: '#333'
    },
    saveButton: { 
        backgroundColor: COLORS.primary, 
        padding: 18, 
        borderRadius: 15, 
        alignItems: 'center',
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5
    },
    saveButtonText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: 'bold' 
    }
});