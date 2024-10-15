import { useEffect, useState } from 'react';
import { Modal, View, Text, SafeAreaView, FlatList, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { router } from 'expo-router';
import * as data from '@/db.json';
import SetaVoltar from '@/src/components/setaVoltar';
import Constants from 'expo-constants';
import ListaEstabelecimento from '@/src/components/listaEstabelecimento';

const statusBarHeight = Constants.statusBarHeight;

export default function RemoveEstabelecimento() {
    const [estabelecimentos, setEstabelecimentos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedEstabelecimento, setSelectedEstabelecimento] = useState(null);
    const [loading, setLoading] = useState(false);

    // Função para remover estabelecimento
    const handleRemove = (estabelecimento) => {
        setSelectedEstabelecimento(estabelecimento);
        setModalVisible(true); // Abre o modal de confirmação
    };

    useEffect(() => {
        if (data.estabelecimento && data.estabelecimento.length > 0) {
            setEstabelecimentos(data.estabelecimento);  // Carrega todos os estabelecimentos
        } else {
            console.error('Nenhum estabelecimento encontrado.');
        }
    }, []);

    // Rodapé da lista
    const getFooter = () => {
        if (loading) {
            return <Text>Carregando...</Text>;
        }
        return null;
    };


    const confirmRemove = () => {
        setEstabelecimentos((prevEstabelecimentos) =>
            prevEstabelecimentos.filter((item) => item.id !== selectedEstabelecimento.id)
        );
        setModalVisible(false);
        setTimeout(() => {
            router.replace({
                pathname: '/home',
                params: { message: "Estabelecimento removido com sucesso!" }
            });
        }, 600);
    };

    return (
        <SafeAreaView className='flex-1 mx-3' style={{ marginTop: statusBarHeight + 8 }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <SetaVoltar />
            <Text className='text-xl mb-3 mt-2'>Selecione um estabelecimento para remover:</Text>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={estabelecimentos}
                renderItem={({ item }) => (
                    <ListaEstabelecimento
                        data={[item]}
                        onPress={() => handleRemove(item)} // Passa a função onPress
                    />
                )}
                keyExtractor={(item) => item.id.toString()} // Supondo que cada estabelecimento tenha um ID único
                onEndReached={() => setLoading(true)} // Carrega mais dados quando atinge o final da lista
                onEndReachedThreshold={0.1} // Define o limite para carregar mais dados
            />
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
                                <Text style={styles.buttonText}>Cancelar</Text>
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
    flatListContent: {
        paddingHorizontal: 12,
        paddingBottom: 12,
    },
    estabelecimentoItem: {
        padding: 16,
        backgroundColor: '#f5f5f5',
        marginVertical: 8,
        borderRadius: 8,
    },
    estabelecimentoText: {
        fontSize: 18,
        color: '#333',
    },
    noDataText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
    },
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
});
