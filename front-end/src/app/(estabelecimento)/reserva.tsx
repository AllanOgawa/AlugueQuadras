import { Alert, Pressable, SafeAreaView, ScrollView, StatusBar, Text, View, Image } from 'react-native'
import Constants from 'expo-constants'
import { useEffect, useState } from 'react';
import Loading from '@components/loading';
import { ReservasProps } from '@/src/interfaces/reservas';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BotaoPressable from '@/src/components/botoes/botaoPressable';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { router, useLocalSearchParams } from 'expo-router';
import HorizontalLine from '@/src/components/horizontalLine';
import AvaliacaoEstrelas from '@/src/components/avaliacaoEstrelas';
import SetaVoltar from '@/src/components/setaVoltar';

const statusBarHeight = Constants.statusBarHeight;
const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';
const bucketUrl = Constants.expoConfig?.extra?.bucketUrl || '';

dayjs.extend(utc);

export default function ReservaEstabelecimento() {
    const { idkeyEstabelecimento } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [valorTotal, setValorTotal] = useState(0);
    const [reservas, setReservas] = useState<ReservasProps[]>([]);
    const [reservasAtivas, setReservasAtivas] = useState<ReservasProps[]>([]);
    const [reservasHistorico, setReservasHistorico] = useState<ReservasProps[]>([]);
    const [reservasCanceladas, setReservasCanceladas] = useState<ReservasProps[]>([]);

    useEffect(() => {
        buscaReservas();
    }, [idkeyEstabelecimento]);

    useEffect(() => {
        if (reservas.length > 0) {
            setLoading(true);
            const agora = dayjs(`${dayjs().local().format("YYYY-MM-DD")}T${dayjs().local().format("HH:mm:ss")}.000Z`);
            setReservasAtivas(reservas
                .filter(reserva => !reserva.cancelada)
                .filter(reserva => dayjs.utc(reserva.dataFim).isAfter(agora))
            );
            setReservasHistorico(reservas
                .filter(reserva => !reserva.cancelada)
                .filter(reserva => dayjs.utc(reserva.dataFim).isBefore(agora))
            );
            setReservasCanceladas(reservas
                .filter(reserva => reserva.cancelada)
            );
            setValorTotal(reservas
                .filter(reserva => !reserva.cancelada)
                .map(reserva => Number(reserva.quadra.valor))
                .reduce((acc, value) => acc + value)
            )
            setLoading(false);
        }
    }, [reservas]);


    async function buscaReservas() {
        setLoading(true);
        try {
            const access_token = await AsyncStorage.getItem('access_token');
            const response = await fetch(`${apiUrl}/estabelecimento/quadra/reserva/list-by-estabelecimento/${idkeyEstabelecimento}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                setReservas(data);
            }
        } catch (error) {
            Alert.alert(
                "Erro de Rede",
                String(error)
            );
        } finally {
            setLoading(false);
        }
    };

    function maskString(str: string): string {
        if (str.length <= 2) {
            return str;
        }

        const masked = str[0] + '*'.repeat(str.length - 2) + str[str.length - 1];
        return masked;
    }

    function cardReserva(reserva: ReservasProps) {
        return (
            <View key={reserva.idkey}>
                <View className='flex flex-row w-full'>
                    <Image
                        source={{ uri: `${bucketUrl}/${reserva.quadra.imagens[0].path}` }}
                        className="h-32 w-32 rounded-2xl"
                    />
                    <View className='flex-1 ml-3'>
                        <View className='flex-1'>
                            <Text numberOfLines={2} className='text-xl font-bold color-primary'>{reserva.quadra.nome}</Text>
                            <Text numberOfLines={1} className='text-lg'>{dayjs(reserva.dataInicio).format('DD/MM/YYYY')} • {dayjs.utc(reserva.dataInicio).format('HH:mm')} - {dayjs.utc(reserva.dataFim).format('HH:mm')}</Text>
                            <Text numberOfLines={1} className='text-lg font-semibold'>R$ {Number(reserva.quadra.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                        </View>
                        <View>
                            <HorizontalLine margin={4} color='bg-secondary' />
                            {reserva.cancelada ?
                                <View>
                                    <Text className='text-lg text-center' numberOfLines={1}>Reserva Cancelada</Text>
                                </View>
                                :
                                <Text numberOfLines={1} className='text-lg text-right'>{maskString(reserva.usuario?.username ? reserva.usuario?.username : "")}</Text>
                            }
                        </View>
                    </View >
                </View>
                <HorizontalLine margin={14} />
            </View>
        )
    }


    return (
        <SafeAreaView className="flex-1 bg-white" style={{ marginTop: statusBarHeight }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <SetaVoltar />
            <ScrollView showsVerticalScrollIndicator={false} className="w-full px-4">
                <Text className="text-4xl font-semibold mt-3">Reservas</Text>
                <SafeAreaView>
                    <Text className="text-2xl text-center mt-5">Valor Total:</Text>
                    <Text className="text-2xl text-center font-bold">R$ {Number(valorTotal).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>

                    <Text className="text-2xl font-semibold mt-5">Ativos</Text>
                    <HorizontalLine margin={10} />
                    {reservasAtivas.map((reserva) => cardReserva(reserva))}

                    <Text className="text-2xl font-semibold mt-5">Histórico</Text>
                    <HorizontalLine margin={10} />
                    {reservasHistorico.map((reserva) => cardReserva(reserva))}

                    <Text className="text-2xl font-semibold mt-5">Canceladas</Text>
                    <HorizontalLine margin={10} />
                    {reservasCanceladas.map((reserva) => cardReserva(reserva))}

                    {loading && <Loading />}
                </SafeAreaView>
            </ScrollView>
            {loading && <Loading />}

        </SafeAreaView>
    );
}
