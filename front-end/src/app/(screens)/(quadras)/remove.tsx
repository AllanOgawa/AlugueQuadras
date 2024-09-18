import { useState } from 'react';
import { Modal, View, Text, SafeAreaView, ScrollView, StyleSheet, Button, TouchableOpacity } from 'react-native';
import QuadrasList from '@/src/components/quadras';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';

export default function RemoveCourt() {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCourt, setSelectedCourt] = useState(null);

    const handleRemove = (court) => {
        setSelectedCourt(court);
        setModalVisible(true); // Abre o modal
    };

    const confirmRemove = () => {
        console.log('Quadra removida:', selectedCourt);
        setModalVisible(false);
        setTimeout(() => {
            router.replace({
                pathname: '/(quadras)/home',
                params: { message: "Quadra removida com sucesso!" }
            });
        }, 600);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View>
                    <Text style={styles.headerText}>Selecione uma quadra para remover:</Text>
                    <QuadrasList onPress={handleRemove} />
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
                                <Text className='text-black font-medium text-2xs'>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmButton} onPress={confirmRemove}>
                                <Text className='text-white font-medium text-2xs'>Confirmar</Text>
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
        color: '#FF7300'
    },
    confirmButton: {
        backgroundColor: '#FF7300',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
        color: '#ffff'
    },
    buttonText: {
        color: '#ffff',
        fontWeight: 'bold',
    },
});

