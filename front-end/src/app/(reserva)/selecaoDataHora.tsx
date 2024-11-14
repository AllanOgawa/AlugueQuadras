import { SafeAreaView, StatusBar, Text, View } from 'react-native';
import { useState } from 'react';
import Constants from 'expo-constants'
import Loading from '@components/loading';
import SelecionaData from '@components/selecionaData';
import SelecionaHora from '@components/selecionaHora';
import SetaVoltar from '@components/setaVoltar';
import dayjs from 'dayjs';
import HorizontalLine from '@/src/components/horizontalLine';
import { router } from 'expo-router';

const availableTimesFromBackend = [
    {
        date: "2024-11-05",
        times: [
            { start: "09:00", end: "10:00" },
            { start: "10:00", end: "11:00" },
            { start: "11:00", end: "12:00" },
            { start: "13:00", end: "14:00" },
            { start: "14:00", end: "15:00" },
            { start: "15:00", end: "16:00" },
            { start: "16:00", end: "17:00" },
            { start: "17:00", end: "18:00" },
        ]
    },
    {
        date: "2024-11-06",
        times: [
            { start: "16:00", end: "17:00" },
            { start: "17:00", end: "18:00" }
        ]
    },
    { date: "2024-11-07", times: [{ start: "16:00", end: "17:00" }, { start: "17:00", end: "18:00" }, { start: "18:00", end: "19:00" }] },
];

const reserva = { valor: 200.00, estabelecimento: "Beach Park Maringá", quadra: "Quadra 4", idkeyQuadra: 2 }

export default function SelecaoDataHora() {
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [availableTimes, setAvailableTimes] = useState([]);

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);

        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        const timesForSelectedDate = availableTimesFromBackend.find(entry => entry.date === formattedDate);

        setAvailableTimes(timesForSelectedDate ? timesForSelectedDate.times : []);
    };

    const handleTimeSelect = (timeSlot: any) => {
        console.log("Horário selecionado:", {
            date: selectedDate,
            startTime: timeSlot.start,
            endTime: timeSlot.end
        });

        router.push({
            pathname: '/(reserva)/selecaoPagamento',
            params: {
                date: String(selectedDate),
                startTime: timeSlot.start,
                endTime: timeSlot.end,
                valor: reserva.valor,
                quadra: reserva.quadra,
                idkeyQuadra: reserva.idkeyQuadra,
                estabelecimento: reserva.estabelecimento,
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
                    maxDate={dayjs().add(20, 'day')}
                    onDateSelect={handleDateSelect}
                />
                <Text className="text-2xl text-center font-semibold mt-4">
                    {`R$${reserva.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </Text>
                <Text className="text-xl text-center  mb-4">
                    {`${reserva.estabelecimento} - ${reserva.quadra}`}
                </Text>
                <HorizontalLine margin={4} />
                {selectedDate && (
                    <SelecionaHora horariosDisponiveis={availableTimes} onTimeSelect={handleTimeSelect} />
                )}
            </View>
            {loading && <Loading />}
        </SafeAreaView>
    );
}
