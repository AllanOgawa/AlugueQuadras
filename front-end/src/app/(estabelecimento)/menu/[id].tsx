import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, Alert, StatusBar, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import ListaQuadrasEstabelecimento from '@/src/components/listaQuadrasEstabelecimento';
import SetaVoltar from '@/src/components/setaVoltar';
import { CardConfig } from '@components/cardConfig';
import Constants from 'expo-constants';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EstabelecimentoProps } from '@/src/interfaces/estabelecimento'; // Certifique-se de que o caminho está correto

const apiUrl = Constants.expoConfig?.extra?.apiUrl || ''; // Pegando o URL da API
const statusBarHeight = Constants.statusBarHeight;

export default function MenuEstabelecimento() {
    const { id } = useLocalSearchParams(); // Obtém o ID do estabelecimento dos parâmetros
    const [estabelecimento, setEstabelecimento] = useState<EstabelecimentoProps | null>(null);
    const [loading, setLoading] = useState(true);

    const removerEstabelecimento = async () => {
        try {
            const access_token = await AsyncStorage.getItem('access_token');
            const response = await fetch(`${apiUrl}/estabelecimento/remove/${estabelecimento?.idkey}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao remover estabelecimento');
            }

            Toast.show({
                type: 'success',
                text1: 'Estabelecimento removido com sucesso',
            });

            setTimeout(() => {
                router.replace('/menu');
            }, 600);
        } catch (error) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'Erro ao remover o estabelecimento',
            });
        }
    };

    const handleRemoverEstabelecimento = () => {
        if (estabelecimento?.idkey) {
            Alert.alert('Remover', `Deseja remover o estabelecimento ${estabelecimento.nome}?`, [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Remover', onPress: removerEstabelecimento },
            ]);
        } else {
            Alert.alert('Erro', 'Nenhum estabelecimento selecionado.');
        }
    };

    const handleEditarEstabelecimento = () => {
        if (estabelecimento?.idkey) {
            router.push({
                pathname: '/(estabelecimento)/cadastrar',
                params: { estabelecimento: JSON.stringify(estabelecimento) },
            });
        } else {
            Alert.alert('Erro', 'Nenhum estabelecimento selecionado.');
        }
    };

    const handleReservas = () => {
        if (estabelecimento?.idkey) {
            router.push({ pathname: '/reserva', params: { id: estabelecimento.idkey } });
        } else {
            Alert.alert('Erro', 'Nenhum estabelecimento selecionado.');
        }
    };

    const handleVerQuadras = () => {
        if (estabelecimento?.idkey) {
            router.push({ pathname: '/(quadra)/menu', params: { id: estabelecimento.idkey } });
        } else {
            Alert.alert('Erro', 'Nenhum estabelecimento selecionado.');
        }
    };

    useEffect(() => {
        const fetchEstabelecimento = async () => {
            if (!id) {
                console.error('ID do estabelecimento não encontrado.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${apiUrl}/estabelecimento/search/${id}`);
                if (!response.ok) throw new Error('Erro ao buscar o estabelecimento');
                const data = await response.json();
                setEstabelecimento(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEstabelecimento();
        }
    }, [id]);

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FF6600" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white" style={{ marginTop: statusBarHeight }}>
            <SetaVoltar />
            <View className="mx-3">
                <StatusBar barStyle="dark-content" backgroundColor="white" />
                {estabelecimento && (
                    <>
                        <Text className='text-3xl font-bold my-4'>{estabelecimento.nome}</Text>
                        <CardConfig
                            icon={'create'}
                            title={'Editar Estabelecimento'}
                            subtitle={'Editar um estabelecimento'}
                            style='h-16 w-full rounded-2xl flex-row items-center justify-between'
                            onPress={handleEditarEstabelecimento}
                        />
                        <CardConfig
                            icon={'highlight-remove'}
                            title={'Remover Estabelecimento'}
                            subtitle={'Remover um estabelecimento'}
                            style='h-16 w-full rounded-2xl flex-row items-center justify-between'
                            onPress={handleRemoverEstabelecimento}
                        />
                        <CardConfig
                            icon={'history'}
                            title={'Reservas'}
                            subtitle={'Ver reservas ativas e histórico'}
                            style="h-16 w-full rounded-2xl flex-row items-center justify-between"
                            onPress={handleReservas}
                        />
                        <CardConfig
                            icon={'sports-tennis'}
                            title={'Quadras'}
                            subtitle={'Ver quadras deste estabelecimento'}
                            style="h-16 w-full rounded-2xl flex-row items-center justify-between"
                            onPress={() => router.push({ pathname: '/(quadra)/menu', params: { id: estabelecimento.idkey } })}
                        />
                    </>
                )}
            </View>

            <Text className='font-normal text-3xl py-5 mx-2'>Quadras cadastradas</Text>

            <ScrollView className='mx-5' showsVerticalScrollIndicator={false}>
                {estabelecimento?.quadras && (
                    <ListaQuadrasEstabelecimento quadras={estabelecimento.quadras} onClick={() => { }} />
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
