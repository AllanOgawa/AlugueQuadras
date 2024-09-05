import ArrowBack from '@/src/components/arrowBack';
import { CardConfig } from '@/src/components/cardConfig';
import QuadrasList from '@/src/components/quadras';
import { ReservasList } from '@/src/components/reservas';
import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { View, Text, Button, SafeAreaView, ScrollView } from 'react-native';

const statusBarHeight = Constants.statusBarHeight;

export default function HomeQuadra() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View
                style={{ flex: 1, marginTop: statusBarHeight + 2 }}
                className="bg-white w-full px-4"
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
                    title={'Nova quadra'}
                    subtitle={'Cadastrar uma nova quadra'}
                    style='h-16 w-full rounded-2xl flex-row items-center justify-between'
                    onPress={function (): void {
                        router.push('/edit')
                    }} />
                <Text className='font-normal text-3xl py-5'>Ativas</Text>

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <QuadrasList />
                </ScrollView>
            </View>
        </SafeAreaView >
    );
}