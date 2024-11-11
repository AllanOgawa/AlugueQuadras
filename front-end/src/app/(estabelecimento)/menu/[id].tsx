import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, StatusBar, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import ListaQuadrasEstabelecimento from '@/src/components/listaQuadrasEstabelecimento';
import SetaVoltar from '@/src/components/setaVoltar';
import { CardConfig } from '@components/cardConfig';
import Constants from 'expo-constants';
import Toast from 'react-native-toast-message';
import { EstabelecimentoProps } from '@/src/interfaces/estabelecimento';
import { QuadraProps } from '@/src/interfaces/quadra';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';
const statusBarHeight = Constants.statusBarHeight;

const removerEstabelecimento = async (id: number | undefined) => {
    try {
        const access_token = await AsyncStorage.getItem('access_token');
        if (!id) throw new Error('ID do estabelecimento não encontrado.');

        const response = await fetch(`${apiUrl}/estabelecimento/remove/${id}`, {
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

export default function MenuEstabelecimento() {
    const { estabelecimento: estabelecimentoParam } = useLocalSearchParams();
    const [estabelecimento, setEstabelecimento] = useState<EstabelecimentoProps | null>(null);
    const [quadras, setQuadras] = useState<QuadraProps[]>([]);
    const [loadingQuadras, setLoadingQuadras] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (estabelecimentoParam) {
            const parsedEstabelecimento = typeof estabelecimentoParam === 'string' ? JSON.parse(estabelecimentoParam) : estabelecimentoParam;
            setEstabelecimento(parsedEstabelecimento);
        }
        setLoadingQuadras(false);
    }, [estabelecimentoParam]);

    const handleRemoverEstabelecimento = () => {
        if (estabelecimento?.idkey) {
            setModalVisible(true);
        }
    };

    const confirmRemoverEstabelecimento = () => {
        if (estabelecimento?.idkey) {
            removerEstabelecimento(estabelecimento.idkey);
            setModalVisible(false);
        }
    };

    const handleReservas = () => {
        if (estabelecimento?.idkey) {
            router.push({ pathname: '/reserva', params: { id: estabelecimento.idkey } });
        } else {
            Toast.show({
                type: 'error',
                text1: 'Erro ao buscar as reservas',
                text2: 'Estabelecimento não encontrado.',
            })
        }
    };

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
            <View style={{ paddingHorizontal: 16 }}>
                <StatusBar barStyle="dark-content" backgroundColor="white" />
                {estabelecimento && (
                    <>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 16 }}>{estabelecimento.nome}</Text>
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
                            subtitle={'Ver Quadras cadastradas'}
                            style="h-16 w-full rounded-2xl flex-row items-center justify-between"
                            onPress={() => {
                                if (estabelecimento?.idkey) {
                                    router.push({ pathname: '/(quadra)/menu', params: { idEstabelecimento: estabelecimento.idkey.toString() } });
                                } else {
                                    console.warn('ID do estabelecimento não encontrado');
                                }
                            }}
                        />
                        <CardConfig
                            icon={'create'}
                            title={'Editar Estabelecimento'}
                            subtitle={'Editar o Estabelecimento Atual'}
                            style='h-16 w-full rounded-2xl flex-row items-center justify-between'
                            onPress={() => router.push({
                                pathname: '/(estabelecimento)/cadastrarEditar',
                                params: { estabelecimento: JSON.stringify(estabelecimento) }
                            })}
                        />
                        <CardConfig
                            icon={'highlight-remove'}
                            title={'Deletar Estabelecimento'}
                            subtitle={'Deletar o Estabelecimento Atual'}
                            style='h-16 w-full rounded-2xl flex-row items-center justify-between'
                            onPress={handleRemoverEstabelecimento}
                        />
                    </>
                )}
            </View>

            {/* Modal de Confirmação */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Deseja realmente remover o estabelecimento?</Text>
                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                                <Text style={styles.cancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={confirmRemoverEstabelecimento} style={styles.confirmButton}>
                                <Text style={styles.confirmText}>Remover</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
});
