import { CardConfig } from '@/src/components/cardConfig';
import CourtList, { CourtProps } from '@/src/components/quadras';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';

export default function HomeQuadra() {
    function handleCourtPress(court: CourtProps): void {
        console.log(`Você clicou na quadra ${court.local} localizada em ${court.endereco}`)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View
                className="bg-white w-full px-4 flex-1 mt-1"
            >
                <CardConfig
                    icon={'add-circle-outline'}
                    title={'Nova quadra'}
                    subtitle={'Cadastrar uma nova quadra'}
                    style='h-16 w-full rounded-2xl flex-row items-center justify-between'
                    onPress={function (): void {
                        router.push('/create')
                    }} />
                <CardConfig
                    icon={'create'}
                    title={'Editar quadra'}
                    subtitle={'Editar uma quadra'}
                    style='h-16 w-full rounded-2xl flex-row items-center justify-between'
                    onPress={function (): void {
                        router.push('/edit')
                    }} />
                <CardConfig
                    icon={'highlight-remove'}
                    title={'Remover quadra'}
                    subtitle={'Remover uma quadra'}
                    style='h-16 w-full rounded-2xl flex-row items-center justify-between'
                    onPress={function (): void {
                        router.push('/remove')
                    }} />
                <Text className='font-normal text-3xl py-5'>Ativas</Text>

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <CourtList onPress={handleCourtPress} />
                </ScrollView>
            </View>
        </SafeAreaView >
    );
}