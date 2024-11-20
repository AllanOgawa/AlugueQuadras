import React, { useCallback, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, router } from 'expo-router';
import SetaVoltar from '@components/setaVoltar';
import { CardConfig } from '@components/cardConfig';
import Constants from 'expo-constants';
import { QuadraProps } from '@/src/interfaces/quadra';
import ListaQuadras from '@components/listaQuadras';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';

export default function MenuQuadra() {
    const { idEstabelecimento } = useLocalSearchParams();
    const [quadras, setQuadras] = useState<QuadraProps[]>([]);
    const [loadingQuadras, setLoadingQuadras] = useState(true);

    const fetchQuadras = async (id: number) => {
        setLoadingQuadras(true); // Adicione isto para mostrar o indicador de carregamento
        try {
            const access_token = await AsyncStorage.getItem('access_token');
            if (!access_token) {
                throw new Error('Token de acesso não encontrado. Faça login novamente.');
            }

            const response = await fetch(`${apiUrl}/estabelecimento/${id}/quadras`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Erro ao buscar as quadras: ${response.status}`);
            }

            const data = await response.json();
            setQuadras(data);
        } catch (error: any) {
            // console.error('Erro detalhado:', error);
            // Toast.show({
            //     type: 'error',
            //     text1: 'Erro ao carregar as quadras',
            //     text2: error.message || 'Ocorreu um erro inesperado.',
            // });
        } finally {
            setLoadingQuadras(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (idEstabelecimento) {
                fetchQuadras(Number(idEstabelecimento));
            }
        }, [idEstabelecimento])
    );

    if (loadingQuadras) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FF6600" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className='flex-1 bg-white' style={{ marginTop: Constants.statusBarHeight }}>
            <SetaVoltar />
            <View className='flex-1 px-4'>
                <Text className='font-bold text-3xl mt-6 mb-5'>Quadras</Text>
                <CardConfig
                    icon="MaterialIcons;add-circle-outline"
                    title="Nova Quadra"
                    subtitle="Cadastrar uma nova quadra"
                    style="h-16 w-full rounded-2xl flex-row items-center justify-between"
                    onPress={() => router.push({
                        pathname: '/(quadra)/cadastrarEditar',
                        params: {
                            idEstabelecimento: Number(idEstabelecimento), // Passar o ID como número
                        },
                    })}
                />
                <Text className='mt-5 mb-7 text-2xl'>Quadras Cadastradas ({quadras.length})</Text>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {quadras.length > 0 ? (
                        <ListaQuadras
                            quadras={quadras}
                            showTitle={false}
                            onClick={(quadra) =>
                                router.push({
                                    pathname: '/(quadra)/cadastrarEditar',
                                    params: {
                                        idEstabelecimento: Number(idEstabelecimento), // Passar o ID como número
                                        quadra: JSON.stringify(quadra) // Passar a quadra como JSON
                                    },
                                })
                            }
                        />
                    ) : (
                        <Text style={{ textAlign: 'center', color: 'gray' }}>Nenhuma quadra cadastrada.</Text>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}