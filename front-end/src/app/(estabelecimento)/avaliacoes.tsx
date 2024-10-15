import { ActivityIndicator, ScrollView, StatusBar } from 'react-native';
import AvaliacoesEstabelecimento from '@components/avaliacoesEstabelecimento';
import { useLocalSearchParams } from 'expo-router';
import { EstabelecimentoProps } from '@/src/interfaces/estabelecimento';
import { useEffect, useState } from 'react';

import * as data from '@/db.json';

export default function Avaliacoes() {
    const { idEstabelecimento } = useLocalSearchParams();
    const [isLoading, setLoading] = useState(true);
    const [estabelecimento, setEstabelecimento] = useState<EstabelecimentoProps>();

    useEffect(() => {
        try {
            setEstabelecimento(data.estabelecimento.find(item => item.id == idEstabelecimento))
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [])

    return (
        <ScrollView className='px-4 py-4 bg-white'>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            {isLoading ? (
                <ActivityIndicator />
            ) : (
                <AvaliacoesEstabelecimento
                    idEstabelecimento={idEstabelecimento}
                    avaliacoes={estabelecimento?.avaliacoes}
                    avaliacaoMedia={estabelecimento?.avaliacao}
                    telaCheia={true}
                />
            )}
        </ScrollView>
    );
}