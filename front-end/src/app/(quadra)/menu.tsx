import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, router } from 'expo-router';
import SetaVoltar from '@/src/components/setaVoltar';
import { CardConfig } from '@components/cardConfig';
import Constants from 'expo-constants';
import Toast from 'react-native-toast-message';
import { QuadraProps } from '@/src/interfaces/quadra';
import ListaQuadrasEstabelecimento from '@/src/components/listaQuadrasEstabelecimento';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';
const statusBarHeight = Constants.statusBarHeight;

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
            console.error('Erro detalhado:', error);
            Toast.show({
                type: 'error',
                text1: 'Erro ao carregar as quadras',
                text2: error.message || 'Ocorreu um erro inesperado.',
            });
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
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', marginTop: statusBarHeight }}>
            <SetaVoltar />
            <CardConfig
                icon="add-circle-outline"
                title="Nova Quadra"
                subtitle="Cadastrar uma nova quadra"
                style="h-16 w-full rounded-2xl flex-row items-center justify-between px-4"
                onPress={() => router.push({
                    pathname: '/(quadra)/cadastrar',
                    params: {
                        idEstabelecimento: Number(idEstabelecimento), // Passar o ID como número
                    },
                })}
            />
            <Text style={{ fontSize: 24, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 20 }}>Quadras cadastradas</Text>
            <ScrollView className="w-full px-3" showsVerticalScrollIndicator={false}>
                {quadras.length > 0 ? (
                    <ListaQuadrasEstabelecimento
                        quadras={quadras}
                        onClick={(quadra) =>
                            router.push({
                                pathname: '/(quadra)/editar',
                                params: {
                                    idEstabelecimento: Number(idEstabelecimento), // Passar o ID como número
                                    quadra: JSON.stringify(quadra) // Passar a quadra como JSON
                                },
                            })
                        }
                        loading={false}
                    />
                ) : (
                    <Text style={{ textAlign: 'center', color: 'gray' }}>Nenhuma quadra cadastrada.</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 8,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#ddd',
        borderRadius: 5,
        marginRight: 10,
    },
    confirmButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#FF6600',
        borderRadius: 5,
    },
    cancelText: {
        fontSize: 16,
        color: 'black',
    },
    confirmText: {
        fontSize: 16,
        color: 'white',
    },
    quadraContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    quadraText: {
        fontSize: 16,
    },
});
