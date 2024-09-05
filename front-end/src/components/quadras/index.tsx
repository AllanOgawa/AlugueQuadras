import { View, Text, FlatList, SafeAreaView } from 'react-native';
import CourtItem from './courtItem';
import * as data from '@/db.json'
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

export default function CourtList() {
    const [court, setCourt] = useState<CourtProps[]>([])

    useEffect(() => {
        setCourt(data.quadras)
    }, [])

    const courtActive = court.filter(item => item.ativa)

    return (
        <SafeAreaView>
            <FlatList
                data={courtActive}
                renderItem={({ item }) => <CourtItem court={item} />}
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