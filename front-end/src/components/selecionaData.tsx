import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Dimensions, Pressable } from 'react-native';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface SelecionaDataProps {
    minDate: dayjs;
    maxDate: dayjs;
    onDateSelect: (date: Date) => void;
}

dayjs.locale('pt-br');

const SelecionaData: React.FC<SelecionaDataProps> = ({ minDate, maxDate, onDateSelect }) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [visibleDates, setVisibleDates] = useState<Date[]>([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [datesPerPage, setDatesPerPage] = useState(5);


    const handleDateChange = (newDate: Date) => {
        if (newDate >= minDate && newDate <= maxDate) {
            setSelectedDate(newDate);
            onDateSelect(newDate);
        }
    };

    const handlePreviousPage = () => {
        setPageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const handleNextPage = () => {
        const maxPage = Math.ceil(datesForRange().length / datesPerPage) - 1;
        setPageIndex((prevIndex) => Math.min(prevIndex + 1, maxPage));
    };

    const datesForRange = () => {
        const allDates = [];
        let currentDate = dayjs(minDate);
        while (currentDate.toDate() <= maxDate) {
            allDates.push(currentDate.toDate());
            currentDate = currentDate.add(1, 'day');
        }
        return allDates;
    };

    useEffect(() => {
        const { width } = Dimensions.get('window');
        const datesToShow = Math.floor(width / 80); // Ajuste de largura baseado no tamanho da tela
        setDatesPerPage(datesToShow);
    }, []);

    useEffect(() => {
        const start = pageIndex * datesPerPage;
        const end = start + datesPerPage;
        setVisibleDates(datesForRange().slice(start, end));
    }, [pageIndex, datesPerPage, selectedDate]);

    const renderDateItem = (date: Date) => (
        <Pressable
            key={date.toISOString()}
            className={`flex items-center justify-center mx-1 py-2 px-[23.5px] rounded-lg ${date.toDateString() === selectedDate.toDateString() ? 'bg-primary' : 'bg-roxo'}`}
            onPress={() => handleDateChange(date)}
        >
            <Text className="text-xs text-white">{dayjs(date).format('ddd').toUpperCase()}</Text>
            <Text className="text-lg text-white font-bold">{dayjs(date).format('DD')}</Text>
            <Text className="text-xs text-white">{dayjs(date).format('MMM')}.</Text>
            <Text className="text-xs text-white">{dayjs(date).format('YYYY')}</Text>
        </Pressable>
    );

    return (
        <View className="w-full bg-white flex-row items-center justify-between">
            <MaterialIcons onPress={handlePreviousPage} name='arrow-back-ios' size={22} color={Colors.primary} />
            <FlatList
                data={visibleDates}
                keyExtractor={(item) => item.toISOString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => renderDateItem(item)}
                contentContainerStyle={{ display: "flex", justifyContent: "center" }}
            />
            <MaterialIcons onPress={handleNextPage} name='arrow-forward-ios' size={22} color={Colors.primary} />
        </View>
    );
};

export default SelecionaData;
