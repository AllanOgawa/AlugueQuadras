import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListaEstabelecimento from '@/src/components/listaEstabelecimento';
import { router } from 'expo-router';
import { CardConfig } from '@/src/components/cardConfig';
import Constants from 'expo-constants';
import SetaVoltar from '@/src/components/setaVoltar';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';

const MenuGeralEstabelecimento = () => {
    const [estabelecimentos, setEstabelecimentos] = useState<[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getEstabelecimentos();
    }, []);

    async function getEstabelecimentos() {
        setLoading(true);
        const accessToken = await AsyncStorage.getItem('access_token');
        try {
            const response = await fetch(`${apiUrl}/estabelecimento/usuario`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();

            if (!response.ok) throw new Error('Erro ao buscar estabelecimentos');

            setEstabelecimentos(data);
        } catch (error) {
            console.error('Erro ao buscar estabelecimentos:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView className='flex-1 bg-white' style={{ marginTop: Constants.statusBarHeight }}>
            <SetaVoltar />
            <View className='flex-1 px-4'>
                <Text className='font-bold text-3xl mt-6 mb-5'>Estabelecimentos</Text>
                <CardConfig
                    icon="add-circle-outline"
                    title="Novo Estabelecimento"
                    subtitle="Cadastrar um novo estabelecimento"
                    style="h-16 w-full rounded-2xl flex-row items-center justify-between"
                    onPress={() => router.push('/cadastrarEditar')}
                />

                <Text className='mt-5 mb-2 text-2xl'>Estabelecimentos Ativos</Text>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {estabelecimentos.length > 0 ? (
                        <ListaEstabelecimento
                            estabelecimentos={estabelecimentos}
                            onPress={(estabelecimento) => router.push({
                                pathname: '/(estabelecimento)/menu/[id]',
                                params: { estabelecimento: JSON.stringify(estabelecimento) }
                            })}
                            loading={loading} />
                    ) : (
                        <Text style={{ textAlign: 'center', color: 'gray' }}>Nenhum Estabelecimento cadastrada.</Text>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default MenuGeralEstabelecimento;
