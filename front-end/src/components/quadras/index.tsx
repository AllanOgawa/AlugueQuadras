import { FlatList, Pressable, SafeAreaView, Text, Image, View } from 'react-native';
import { estilo } from '@src/styles/style';
import CourtItem from './courtItem';
import * as data from '@/db.json';
import { useEffect, useState } from 'react';

export interface CourtProps {
    id: string;
    ativa: boolean;
    local: string;
    endereco: string;
    quadra: string;
    data: string;
    hora: string;
    valor: string;
    avaliacao: number;
    image: string;
}

interface CourtListProps {
    onPress: (court: CourtProps) => void;
}


export default function CourtList({ onPress }: CourtListProps) {
    const [court, setCourt] = useState<CourtProps[]>([]);

    useEffect(() => {
        setCourt(data.estabelecimento[0].quadras);
    }, []);

    const courtActive = court.filter(item => item.ativa);

    function cardQuadra() {
        return (
            <Pressable
                style={estilo.box}
                className='
                flex flex-row-reverse items-center 
                justify-between px-2 rounded-2xl w-[99%] h-40 bg-white'
                key={court.id}
                onPress={onPress}
            >
                <Image
                    source={{ uri: court.image }}
                    className="h-36 w-36 rounded-2xl"
                />
                <View className='flex-auto'>
                    <Text
                        className='text-lg font-bold color-primary'
                        numberOfLines={1}
                    >{court.local}</Text>
                    <Text
                        className='text-xs'
                        numberOfLines={2}
                    >{court.endereco}</Text>
                    <Text></Text>
                    <Text numberOfLines={1} className='font-semibold'>{court.quadra}</Text>
                    <Text numberOfLines={1}>{court.data}</Text>
                    <Text numberOfLines={1}>{court.hora} • {court.valor}</Text>
                </View >
            </Pressable>
        );
    }

    return (
        <SafeAreaView>
            <FlatList
                data={courtActive}
                renderItem={({ item }) => (
                    <CourtItem
                        court={item}
                        onPress={() => onPress(item)}
                    />
                )}
                scrollEnabled={false}
                contentContainerStyle={{
                    gap: 12,
                    paddingBottom: 20,
                    paddingTop: 5,
                    paddingHorizontal: 2
                }}
            />
        </SafeAreaView>
    );
}
