import { SafeAreaView, StatusBar, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import Constants from 'expo-constants'
import Loading from '@components/loading';
import SelecionaData from '@/src/components/selecionaDataReserva';
import SelecionaHora from '@/src/components/selecionaHoraReserva';
import SetaVoltar from '@components/setaVoltar';
import dayjs from 'dayjs';
import HorizontalLine from '@/src/components/horizontalLine';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';

export interface HoraProps {
    horaInicio: string;
    horaFim: string;
}

export interface DataHoraReservaProps {
    data: string;
    horas: HoraProps[];
}

export default function SelecaoDataHora() {
    const { estabelecimento, quadra } = useLocalSearchParams();
    const [parsedEstabelecimento, setParsedEstabelecimento] = useState<any>(null);
    const [parsedQuadra, setParsedQuadra] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [horaDataDisponiveis, setHoraDataDisponiveis] = useState<DataHoraReservaProps[]>([]);
    const [horariosDisponiveis, setHorariosDisponiveis] = useState<HoraProps[]>([]);

    useEffect(() => {
        setLoading(true);
        try {
            if (typeof estabelecimento === 'string') {
                setParsedEstabelecimento(JSON.parse(estabelecimento));
            }
            if (typeof quadra === 'string') {
                setParsedQuadra(JSON.parse(quadra));
            }
        } catch (error) {
            console.log("Erro ao parsear dados:", error);
        }
        setLoading(false);
    }, [estabelecimento]);

    useEffect(() => {
        if (parsedQuadra)
            buscaDataHoras();
    }, [parsedQuadra]);

    async function buscaDataHoras() {
        setLoading(true);
        try {
            const access_token = await AsyncStorage.getItem('access_token');
            const response = await fetch(`${apiUrl}/estabelecimento/quadra/reserva/quadra/${parsedQuadra.idkey}/available-slots`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                setHoraDataDisponiveis(data);
            }
        } catch (error) {
            console.log('Erro de rede', error);
            Toast.show({
                type: 'error',
                text1: "Erro de Rede",
                text2: String(error),
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (horaDataDisponiveis.length > 0) {
            handleDateSelect(new Date());
        }
    }, [horaDataDisponiveis])


    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);

        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        const horariosDaDataSelecionada = horaDataDisponiveis.find((entry: { data: string; }) => entry.data === formattedDate);
        setHorariosDisponiveis(horariosDaDataSelecionada ? horariosDaDataSelecionada.horas : []);
    };

    const handleTimeSelect = (horario: any) => {
        router.push({
            pathname: '/(reserva)/selecaoPagamento',
            params: {
                data: String(selectedDate),
                horaInicio: horario.horaInicio,
                horaFim: horario.horaFim,
                estabelecimento: estabelecimento,
                quadra: quadra
            },
        })
    };

    return (
        <SafeAreaView className='flex-1 bg-white' style={{ marginTop: Constants.statusBarHeight }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <SetaVoltar />
            <View className='flex-1 px-4'>
                <View className='pt-4'></View>
                <SelecionaData
                    minDate={dayjs()}
                    maxDate={dayjs().add(19, 'day')}
                    onDateSelect={handleDateSelect}
                />
                {parsedQuadra && parsedQuadra.valor ? (
                    <Text className="text-2xl text-center font-semibold mt-4">
                        R$ {Number(parsedQuadra.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>
                ) : (
                    <Text className='text-4xl text-black'>Nenhuma quadra encontrada.</Text>
                )}

                {parsedEstabelecimento && parsedQuadra ? (
                    <Text className="text-xl text-center  mb-4">
                        {`${parsedEstabelecimento.nome} - ${parsedQuadra.nome}`}
                    </Text>
                ) : (
                    <Text className='text-4xl text-black'>Nenhum Estabelecimento encontrado.</Text>
                )}

                <HorizontalLine margin={4} />
                {selectedDate && (
                    <SelecionaHora horariosDisponiveis={horariosDisponiveis} onTimeSelect={handleTimeSelect} />
                )}
            </View>
            {loading && <Loading />}
        </SafeAreaView>
    );
}
