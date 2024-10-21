import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, SafeAreaView, FlatList, StyleSheet, StatusBar } from 'react-native';
import ListaEstabelecimento from '@/src/components/listaEstabelecimento';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { EstabelecimentoProps } from '@/src/interfaces/estabelecimento';

import * as data from '@/db.json';
import Constants from 'expo-constants';
import SetaVoltar from '@/src/components/setaVoltar';

const statusBarHeight = Constants.statusBarHeight;

export default function EditEstablishment() {
    const [estabelecimentos, setEstabelecimentos] = useState<EstabelecimentoProps[]>([]);
    const { message } = useLocalSearchParams();

    // Função para lidar com o clique em um estabelecimento
    function handleEstablishmentPress(estabelecimento: EstabelecimentoProps): void {
        router.replace('/cadastrar'); // Navega para a tela de edição
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

    // Carregar os estabelecimentos do arquivo JSON
    useEffect(() => {
        if (data.estabelecimento && data.estabelecimento.length > 0) {
            setEstabelecimentos(data.estabelecimento);
        }
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-white" style={{ marginTop: statusBarHeight }}>
            <SetaVoltar />
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <FlatList
                data={estabelecimentos}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={
                    <View>
                        <Text style={styles.headerText}>Selecione um estabelecimento para editar:</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <ListaEstabelecimento
                        data={[item]} // Passa cada item individualmente
                        onPress={handleEstablishmentPress}
                    />
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Nenhum estabelecimento disponível no momento.</Text>
                }
                contentContainerStyle={styles.scrollViewContent}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollViewContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        flexGrow: 1,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '300',
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
});
