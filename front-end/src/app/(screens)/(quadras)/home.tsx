import { CardConfig } from '@components/cardConfig';
import CourtList, { CourtProps } from '@components/quadras';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';



export default function HomeQuadra() {
    function handleCourtPress(court: CourtProps): void {
        console.log(`Você clicou na quadra ${court.local} localizada em ${court.endereco}`);
    }

    const { message } = useLocalSearchParams();

    useEffect(() => {
        if (message) {
            const toastMessage = Array.isArray(message) ? message.join(', ') : message;
            Toast.show({
                type: 'success',
                text1: toastMessage,
            });
        }
    }, [message]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View className="bg-white w-full px-4 flex-1 mt-1">
                <CardConfig
                    icon={'add-circle-outline'}
                    title={'Nova quadra'}
                    subtitle={'Cadastrar uma nova quadra'}
                    style='h-16 w-full rounded-2xl flex-row items-center justify-between'
                    onPress={() => router.replace('/create')} // Limpar o stack ao navegar
                />
                <CardConfig
                    icon={'create'}
                    title={'Editar quadra'}
                    subtitle={'Editar uma quadra'}
                    style='h-16 w-full rounded-2xl flex-row items-center justify-between'
                    onPress={() => router.replace('/edit')} // Limpar o stack ao navegar
                />
                <CardConfig
                    icon={'highlight-remove'}
                    title={'Remover quadra'}
                    subtitle={'Remover uma quadra'}
                    style='h-16 w-full rounded-2xl flex-row items-center justify-between'
                    onPress={() => router.replace('/remove')} // Limpar o stack ao navegar
                />
                <Text className='font-normal text-3xl py-5'>Ativas</Text>

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <CourtList onPress={handleCourtPress} />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
