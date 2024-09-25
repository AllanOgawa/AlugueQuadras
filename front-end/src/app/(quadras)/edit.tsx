import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, Pressable } from 'react-native';
import ListaQuadrasEstabelecimento from '@/src/components/listaQuadrasEstabelecimento';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { EstabelecimentoProps } from '@/src/interfaces/estabelecimento';

import * as data from '@/db.json';
import { CourtProps } from '@/src/components/quadras';
import { QuadraProps } from '@/src/interfaces/quadra';

export default function EditCourt() {
    const [estabelecimento, setEstabelecimento] = useState<EstabelecimentoProps | null>(null);
    const { message } = useLocalSearchParams();

    // Função para lidar com o clique em uma quadra
    function handleCourtPress(quadra: QuadraProps): void {
        console.log(`Você clicou na quadra ${quadra.name} localizada em ${quadra.id}`);
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

    // Definir o estabelecimento com dados importados
    useEffect(() => {
        const primeiroEstabelecimento = data.estabelecimento?.[0];
        if (primeiroEstabelecimento) {
            setEstabelecimento(primeiroEstabelecimento);
        }
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View>
                    <Text style={styles.headerText}>Selecione uma quadra para editar:</Text>
                    {estabelecimento?.quadras?.length ? (
                        <Pressable onPress={() => handleCourtPress(estabelecimento.quadras[0])}>
                            <ListaQuadrasEstabelecimento quadras={estabelecimento.quadras} />
                        </Pressable>
                    ) : (
                        <Text style={styles.emptyText}>Nenhuma quadra disponível no momento.</Text>
                    )}
                </View>
            </ScrollView>
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
