import ListaQuadrasEstabelecimento from '@/src/components/listaQuadrasEstabelecimento';
import { EstabelecimentoProps } from '@/src/interfaces/estabelecimento';
import { CardConfig } from '@components/cardConfig';
import CourtList, { CourtProps } from '@components/quadras';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';

import * as data from '@/db.json'; // Importa o JSON com os dados
import SetaVoltar from '@/src/components/setaVoltar';
import ListaEstabelecimento from '@/src/components/listaEstabelecimento';

export default function HomeEstabelecimento() {
    const [estabelecimentos, setEstabelecimentos] = useState<EstabelecimentoProps[]>([]); // Array de estabelecimentos
    const { message } = useLocalSearchParams();

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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View className="bg-white w-full px-4 flex-1 mt-1">
                {/* Cartões de Configuração */}
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

                {/* Título para quadras ativas */}
                <Text className='font-normal text-3xl py-5'>Ativas</Text>

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    {/* Renderização condicional da lista de estabelecimentos */}
                    {estabelecimentos.length > 0 ? (
                        <ListaEstabelecimento data={estabelecimentos} />
                    ) : (
                        <Text>Nenhum estabelecimento encontrado.</Text>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
