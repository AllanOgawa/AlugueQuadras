import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View, Text, Pressable, TextInputComponent } from 'react-native';

export default function ArrowBack() {
    return (
        <Pressable onPress={router.back}>
            <View className='flex-row items-center relative'>
                <MaterialIcons name='arrow-back-ios' size={25} className='py-2 ml-2' />
                <Text className='right-4 font-bold text-xl'> voltar</Text>
            </View>
        </Pressable>

    );
}