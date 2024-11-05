import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, SafeAreaView, FlatList, StatusBar, StyleSheet, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import ListaEstabelecimento from '@/src/components/listaEstabelecimento';
import { EstabelecimentoProps } from '@/src/interfaces/estabelecimento';
import SetaVoltar from '@/src/components/setaVoltar';
import { CardConfig } from '@components/cardConfig';
import * as data from '@/db.json';
import Constants from 'expo-constants';
import Toast from 'react-native-toast-message';
import ListaQuadrasEstabelecimento from '@/src/components/listaQuadrasEstabelecimento';

const statusBarHeight = Constants.statusBarHeight;

export default function MenuEstabelecimento() {
    const { id } = useLocalSearchParams();  // Obtém o ID do estabelecimento dos parâmetros
    const [estabelecimento, setEstabelecimento] = useState<EstabelecimentoProps | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Encontrar o estabelecimento pelo ID
        const selectedEstabelecimento = data.estabelecimento.find(estab => estab.id === id);
        if (selectedEstabelecimento) {
            setEstabelecimento(selectedEstabelecimento);
        }
    }, [id]);

    return (
        <SafeAreaView className="flex-1 bg-white" style={{ marginTop: statusBarHeight }}>
            <SetaVoltar />
            <View className="mx-3">
                <StatusBar barStyle="dark-content" backgroundColor="white" />
                {/* Mostrando o nome do estabelecimento */}
                {estabelecimento && (
                    <Text style={styles.estabelecimentoName}>{estabelecimento.name}</Text>
                )}

                <CardConfig
                    icon={'create'}
                    title={'Editar estabelecimento'}
                    subtitle={'Quero editar este estabelecimento'}
                    style="h-16 w-full rounded-2xl flex-row items-center justify-between"
                    onPress={() => router.push('/cadastrar')}
                />
                <CardConfig
                    icon={'history'}
                    title={'Reservas'}
                    subtitle={'Reservas ativas e histórico'}
                    style="h-16 w-full rounded-2xl flex-row items-center justify-between"
                    onPress={() => router.push('/reserva')}
                />
                <CardConfig
                    icon={'sports-tennis'}
                    title={'Quadras'}
                    subtitle={'Quadras desse estabelecimento'}
                    style="h-16 w-full rounded-2xl flex-row items-center justify-between"
                    onPress={() => router.push('/(quadra)/menu')}
                />
            </View>

            <Text className='font-normal text-3xl py-5 mx-2'>Quadras cadastradas</Text>

            <ScrollView className='mx-5' showsVerticalScrollIndicator={false}>
                {estabelecimento?.quadras && (
                    <ListaQuadrasEstabelecimento quadras={estabelecimento.quadras} onClick={() => { }} />
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    estabelecimentoName: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});
