import ListaQuadrasEstabelecimento from '@/src/components/listaQuadrasEstabelecimento';
import { EstabelecimentoProps } from '@/src/interfaces/estabelecimento';
import { CardConfig } from '@components/cardConfig';
import CourtList, { CourtProps } from '@components/quadras';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';

import * as data from '@/db.json' // Importa o JSON com os dados
import { QuadraProps } from '@/src/interfaces/quadra';

export default function HomeQuadra() {
    const [estabelecimento, setEstabelecimento] = useState<EstabelecimentoProps | null>(null);
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
            // Defina o primeiro estabelecimento (ou outro critério de escolha)
            setEstabelecimento(data.estabelecimento[1]);
        }
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View className="bg-white w-full px-4 flex-1 mt-1">
                {/* Cartões de Configuração */}
                <CardConfig
                    icon={'add-circle-outline'}
                    title={'Nova quadra'}
                    subtitle={'Cadastrar uma nova quadra'}
                    style='h-16 w-full rounded-2xl flex-row items-center justify-between'
                    onPress={() => router.push('/create')}
                />
                <CardConfig
                    icon={'create'}
                    title={'Editar quadra'}
                    subtitle={'Editar uma quadra'}
                    style='h-16 w-full rounded-2xl flex-row items-center justify-between'
                    onPress={() => router.push('/edit')}
                />
                <CardConfig
                    icon={'highlight-remove'}
                    title={'Remover quadra'}
                    subtitle={'Remover uma quadra'}
                    style='h-16 w-full rounded-2xl flex-row items-center justify-between'
                    onPress={() => router.push('/remove')}
                />

                {/* Título para quadras ativas */}
                <Text className='font-normal text-3xl py-5'>Ativas</Text>

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    {/* Renderização condicional da lista de quadras */}
                    {estabelecimento?.quadras && (
                        <ListaQuadrasEstabelecimento quadras={estabelecimento.quadras} onClick={() => { }} />
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
