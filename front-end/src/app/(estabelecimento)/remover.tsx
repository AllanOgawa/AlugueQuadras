import { useState } from 'react';
import { Modal, View, Text, SafeAreaView, FlatList, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { router } from 'expo-router';
import SetaVoltar from '@/src/components/setaVoltar';
import Constants from 'expo-constants';
import ListaEstabelecimento from '@/src/components/listaEstabelecimento';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EstabelecimentoProps } from '@/src/interfaces/estabelecimento';

const statusBarHeight = Constants.statusBarHeight;
const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';

export default function RemoveEstabelecimento() {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedEstabelecimento, setSelectedEstabelecimento] = useState<EstabelecimentoProps | null>(null);
    const [loading, setLoading] = useState(false);
    const [estabelecimentos, setEstabelecimentos] = useState<{ idkey: number }[]>([]);

    // Função para remover estabelecimento
    const handleRemove = (estabelecimento: EstabelecimentoProps) => {
        setSelectedEstabelecimento(estabelecimento);
        setModalVisible(true); // Abre o modal de confirmação
    };

    const confirmRemove = async () => {
        if (!selectedEstabelecimento) return;

        setLoading(true);

        try {
            const access_token = await AsyncStorage.getItem('access_token');
            const response = await fetch(`${apiUrl}/estabelecimento/remove/${selectedEstabelecimento.idkey.toString()}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao remover estabelecimento');
            }

            // Sucesso: remove o estabelecimento da lista atual
            setEstabelecimentos((prevEstabelecimentos) =>
                prevEstabelecimentos.filter((item) => item.idkey !== selectedEstabelecimento.idkey)
            );

            // Exibe mensagem de sucesso
            Toast.show({
                type: 'success',
                text1: 'Estabelecimento removido com sucesso',
            });

            setModalVisible(false);

            // Redireciona após uma pequena espera
            setTimeout(() => {
                router.replace({
                    pathname: '/menu',
                    params: { message: "Estabelecimento removido com sucesso!" },
                });
            }, 600);
        } catch (error) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'Erro ao remover o estabelecimento',
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <SafeAreaView className='flex-1 mx-3' style={{ marginTop: statusBarHeight + 8 }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <SetaVoltar />
            <Text className='text-xl mb-3 mt-2'>Selecione um estabelecimento para remover:</Text>

            {/* Renderizando ListaEstabelecimento que já carrega dados da API */}
            <ListaEstabelecimento
                onPress={handleRemove} // Passa a função para lidar com a remoção
                options={{
                    showImage: true,
                    showAvaliacao: false,
                    showPreco: false,
                }}
            />

            {/* Modal de confirmação */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Tem certeza que deseja remover esse estabelecimento?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonTextCancelar}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmButton} onPress={confirmRemove}>
                                <Text style={styles.buttonTextConfirmar}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        backgroundColor: '#D9D9D9',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
        alignItems: 'center'
    },
    confirmButton: {
        backgroundColor: '#FF7300',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    buttonTextConfirmar: {
        color: '#fff',
        fontWeight: 'bold',
    },
    buttonTextCancelar: {
        fontWeight: 'bold',
    }
});
