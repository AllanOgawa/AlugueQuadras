import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, Pressable } from 'react-native';
import QuadrasList, { CourtProps } from '@components/quadras';
import ListaQuadrasEstabelecimento from '@/src/components/listaQuadrasEstabelecimento';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { EstabelecimentoProps } from '@/src/interfaces/estabelecimento';

import * as data from '@/db.json'

export default function EditCourt() {

    const [estabelecimento, setEstabelecimento] = useState<EstabelecimentoProps | null>(null);
    const { message } = useLocalSearchParams();

    // Função para lidar com o clique em uma quadra
    function handleCourtPress(court: CourtProps): void {
        console.log(`Você clicou na quadra ${court.local} localizada em ${court.endereco}`);
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

    useEffect(() => {
        if (data.estabelecimento && data.estabelecimento.length > 0) {
            // Defina o primeiro estabelecimento (ou outro critério de escolha)
            setEstabelecimento(data.estabelecimento[1]);
        }
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View>
                    <Text style={styles.headerText}>Selecione uma quadra para editar:</Text>
                    <Pressable>
                        {estabelecimento?.quadras && (
                            <ListaQuadrasEstabelecimento quadras={estabelecimento.quadras} />
                        )}
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView >
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
        flexDirection: "row"
    }
});