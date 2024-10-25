import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListaEstabelecimento from '@/src/components/listaEstabelecimento';
import { router } from 'expo-router';
import { CardConfig } from '@/src/components/cardConfig';
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';
import SetaVoltar from '@/src/components/setaVoltar';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';
const statusBarHeight = Constants.statusBarHeight;

const MenuEstabelecimento = () => {
    const navigation = useNavigation();
    const [selectedEstabelecimento, setSelectedEstabelecimento] = useState<string | null>(null);
    const [estabelecimentos, setEstabelecimentos] = useState([]);

    useEffect(() => {
        // Carrega o ID do estabelecimento salvo no AsyncStorage
        const loadEstabelecimento = async () => {
            try {
                const idEstabelecimento = await AsyncStorage.getItem('idEstabelecimento');
                if (idEstabelecimento) {
                    setSelectedEstabelecimento(idEstabelecimento);
                }
            } catch (error) {
                console.error('Erro ao carregar o ID do estabelecimento:', error);
            }
        };

        // Função para buscar a lista de estabelecimentos
        const fetchEstabelecimentos = async () => {
            try {
                const access_token = await AsyncStorage.getItem('access_token');
                const response = await fetch(`${apiUrl}/estabelecimento/usuario`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Erro ao buscar estabelecimentos');
                }

                const data = await response.json();
                setEstabelecimentos(data);
            } catch (error) {
                console.error('Erro ao buscar estabelecimentos:', error);
            }
        };

        loadEstabelecimento();
        fetchEstabelecimentos(); // Busca a lista de estabelecimentos ao carregar a tela
    }, []);

    const handlePress = async (estabelecimento) => {
        try {
            // Salva o ID do estabelecimento no AsyncStorage
            await AsyncStorage.setItem('idEstabelecimento', estabelecimento.idkey.toString());
            setSelectedEstabelecimento(estabelecimento.idkey);
            router.push({ pathname: '/menu/[id]', params: { id: estabelecimento.idkey } });
        } catch (error) {
            console.error('Erro ao salvar o ID do estabelecimento:', error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white" style={{ marginTop: statusBarHeight }}>
            <SetaVoltar />
            <View className="bg-white w-full px-4 flex-1 mt-1">
                <Text className='text-3xl font-bold my-4'>Estabelecimentos</Text>
                <CardConfig
                    icon={'add-circle-outline'}
                    title={'Novo Estabelecimento'}
                    subtitle={'Cadastrar um novo estabelecimento'}
                    style='h-16 w-full rounded-2xl flex-row items-center justify-between'
                    onPress={() => router.push('/cadastrar')}
                />

                <Text className='font-normal text-3xl py-5'>Estabelecimentos Ativos</Text>

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    {estabelecimentos.length > 0 ? (
                        <ListaEstabelecimento data={estabelecimentos} onPress={handlePress} />
                    ) : (
                        <Text>Nenhum estabelecimento encontrado.</Text>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default MenuEstabelecimento;
