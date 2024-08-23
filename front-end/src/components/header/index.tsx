import { View, Pressable, Text, ActivityIndicator, } from 'react-native';
import { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { ObterLocalizacao } from '../location';
import { useRouter } from 'expo-router'; 


export function Header() {
    const [loading, setLoading] = useState(true);
    const [city, setCity] = useState("");
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const locationData = await ObterLocalizacao();
            if (locationData) {
                setCity(locationData.city);
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <View className='w-full flex flex-row items-center justify-between'>
    
                <View className="w-10 h-10"></View>

                <View className='flex flex-col items-center justify-center'>
                    <ActivityIndicator className='flex-row items-center justify-center' size="small" color="#FF7300"/>
                </View>

                <Pressable
                    className="w-10 h-10 flex justify-center items-center"
                    onPress={() =>  router.push('/notification') }
                >
                    <Feather name="bell" size={25} color="#121212"/>
                </Pressable>
                    
            </View>
        );
    }

    return (
        <View className='w-full flex flex-row items-center justify-between'>

            <View className='flex flex-col items-center justify-center ml-40'>
                <Text className='text-center text-sm text-slate-800'>Localização</Text>

                <View className='flex-row items-center justify-center gap-1'>
                    <Feather name="map-pin" size={14} color="#FF7300" />
                    <Text className='text-lg font-bold'>{city}</Text>
                </View>
            </View>

            <Pressable
                className="w-10 h-10 flex justify-center items-center"
                onPress={() =>  router.push('/notification') }
            >
                <Feather name="bell" size={25} color="#121212"/>
            </Pressable>

        </View>
    )
}
