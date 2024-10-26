import { useEffect, useState } from 'react';
import { Modal, View, Text, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { router } from 'expo-router';

import * as data from '@/db.json';
import { EstabelecimentoProps } from '@/src/interfaces/estabelecimento';
import ListaQuadrasEstabelecimento from '@/src/components/listaQuadrasEstabelecimento';

export default function RemoveCourt() {
    const [estabelecimento, setEstabelecimento] = useState<EstabelecimentoProps | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCourt, setSelectedCourt] = useState(null);

    // Função para remover quadra
    const handleRemove = (estabelecimento?) => {
        setSelectedCourt(estabelecimento);
        setModalVisible(true); // Abre o modal de confirmação
    };

    // Carrega os dados do JSON ao montar o componente
    useEffect(() => {
        if (data.estabelecimento && data.estabelecimento.length > 0) {
            setEstabelecimento(data.estabelecimento[1]);
        }
    }, []);

    const confirmRemove = () => {
        console.log('Quadra removida:', selectedCourt);
        setModalVisible(false);
        setTimeout(() => {
            router.replace({
                pathname: '/menu',
                params: { message: "Quadra removida com sucesso!" }
            });
        }, 600);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View>
                    <Text style={styles.headerText}>Selecione uma quadra para remover:</Text>
                    {estabelecimento?.quadras && (
                        <ListaQuadrasEstabelecimento quadras={estabelecimento.quadras} onClick={handleRemove} />
                    )}
                </View>
            </ScrollView>

            {/* Modal de confirmação */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Tem certeza que deseja remover essa quadra?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmButton} onPress={confirmRemove}>
                                <Text style={styles.buttonText}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContent: {
        marginTop: 8,
        flexGrow: 1,
        margin: 12,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '300',
        marginLeft: 4,
        marginTop: 8,
        marginBottom: 8,
        flexDirection: 'row',
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
        alignItems: 'center',
    },
    confirmButton: {
        backgroundColor: '#FF7300',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});