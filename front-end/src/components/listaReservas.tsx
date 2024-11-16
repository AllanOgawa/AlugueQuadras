import { FlatList, Text, SafeAreaView, Pressable, Image, View } from 'react-native';
import { CardReservaAtivo } from './reservas/cardReservaAtivo';
import { CardReservaHistorico } from './reservas/cardReservaHistorico';
import { useEffect, useState } from 'react';
import { ReservasProps } from '@src/interfaces/reservas';
import * as data from '@/db.json';
import dayjs from 'dayjs';
import Loading from './loading';
import Constants from 'expo-constants';
import HorizontalLine from './horizontalLine';

const bucketUrl = Constants.expoConfig?.extra?.bucketUrl || '';

export default function ListaReservas({ reservas }: { reservas: ReservasProps[] }) {
    const [loading, setLoading] = useState(true);
    const [reservasAtivas, setReservasAtivas] = useState<ReservasProps[]>([]);
    const [reservasHistorico, setReservasHistorico] = useState<ReservasProps[]>([]);

    useEffect(() => {
        const agora = dayjs();
        setReservasAtivas(reservas
            .filter(reserva => !reserva.cancelada)
            .filter(reserva => dayjs(reserva.dataFim).isAfter(agora))
        );
        setReservasHistorico(reservas
            .filter(reserva => dayjs(reserva.dataFim).isBefore(agora))
            .concat(reservas.filter(reserva => reserva.cancelada))
        );
        setLoading(false);
    }, [reservas]);

    return (
        <SafeAreaView>
            <Text className="text-2xl font-semibold mt-5">Ativos</Text>
            <HorizontalLine margin={10} />
            {reservasAtivas.map((reserva) => (
                <View key={reserva.idkey}>
                    <Pressable onPress={() => { }} className='flex flex-row w-full'>
                        <View className='flex-auto'>
                            <Text
                                className='text-xl font-bold color-primary'
                                numberOfLines={2}
                            >{reserva.quadra.estabelecimento?.nome}</Text>
                            <Text
                                className='text-sm'
                                numberOfLines={2}
                            >{reserva.quadra.estabelecimento?.endereco.logradouro}</Text>
                            <Text></Text>
                            <Text numberOfLines={1} className='font-semibold'>{reserva.quadra.nome}</Text>
                            <Text numberOfLines={1} >{dayjs(reserva.dataInicio).format('DD/MM/YYYY')}</Text>
                            <Text numberOfLines={1} >{dayjs(reserva.dataInicio).format('HH:mm')}h - {dayjs(reserva.dataFim).format('HH:mm')}h • R$ {Number(reserva.quadra.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                        </View >
                        <Image
                            source={{ uri: `${bucketUrl}/${reserva.quadra.estabelecimento?.imagens[0].path}` }}
                            className="h-36 w-36 rounded-2xl"
                        />
                    </Pressable>
                    <HorizontalLine margin={14} />

                </View>
            ))}

            <Text className="text-2xl font-semibold mt-5">Histórico</Text>
            {/* <FlatList
                data={reservasHistorico}
                renderItem={({ item }) => renderDateItem(item)}
                scrollEnabled={false}
                contentContainerStyle={{
                    gap: 12,
                    paddingBottom: 20,
                    paddingTop: 5,
                    paddingHorizontal: 2
                }}
            /> */}
            {loading && <Loading />}
        </SafeAreaView>
    );
}