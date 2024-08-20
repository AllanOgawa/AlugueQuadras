import { FlatList, View, Text, SafeAreaView } from 'react-native';
import { CardReservaAtivo } from './cardReservaAtivo';
import * as data from '../../../db.json';
import { useEffect, useState } from 'react';

export interface ReservasProps {
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


export function ReservasAtivo() {
    const [reservas, setReservas] = useState<ReservasProps[]>([])

    useEffect(() => {
        function getReservas() {
            const response = data.reservas;
            setReservas(response.filter(item => item.ativa));
        }
        getReservas();
    }, [])

    return (
        <SafeAreaView >
            <Text className="text-2xl font-semibold mt-5">Ativos</Text>
            <FlatList
                data={reservas}
                renderItem={({ item }) => <CardReservaAtivo reserva={item} />}
                scrollEnabled={false}
                contentContainerStyle={{ gap: 14 }}
            />
        </SafeAreaView>
    );
}