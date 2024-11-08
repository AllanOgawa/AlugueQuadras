import { SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import Constants from 'expo-constants'
import Loading from '@components/loading';
import SetaVoltar from '@components/setaVoltar';

import HorizontalLine from '@/src/components/horizontalLine';
import { router, useLocalSearchParams } from 'expo-router';
import ListaQuadrasEstabelecimento from '@/src/components/listaQuadrasEstabelecimento';
import ListaQuadrasReserva from '@/src/components/listaQuadrasReserva';

export default function SelecaoDataHora() {
    const { estabelecimento } = useLocalSearchParams();
    const [parsedEstabelecimento, setParsedEstabelecimento] = useState<any>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            if (typeof estabelecimento === 'string') {
                setParsedEstabelecimento(JSON.parse(estabelecimento));
            }
        } catch (error) {
            console.error("Erro ao parsear estabelecimento:", error);
        }
        setLoading(false);
    }, [estabelecimento]);

    return (
        <SafeAreaView className='flex-1 bg-white' style={{ marginTop: Constants.statusBarHeight }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <SetaVoltar />
            {parsedEstabelecimento ? (
                <View className='flex-1'>
                    <Text className="text-2xl text-center font-semibold mt-4"> {parsedEstabelecimento.nome} </Text>

                    <ScrollView
                        className='flex-1'
                        contentContainerStyle={{
                            paddingHorizontal: 16,
                            paddingTop: 16,
                            flexGrow: 1,
                        }}>
                        {/* <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}> */}
                        {parsedEstabelecimento.quadras ? (
                            <ListaQuadrasReserva
                                quadras={parsedEstabelecimento.quadras}
                                onClick={(quadra) => console.log(quadra)} />
                        ) : (
                            <Text className='text-4xl text-black'>Nenhuma quadra encontrada.</Text>
                        )}
                    </ScrollView>
                </View>
            ) : (
                <Text>Estabelecimento inválido.</Text>
            )}
            {loading && <Loading />}
        </SafeAreaView>
    );
}
