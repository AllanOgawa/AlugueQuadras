import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListaEstabelecimento from '@/src/components/listaEstabelecimento';
import { router } from 'expo-router';
import { CardConfig } from '@/src/components/cardConfig';
import Constants from 'expo-constants';
import SetaVoltar from '@/src/components/setaVoltar';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';
const statusBarHeight = Constants.statusBarHeight;

// Função para carregar o ID do estabelecimento do AsyncStorage
const loadEstabelecimentoFromStorage = async (setSelectedEstabelecimento: React.Dispatch<React.SetStateAction<string | null>>) => {
    try {
        const idEstabelecimento = await AsyncStorage.getItem('idEstabelecimento');
        if (idEstabelecimento) setSelectedEstabelecimento(idEstabelecimento);
    } catch (error) {
        console.error('Erro ao carregar o ID do estabelecimento:', error);
    }
};

// Função para buscar a lista de estabelecimentos da API
const fetchEstabelecimentos = async (setEstabelecimentos: React.Dispatch<React.SetStateAction<any[]>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
    try {
        const accessToken = await AsyncStorage.getItem('access_token');
        const response = await fetch(`${apiUrl}/estabelecimento/usuario`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        if (!response.ok) throw new Error('Erro ao buscar estabelecimentos');

        const data = await response.json();
        setEstabelecimentos(data);
        setError(null);
    } catch (error) {
        console.error('Erro ao buscar estabelecimentos:', error);
        setError('Erro ao buscar estabelecimentos.');
    } finally {
        setLoading(false);
    }
};

// Função para salvar o ID do estabelecimento selecionado e navegar para a página do estabelecimento
const handlePress = async (estabelecimento: any, setSelectedEstabelecimento: React.Dispatch<React.SetStateAction<string | null>>) => {
    try {
        await AsyncStorage.setItem('idEstabelecimento', estabelecimento.idkey.toString());
        setSelectedEstabelecimento(estabelecimento.idkey);
        router.push({
            pathname: '/(estabelecimento)/menu/[id]',
            params: { estabelecimento: JSON.stringify(estabelecimento) },
        });
    } catch (error) {
        console.error('Erro ao salvar o ID do estabelecimento:', error);
    }
};

const MenuGeralEstabelecimento = () => {
    const [selectedEstabelecimento, setSelectedEstabelecimento] = useState<string | null>(null);
    const [estabelecimentos, setEstabelecimentos] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadEstabelecimentoFromStorage(setSelectedEstabelecimento);
        fetchEstabelecimentos(setEstabelecimentos, setLoading, setError);
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', marginTop: statusBarHeight }}>
            <SetaVoltar />
            <View style={{ flex: 1, paddingHorizontal: 16 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 16 }}>Estabelecimentos</Text>
                <CardConfig
                    icon="add-circle-outline"
                    title="Novo Estabelecimento"
                    subtitle="Cadastrar um novo estabelecimento"
                    style="h-16 w-full rounded-2xl flex-row items-center justify-between"
                    onPress={() => router.push('/cadastrar')}
                />

                <Text style={{ fontSize: 24, marginVertical: 16 }}>Estabelecimentos Ativos</Text>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#FF6600" />
                    ) : error ? (
                        <Text>{error}</Text>
                    ) : (
                        <ListaEstabelecimento
                            estabelecimentos={estabelecimentos}
                            onPress={(estabelecimento) => handlePress(estabelecimento, setSelectedEstabelecimento)}
                            loading={loading} />
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default MenuGeralEstabelecimento;
