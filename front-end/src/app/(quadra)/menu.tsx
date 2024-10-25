import ListaQuadrasEstabelecimento from '@/src/components/listaQuadrasEstabelecimento';
import { EstabelecimentoProps } from '@/src/interfaces/estabelecimento';
import { CardConfig } from '@components/cardConfig';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';
import SetaVoltar from '@/src/components/setaVoltar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';
const statusBarHeight = Constants.statusBarHeight;

export default function HomeQuadra() {
    const [estabelecimento, setEstabelecimento] = useState<EstabelecimentoProps | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = useLocalSearchParams();  // Caso você passe o id do estabelecimento via rota

    // Função para buscar dados do estabelecimento na API
    const fetchEstabelecimento = async () => {
        try {
            const access_token = await AsyncStorage.getItem('access_token');
            const response = await fetch(`${apiUrl}/estabelecimento/search/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar os dados do estabelecimento');
            }

            const data = await response.json();
            setEstabelecimento(data); // Armazena o estabelecimento no estado
        } catch (error) {
            setError('Não foi possível carregar o estabelecimento');
            console.error('Erro ao buscar os dados do estabelecimento:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEstabelecimento();
    }, [id]);

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FF6600" />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>{error}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white" style={{ marginTop: statusBarHeight }}>
            <SetaVoltar />
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <View className="bg-white w-full px-4 flex-1 mt-1">
                <Text className='text-3xl font-bold my-4'>Quadras</Text>
                <CardConfig
                    icon={'add-circle-outline'}
                    title={'Nova quadra'}
                    subtitle={'Cadastrar uma nova quadra'}
                    style='h-16 w-full rounded-2xl flex-row items-center justify-between'
                    onPress={() => router.push('/cadastrar')}
                />
                <CardConfig
                    icon={'create'}
                    title={'Editar quadra'}
                    subtitle={'Editar uma quadra'}
                    style='h-16 w-full rounded-2xl flex-row items-center justify-between'
                    onPress={() => router.push('/editar')}
                />
                <CardConfig
                    icon={'highlight-remove'}
                    title={'Remover quadra'}
                    subtitle={'Remover uma quadra'}
                    style='h-16 w-full rounded-2xl flex-row items-center justify-between'
                    onPress={() => router.push('/remover')}
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
