import { View, Pressable, Text, ActivityIndicator, StatusBar } from 'react-native';
import { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { ObterLocalizacao } from '../location';
import { router } from 'expo-router';


export function Header() {
    const [city, setCity] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLocationWithTimeout = async () => {
            const locationTimeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout')), 5000)
            );
            StatusBar.setBarStyle('dark-content')

            try {
                const locationData = await Promise.race([
                    ObterLocalizacao(),
                    locationTimeout,
                ]);

                if (locationData) {
                    setCity(locationData.city);
                } else {
                    setCity("Sem Localização");
                }
            } catch (error) {
                setCity("Erro ao localizar");
            } finally {
                setLoading(false);
            }
        };

        fetchLocationWithTimeout();
    }, []);

    return (
        <View className='w-full flex flex-row items-center justify-between'>
            <View className="w-10 h-10"></View>

            <View className='flex flex-col items-center justify-center'>
                <Text className='text-center text-sm text-slate-800'>Localização</Text>

                <View className='flex-row items-center justify-center gap-1'>
                    <Feather name="map-pin" size={14} color="#FF7300" />
                    <Text className='text-lg font-bold'>{city}</Text>
                </View>
            </View>

            <Pressable
                className="w-10 h-10 flex justify-center items-center"
                onPress={() => router.push('/notification')}
            >
                <Feather name="bell" size={25} color="#121212" />
            </Pressable>
        </View>
    );
}