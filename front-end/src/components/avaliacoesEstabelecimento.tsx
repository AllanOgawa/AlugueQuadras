import { View, Text, SafeAreaView } from 'react-native';
import { AvaliacaoProps } from '../interfaces/avaliacao';
import { QuadraProps } from '../interfaces/quadra';

import * as data from '@/db.json';
import { EstabelecimentoProps } from '../interfaces/estabelecimento';
import { useEffect, useState } from 'react';
import AvaliacaoEstrelas from './avaliacaoEstrelas';

interface AvaliacaoEstabelecimentoProps {
    avaliacoes: AvaliacaoProps[];
    avaliacaoMedia: number;
    idEstabelecimento: string;
}

export default function AvaliacoesEstabelecimento({ idEstabelecimento, avaliacoes, avaliacaoMedia }: AvaliacaoEstabelecimentoProps) {
    const [estabelecimento, setEstabelecimento] = useState<EstabelecimentoProps>();

    useEffect(() => {
        setEstabelecimento(data.estabelecimento.find(item => item.id == idEstabelecimento))
    }, [])

    return (



        <SafeAreaView>
            <View className="justify-center items-center flex-row">
                <View>
                    <Text className='font-semibold text-3xl'>{avaliacaoMedia}</Text>
                </View>
                <AvaliacaoEstrelas avaliacao={avaliacaoMedia} />

            </View>

            {/* {avaliacoes.map((horario, index) => (
                <View key={horario.dia} className='flex-1 flex-row w-full'>
                    <Text className='text-base leading-5 font-bold w-[25%]' numberOfLines={1} >
                        {Date(horario.dia)}
                    </Text>
                    <View>
                        <Text className='text-base leading-5' numberOfLines={1} >
                            {horario.nota}
                        </Text>
                    </View>
                </View>
            ))
            } */}
        </SafeAreaView>
    );
}