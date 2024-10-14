import { SafeAreaView, ImageBackground, View, StyleSheet, Text, StatusBar } from 'react-native';

import BotaoPressable from '@/src/components/botoes/botaoPressable';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

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

        if (isAppReady && login) {
            router.push("/(tabs)/inicio");
        }
    }, [isAppReady, login, router]);


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
