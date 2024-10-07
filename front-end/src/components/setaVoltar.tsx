import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View, Text, Pressable } from 'react-native';

export default function SetaVoltar() {
    return (
        <Pressable onPress={router.back}>
            <View className='flex-row items-center relative'>
                <MaterialIcons name='arrow-back-ios' size={22} className='py-2 ml-2' />
                <Text className='right-4 font-bold text-xl mb-1'>  voltar</Text>
            </View>
        </Pressable>

    );
}