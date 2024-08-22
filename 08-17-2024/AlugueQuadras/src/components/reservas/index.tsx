import { FlatList, Text, SafeAreaView } from 'react-native';
import { CardReservaAtivo } from './cardReservaAtivo';
import { CardReservaHistorico } from './cardReservaHistorico';
import { useEffect, useState } from 'react';
import * as data from '@/db.json';

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

export function ReservasList() {
    const [reservas, setReservas] = useState<ReservasProps[]>([])

    useEffect(() => {
        setReservas(data.reservas)
    }, [])

    const reservasAtivas = reservas.filter(item => item.ativa)
    const reservasHistorico = reservas.filter(item => !item.ativa)

    return (
        <SafeAreaView>
            <Text className="text-2xl font-semibold mt-5">Ativos</Text>
            <FlatList
                data={reservasAtivas}
                renderItem={({ item }) => <CardReservaAtivo reserva={item} />}
                scrollEnabled={false}
                contentContainerStyle={{
                    gap: 12,
                    paddingBottom: 20,
                    paddingTop: 5,
                    paddingHorizontal: 2
                }}
            />

            <Text className="text-2xl font-semibold mt-5">Histórico</Text>
            <FlatList
                data={reservasHistorico}
                renderItem={({ item }) => <CardReservaHistorico reserva={item} />}
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