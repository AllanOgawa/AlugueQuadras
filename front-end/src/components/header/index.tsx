import { View, Pressable, Text } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router';

export function Header() {

    const router = useRouter()

    return (
        <View className='w-full flex flex-row items-center justify-between'>
            <View className='flex flex-col items-center justify-center ml-40'>
                <Text className='text-center text-sm text-slate-800'>Localização</Text>

                <View className='flex-row items-center justify-center gap-1'>
                    <Feather name="map-pin" size={14} color="#FF7300" />
                    <Text className='text-lg font-bold'>Maringá</Text>
                </View>
            </View>

            <Pressable
                className="w-10 h-10 flex justify-center items-center"
                onPress={() => router.push('/notification')}
            >
                <Feather name="bell" size={25} color="#121212" />
            </Pressable>
        </View>
    )
}