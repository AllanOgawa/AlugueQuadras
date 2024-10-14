import ListaEstabelecimento from '@/src/components/listaEstabelecimento';
import { EstabelecimentoProps } from '@/src/interfaces/estabelecimento';
import { CardConfig } from '@components/cardConfig';
import CourtList, { CourtProps } from '@components/quadras';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, FlatList } from 'react-native';
import Toast from 'react-native-toast-message';

import * as data from '@/db.json';

export default function HomeEstabelecimento() {
    const [estabelecimentos, setEstabelecimentos] = useState<EstabelecimentoProps[]>([]);
    const { message } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);

    function handleCourtPress(court: CourtProps): void {
        console.log(`Você clicou na quadra ${court.local} localizada em ${court.endereco}`);
    }

    useEffect(() => {
        if (message) {
            const toastMessage = Array.isArray(message) ? message.join(', ') : message;
            Toast.show({
                type: 'success',
                text1: toastMessage,
            });
        }
    }, [message]);

    useEffect(() => {
        if (data.estabelecimento && data.estabelecimento.length > 0) {
            setEstabelecimentos(data.estabelecimento);
        }
    }, []);

    const getHeader = () => (
        <View className='m-5'>
            <CardConfig
                icon={'add-circle-outline'}
                title={'Nova Estabelecimento'}
                subtitle={'Cadastrar um novo estabelecimento'}
                style='h-16 w-full rounded-2xl flex-row items-center justify-between'
                onPress={() => router.push('/create')}
            />
            <CardConfig
                icon={'create'}
                title={'Editar Estabelecimento'}
                subtitle={'Editar uma quadra'}
                style='h-16 w-full rounded-2xl flex-row items-center justify-between'
                onPress={() => router.push('/edit')}
            />
            <CardConfig
                icon={'highlight-remove'}
                title={'Remover estabelecimento'}
                subtitle={'Remover um estabelecimento'}
                style='h-16 w-full rounded-2xl flex-row items-center justify-between'
                onPress={() => router.push('/remove')}
            />
            <Text className='font-normal text-3xl pt-5'>Ativas</Text>
        </View>
    );

    // Rodapé da lista
    const getFooter = () => {
        if (loading) {
            return <Text>Carregando...</Text>;
        }
        return null;
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', marginHorizontal: 5 }}>
            <FlatList
                data={estabelecimentos}
                renderItem={({ item }) => <ListaEstabelecimento data={[item]} onPress={() => { }} />}
                ListHeaderComponent={getHeader}
                ListFooterComponent={getFooter}
                keyExtractor={(item) => item.id.toString()}
                onEndReached={() => setLoading(true)}
                onEndReachedThreshold={0.1}
            />
        </SafeAreaView>
    );
}
