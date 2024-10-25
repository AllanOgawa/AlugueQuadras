import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import ListaEstabelecimento from '@/src/components/listaEstabelecimento';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { EstabelecimentoProps } from '@/src/interfaces/estabelecimento';
import Constants from 'expo-constants';
import SetaVoltar from '@/src/components/setaVoltar';

const statusBarHeight = Constants.statusBarHeight;

export default function EditEstablishment() {
    const { message } = useLocalSearchParams();

    // Função para lidar com o clique em um estabelecimento
    function handleEstablishmentPress(estabelecimento: EstabelecimentoProps): void {
        // Aqui você pode passar o id do estabelecimento para edição
        router.replace('/cadastrar');
    }

    // Exibir toast com a mensagem, se disponível
    useEffect(() => {
        if (message) {
            const toastMessage = Array.isArray(message) ? message.join(', ') : message;
            Toast.show({
                type: 'success',
                text1: toastMessage,
            });
        }
    }, [message]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', marginTop: statusBarHeight }}>
            <SetaVoltar />
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <ListaEstabelecimento
                onPress={handleEstablishmentPress}
                options={{
                    showImage: true,
                    showAvaliacao: true,
                    showPreco: true,
                    showAcomodacoes: true,
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    emptyText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
});
