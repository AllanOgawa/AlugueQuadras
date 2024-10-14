import ListaEstabelecimento from '@/src/components/listaEstabelecimento';
import { EstabelecimentoProps } from '@/src/interfaces/estabelecimento';
import { CardConfig } from '@components/cardConfig';
import CourtList, { CourtProps } from '@components/quadras';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, FlatList } from 'react-native';
import Toast from 'react-native-toast-message';

import * as data from '@/db.json'; // Importa o JSON com os dados

export default function HomeEstabelecimento() {
    const [estabelecimentos, setEstabelecimentos] = useState<EstabelecimentoProps[]>([]); // Array de estabelecimentos
    const { message } = useLocalSearchParams();
    const [loading, setLoading] = useState(false); // Estado de carregamento

    // Função para lidar com o clique em uma quadra
    function handleCourtPress(court: CourtProps): void {
        console.log(`Você clicou na quadra ${court.local} localizada em ${court.endereco}`);
    }

    // Exibir toast com a mensagem, se disponível
    useEffect(() => {
        if (message) {
            const toastMessage = Array.isArray(message) ? message.join(', ') : message;
            Toast.show({
                type: 'success',
                text1: toastMessage,
            });
        }
    }, [message]);

    // Carrega os dados do JSON ao montar o componente
    useEffect(() => {
        if (data.estabelecimento && data.estabelecimento.length > 0) {
            setEstabelecimentos(data.estabelecimento); // Define todos os estabelecimentos
        }
    }, []);

    // Cabeçalho da lista
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
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <FlatList
                data={estabelecimentos}
                renderItem={({ item }) => <ListaEstabelecimento data={[item]} />} // Exibe um estabelecimento por vez
                ListHeaderComponent={getHeader}
                ListFooterComponent={getFooter}
                keyExtractor={(item) => item.id.toString()} // Supondo que cada estabelecimento tenha um ID único
                onEndReached={() => setLoading(true)} // Carrega mais dados quando atinge o final da lista
                onEndReachedThreshold={0.1} // Define o limite para carregar mais dados
            />
        </SafeAreaView>
    );
}
