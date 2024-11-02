import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
    primaryColor: {
        color: '#FF7300',  // Cor primária
    },
    secondaryColor: {
        color: '#FF9238',  // Cor secundária
    },
    primaryBackground: {
        backgroundColor: '#FF7300',  // Cor de fundo primária
    },
    secondaryBackground: {
        backgroundColor: '#FF9238',  // Cor de fundo secundária
    },
    box: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 3,
    },
    box2: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 7,
    },
    buttonContainer: {
        backgroundColor: '#',
        paddingVertical: 8,
        justifyContent: 'flex-end',
    },
});

export default globalStyles;