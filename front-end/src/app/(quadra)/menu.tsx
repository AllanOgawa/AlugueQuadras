import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, StatusBar, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListaQuadrasEstabelecimento from '@/src/components/listaQuadrasEstabelecimento';
import { CardConfig } from '@components/cardConfig';
import { router, useLocalSearchParams } from 'expo-router';
import Constants from 'expo-constants';
import SetaVoltar from '@/src/components/setaVoltar';
import { EstabelecimentoProps } from '@/src/interfaces/estabelecimento';
import { EsporteProps } from '@/src/interfaces/esportes';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';
const statusBarHeight = Constants.statusBarHeight;

export default function HomeQuadra() {
    const { estabelecimento: estabelecimentoParam } = useLocalSearchParams();
    const [estabelecimento, setEstabelecimento] = useState<EstabelecimentoProps | null>(null);
    const [esportesDisponiveis, setEsportesDisponiveis] = useState<EsporteProps[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Configurar o estabelecimento a partir dos parâmetros recebidos
    useEffect(() => {
        if (estabelecimentoParam) {
            const parsedEstabelecimento = typeof estabelecimentoParam === 'string' ? JSON.parse(estabelecimentoParam) : estabelecimentoParam;
            setEstabelecimento(parsedEstabelecimento);
        }
    }, [estabelecimentoParam]);

    // Buscar esportes disponíveis
    useEffect(() => {
        const fetchEsportes = async () => {
            setLoading(true);
            try {
                const access_token = await AsyncStorage.getItem('access_token');
                const response = await fetch(`${apiUrl}/estabelecimento/quadra/tipo-esporte/list`, {
                    headers: { 'Authorization': `Bearer ${access_token}` },
                });
                if (!response.ok) throw new Error('Erro ao buscar esportes');
                const data = await response.json();
                setEsportesDisponiveis(data);
            } catch (error) {
                Alert.alert('Erro', 'Erro ao carregar os tipos de esportes');
                console.error('Erro ao buscar esportes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEsportes();
    }, []);

    // Navegação para rotas específicas de quadra
    const handleNavigate = (path: string) => {
        if (path === '/cadastrar' && estabelecimento) {
            const quadraInicial = {
                nome: '',
                informacoesAdicionais: '',
                valor: '',
                largura: '',
                comprimento: '',
                idkeyEstabelecimento: estabelecimento.idkey,
                imagensToAdd: [],
                tiposEsporteToAdd: esportesDisponiveis.map((esporte) => esporte.idkey),
            };
            router.push({
                pathname: '/estabelecimento/quadra/new',
                params: { quadra: JSON.stringify(quadraInicial) },
            });
        } else {
            router.push(path);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FF6600" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', marginTop: statusBarHeight }}>
            <SetaVoltar />
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <View style={{ paddingHorizontal: 16, flex: 1 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 16 }}>Quadras</Text>

                <CardConfig
                    icon={'add-circle-outline'}
                    title={'Nova quadra'}
                    subtitle={'Cadastrar uma nova quadra'}
                    style='h-16 w-full rounded-2xl flex-row items-center justify-between'
                    onPress={() => handleNavigate('/cadastrar')}
                />
                <CardConfig
                    icon={'create'}
                    title={'Editar quadra'}
                    subtitle={'Editar uma quadra'}
                    style='h-16 w-full rounded-2xl flex-row items-center justify-between'
                    onPress={() => handleNavigate('/editar')}
                />
                <CardConfig
                    icon={'highlight-remove'}
                    title={'Remover quadra'}
                    subtitle={'Remover uma quadra'}
                    style='h-16 w-full rounded-2xl flex-row items-center justify-between'
                    onPress={() => handleNavigate('/remover')}
                />

                <Text style={{ fontSize: 24, paddingVertical: 20 }}>Ativas</Text>

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    {estabelecimento?.quadras ? (
                        <ListaQuadrasEstabelecimento
                            quadras={estabelecimento.quadras}
                            onClick={(quadra) => router.push({
                                pathname: '/(quadra)/cadastrar',
                                params: { quadra: JSON.stringify(quadra) },
                            })}
                            loading={false} />
                    ) : (
                        <Text style={{ textAlign: 'center', color: 'gray' }}>Nenhuma quadra cadastrada.</Text>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
