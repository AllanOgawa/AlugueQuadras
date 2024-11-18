import { SafeAreaView, ImageBackground, View, StyleSheet, Text, StatusBar, ActivityIndicator } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { router } from 'expo-router';
import BotaoPressable from '@components/botoes/botaoPressable';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';
import { UsuarioContext } from '@context/usuarioContext';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';
const bucketUrl = Constants.expoConfig?.extra?.bucketUrl || '';

export default function TelaLogin() {
    const [login, setLogin] = useState(false);
    const [loading, setLoading] = useState(true);
    const context = useContext(UsuarioContext);
    if (!context) {
        throw new Error("YourComponent must be used within an ArrayProvider");
    }
    const { usuario, setUsuario } = context;

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
        getAcessToken();
    }, [opacity, translateY]);

    async function getAcessToken() {
        try {
            const value = await AsyncStorage.getItem("access_token");
            if (value !== null && value !== "") {
                handleLogin(value);
            } else {
                setUsuario([]);
                setLoading(false);
            }
        } catch (e) {
            console.error('Erro ao obter dados', e);
        }
    };

    async function setAccessToken(access_token: string) {
        try {
            await AsyncStorage.setItem("access_token", access_token);
            console.log('Dados armazenados no localStorage com sucesso');
        } catch (e) {
            console.error('Erro ao salvar dados', e);
        }
    };

    const handleLogin = async (access_token: string) => {
        try {
            const response = await fetch(`${apiUrl}/auth/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setLogin(true);
                setUsuario([data]);
                router.replace('/(tabs)/inicio');
            } else {
                setAccessToken("");
            }
        } catch (error) {
            console.error('Erro de rede', error);
            setAccessToken("");
            Toast.show({
                type: 'error',
                text1: "Erro de Rede",
                text2: String(error),
            });
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <View className='rounded-2xl flex-1 justify-center items-center'>
                <ActivityIndicator size="large" className='color-primary' />
            </View>
        );
    }

    return (
        <SafeAreaView>
            <StatusBar backgroundColor="black" barStyle="light-content" />
            {!login && (
                <ImageBackground
                    source={{ uri: `${bucketUrl}/public-storage/outros/backgroundImage.jpg` }}
                    className='h-full'
                    resizeMode="cover"
                >
                    <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]} />
                    <View className='mt-[50%] items-center'>
                        <Animated.Image
                            source={{ uri: `${bucketUrl}/public-storage/outros/logo.png` }}
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
