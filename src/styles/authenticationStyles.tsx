import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../contants/colors';

const { width } = Dimensions.get('window');

export const authenticationStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 30,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#1A1A1A',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#7f8c8d',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        backgroundColor: '#F8F9FA',
        height: 55,
        borderRadius: 15,
        paddingHorizontal: 20,
        fontSize: 16,
        color: '#2C3E50',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    button: {
        backgroundColor: COLORS.primary,
        height: 55,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkContainer: {
        marginTop: 25,
        alignItems: 'center',
    },
    linkText: {
        color: '#7f8c8d',
        fontSize: 14,
        marginVertical: 8,
    },
    linkAction: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    infoIcon: {
        alignSelf: 'center',
        marginBottom: 20,
    }
});