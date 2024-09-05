import { CardConfig } from '@/src/components/cardConfig';
import QuadrasList from '@/src/components/quadras';
import { ReservasList } from '@/src/components/reservas';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { View, Text, Button, SafeAreaView, ScrollView } from 'react-native';

const statusBarHeight = Constants.statusBarHeight;

export default function HomeQuadra() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Text className="text-4xl font-semibold ml-2 mt-3">Quadras</Text>
            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={{ flex: 1, marginTop: statusBarHeight + 2 }}
                    className="bg-white w-full px-4"
                >
                    <CardConfig
                        icon={'add-circle-outline'}
                        title={'Nova quadra'}
                        subtitle={'Cadastrar uma nova quadra'}
                        onPress={function (): void {
                            router.push('/create')
                        }} />
                    <CardConfig
                        icon={'create'}
                        title={'Nova quadra'}
                        subtitle={'Cadastrar uma nova quadra'}
                        onPress={function (): void {
                            router.push('/editar')
                        }} />
                    <Text className='font-normal text-3xl py-5'>Ativas</Text>
                    <QuadrasList />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}