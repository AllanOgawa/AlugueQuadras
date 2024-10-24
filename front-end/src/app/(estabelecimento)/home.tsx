import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListaEstabelecimento from '@/src/components/listaEstabelecimento';
import { router } from 'expo-router';
import { CardConfig } from '@/src/components/cardConfig';
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';

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
            console.log('ID do estabelecimento salvo:', estabelecimento.idkey);

            // Atualiza o estado local
            setSelectedEstabelecimento(estabelecimento.idkey.toString());

            Alert.alert('Sucesso', 'Estabelecimento selecionado!');
        } catch (error) {
            console.error('Erro ao salvar o ID do estabelecimento:', error);
        }
    };

    const handleEditarEstabelecimento = () => {
        if (selectedEstabelecimento) {
            router.push('/(estabelecimento)/editar', { idEstabelecimento: selectedEstabelecimento });
        } else {
            Alert.alert('Erro', 'Nenhum estabelecimento selecionado.');
        }
    };

    const removerEstabelecimento = async () => {
        try {
            const access_token = await AsyncStorage.getItem('access_token');
            const response = await fetch(`${apiUrl}/estabelecimento/remove/${selectedEstabelecimento}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao remover estabelecimento');
            }

            // Exibe mensagem de sucesso
            Toast.show({
                type: 'success',
                text1: 'Estabelecimento removido com sucesso',
            });

            // Redireciona após a remoção
            setTimeout(() => {
                router.replace({
                    pathname: '/menu',
                    params: { message: 'Estabelecimento removido com sucesso!' },
                });
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
        if (selectedEstabelecimento) {
            Alert.alert('Remover', `Deseja remover o estabelecimento ${selectedEstabelecimento}?`, [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Remover', onPress: removerEstabelecimento },
            ]);
        } else {
            Alert.alert('Erro', 'Nenhum estabelecimento selecionado.');
        }
    };

    const handleVerQuadras = () => {
        if (selectedEstabelecimento) {
            navigation.navigate('QuadrasCadastradas', { idEstabelecimento: selectedEstabelecimento });
        } else {
            Alert.alert('Erro', 'Nenhum estabelecimento selecionado.');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View className="bg-white w-full px-4 flex-1 mt-1">
                {/* Cartões de Configuração */}
                <CardConfig
                    icon={'add-circle-outline'}
                    title={'Novo Estabelecimento'}
                    subtitle={'Cadastrar um novo estabelecimento'}
                    style='h-16 w-full rounded-2xl flex-row items-center justify-between'
                    onPress={() => router.push('/create')}
                />
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

                <Text className='font-normal text-3xl py-5'>Ativas</Text>

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    {/* Renderização da lista de estabelecimentos */}
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
