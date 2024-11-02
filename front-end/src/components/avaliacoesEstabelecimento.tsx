import { View, Text, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AvaliacaoProps } from '../interfaces/avaliacao';

import * as data from '@/db.json';
import { EstabelecimentoProps } from '../interfaces/estabelecimento';
import { useEffect, useState } from 'react';
import AvaliacaoEstrelas from './avaliacaoEstrelas';
import IconUsuario from './iconUsuario';
import HorizontalLine from './horizontalLine';
import { router } from 'expo-router';

interface AvaliacaoEstabelecimentoProps {
    avaliacoes: AvaliacaoProps[];
    avaliacaoMedia: number;
    idEstabelecimento: string;
    telaCheia: boolean;
}

export default function AvaliacoesEstabelecimento({ idEstabelecimento, avaliacoes, avaliacaoMedia, telaCheia }: AvaliacaoEstabelecimentoProps) {
    const [estabelecimento, setEstabelecimento] = useState<EstabelecimentoProps>();
    const [avaliacoesSlice, setAvaliacoesSlice] = useState<AvaliacaoProps[]>([]);
    const [avaliacoesLength, setAvaliacoesLength] = useState(false);
    const [isLoading, setLoading] = useState(true);

    async function getDados() {
        try {
            setEstabelecimento(data.estabelecimento.find(item => item.id == idEstabelecimento));

            if (telaCheia) {
                setAvaliacoesSlice(avaliacoes.sort((a, b) => new Date(b.dia).getTime() - new Date(a.dia).getTime()));
            } else {
                setAvaliacoesSlice(avaliacoes.sort((a, b) => new Date(b.dia).getTime() - new Date(a.dia).getTime()).slice(0, 5));
            }

            setAvaliacoesLength(avaliacoes.length > 5);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDados();
    }, [])

    function formataData(data: Date) {
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }

    function ocultaSobrenome(nomeCompleto: String) {
        const [primeiroNome, ...sobrenomes] = nomeCompleto.split(' ');
        return `${primeiroNome}`.trim();
    }

    function cardAvaliacao(avaliacao: AvaliacaoProps, index: number) {
        const quadra = estabelecimento?.quadras.find(quadra => quadra.id == avaliacao.id)?.name
        const dia = formataData(new Date(avaliacao.dia));
        return (
            <View key={avaliacao.id} className='flex-1 w-full'>
                <View className='flex-1 flex-row w-full justify-between'>
                    <View className='flex-1 flex-row'>
                        <IconUsuario image={avaliacao.usuario.image} style="w-16 h-16 rounded-full" />
                        <View className='ml-2'>
                            <Text className='text-base leading-5 font-bold' numberOfLines={1} >
                                {ocultaSobrenome(avaliacao.usuario.name)}
                            </Text>
                            <Text className='text-sm' numberOfLines={1} >
                                {dia}
                            </Text>
                            <Text className='text-sm leading-5' numberOfLines={1} >
                                {quadra}
                            </Text>
                        </View>
                    </View>
                    <View>
                        <AvaliacaoEstrelas avaliacao={avaliacao.nota} size={15} />
                    </View>
                </View>
                <Text className='text-base leading-5 font-bold mt-1' numberOfLines={1} >
                    {avaliacao.titulo}
                </Text>
                <Text className='text-base leading-5 mt-1' numberOfLines={(telaCheia) ? 15 : 4} >
                    {avaliacao.texto}
                </Text>
                {(!telaCheia && avaliacoesLength && avaliacoesSlice.length == index + 1) ?
                    <TouchableOpacity className='mt-10' onPress={
                        () => {
                            router.push(
                                {
                                    pathname: "/(estabelecimento)/avaliacoes",
                                    params: {
                                        idEstabelecimento: idEstabelecimento,
                                    }
                                }
                            )
                        }}>
                        <Text className='color-secondary font-bold mt-10'>Ver todas as {avaliacoes.length} avaliações</Text>
                    </TouchableOpacity>
                    : <View></View>
                }
                <HorizontalLine margin={(avaliacoesSlice.length == index + 1) ? 28 : 20} />
            </View>
        )
    }

    return (
        <SafeAreaView>
            {isLoading ? (
                <ActivityIndicator />
            ) : (
                <View>
                    <View className="justify-center items-center flex-row mb-10">
                        <View className='mr-2'>
                            <Text className='font-semibold text-3xl'>{avaliacaoMedia}</Text>
                        </View>
                        <AvaliacaoEstrelas avaliacao={avaliacaoMedia} size={32} />
                    </View>

                    <FlatList
                        data={avaliacoesSlice}
                        renderItem={({ item, index }) => cardAvaliacao(item, index)}
                        scrollEnabled={false}
                    />
                </View>
            )}
        </SafeAreaView>
    );
}