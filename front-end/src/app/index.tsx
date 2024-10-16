import { SafeAreaView, ImageBackground, View, StyleSheet, Text, StatusBar } from 'react-native';

import BotaoPressable from '@/src/components/botoes/botaoPressable';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export default function TelaLogin() {
    const [login, setLogin] = useState(false);
    const [isAppReady, setIsAppReady] = useState(false);

    const router = useRouter();
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(50);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ translateY: translateY.value }],
        };
    });

    useEffect(() => {
        opacity.value = withTiming(1, {
            duration: 3000,
            easing: Easing.out(Easing.exp),
        });

        translateY.value = withTiming(0, {
            duration: 3000,
            easing: Easing.out(Easing.exp),
        });

        setTimeout(() => setIsAppReady(true), 100);
    }, [opacity, translateY]);

    useEffect(() => {
        // Verifica se a aplicação está pronta e faz a requisição de login
        if (isAppReady) {
            getData();
        }
    }, [isAppReady]);

    async function getData() {
        try {
            const value = await AsyncStorage.getItem("access_token");
            if (value !== null) {
                console.log(value);
                handleLogin(value);
            }
        } catch (e) {
            console.error('Erro ao obter dados', e);
        }
    };

    const handleLogin = async (access_token: string) => {
        try {
            console.log(access_token)
            const response = await fetch('http://192.168.1.54:3000/auth/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login bem-sucedido', data);
                setLogin(true);
                router.push('/(tabs)/inicio');
                Toast.show({
                    type: 'success',
                    text1: "Login Bem-Sucedido",
                });
            } else {
                console.error('Erro no login', data);
                Toast.show({
                    type: 'error',
                    text1: "Login Falhou",
                    text2: data.message,
                });
            }
        } catch (error) {
            console.error('Erro de rede', error);
            Toast.show({
                type: 'error',
                text1: "Erro de Rede",
                text2: String(error),
            });
        }
    };


    if (!isAppReady) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Carregando...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView>
            <StatusBar backgroundColor="black" barStyle="light-content" />
            {!login && (
                <ImageBackground
                    source={{ uri: 'https://winnertennis.com.br/wp-content/uploads/2019/11/foto.jpg' }}
                    className='h-full'
                    resizeMode="cover"
                >
                    <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]} />
                    <View className='mt-[50%] items-center'>
                        <Animated.Image
                            source={{ uri: "https://i.postimg.cc/L847BZnX/Picsart-24-10-13-17-20-30-759.png" }}
                            className='w-[60%] h-48'
                            resizeMode="contain"
                            style={animatedStyle}
                        ></Animated.Image>
                        <Text className='text-4xl font-bold text-white text-center'>ALUGUE QUADRAS</Text>
                        <Text className='text-2xl text-white text-center'>P  L  A  Y</Text>
                    </View>
                    <View className='mt-[40%]'>
                        <BotaoPressable
                            title={'Login'}
                            className='bg-primary p-4 rounded-2xl active:bg-secondary mx-4'
                            classNameTitle='text-white text-center text-xl'
                            onPress={() => { router.push("/(usuario)/login") }}
                        />
                        <BotaoPressable
                            title={'Continuar sem Login'}
                            className='bg-roxo p-4 rounded-2xl active:bg-roxo/80 mx-4 mt-4'
                            classNameTitle='text-white text-center text-xl'
                            onPress={() => { router.push("/(tabs)/inicio") }}
                        />
                    </View>
                </ImageBackground>)}
        </SafeAreaView>
    );
}
