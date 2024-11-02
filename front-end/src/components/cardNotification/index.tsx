import React, { useRef, useEffect } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function NotificationCard() {
    const slideAnim = useRef(new Animated.Value(300)).current; // Posição inicial fora da tela à direita

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0, // Animação até a posição final
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [slideAnim]);

    return (
        <Animated.View
            style={[
                styles.card,
                {
                    transform: [{ translateX: slideAnim }],
                },
            ]}
        >
            <MaterialIcons name="phone" size={35} color="#FF7300" />
            <View style={styles.textContainer}>
                <Text style={styles.title}>
                    Valide seu número de celular
                </Text>
                <Text style={styles.subtitle}>
                    E mantenha sua conta segura
                </Text>
            </View>
            <MaterialIcons name="keyboard-arrow-right" size={30} color="#FF7300" />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 'auto', // Reduz o tamanho para 90% da largura da tela
        height: 60, // Reduz a altura do componente
        backgroundColor: 'white',
        borderRadius: 10, // Ajusta o raio da borda
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8, // Ajusta o padding horizontal
        margin: 10, // Ajusta a margem
        shadowColor: '#000', // Cor da sombra
        shadowOffset: { width: 0, height: 3 }, // Deslocamento da sombra
        shadowOpacity: 0.2, // Opacidade da sombra
        shadowRadius: 4, // Raio de desfoque da sombra
        elevation: 4, // Elevação para Android
    },
    textContainer: {
        marginLeft: 10,
        flex: 1,
    },
    title: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    },
    subtitle: {
        color: 'gray',
        fontSize: 14,
    },
});
