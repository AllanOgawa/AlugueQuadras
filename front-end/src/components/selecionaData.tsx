import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions, Pressable } from 'react-native';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

interface DatePickerProps {
    minDate: Date;
    maxDate: Date;
    onDateSelect: (date: Date) => void;
}

dayjs.locale('pt-br');

const DatePicker: React.FC<DatePickerProps> = ({ minDate, maxDate, onDateSelect }) => {
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
            className={`flex items-center justify-center mx-1 p-2 px-5 rounded-lg ${date.toDateString() === selectedDate.toDateString() ? 'bg-primary' : 'bg-roxo'}`}
            onPress={() => handleDateChange(date)}
        >
            <Text className="text-xs text-white">{dayjs(date).format('ddd').toUpperCase()}</Text>
            <Text className="text-lg text-white font-bold">{dayjs(date).format('DD')}</Text>
            <Text className="text-xs text-white">{dayjs(date).format('MMM')}.</Text>
            <Text className="text-xs text-white">{dayjs(date).format('YYYY')}</Text>
        </Pressable>
    );

    return (
        <View className="absolute top-0 w-full p-4 bg-white flex-row items-center justify-between">
            <Pressable onPress={handlePreviousPage} className="p-2">
                <Text className="text-blue-500 text-lg">{'<'}</Text>
            </Pressable>
            <FlatList
                data={visibleDates}
                keyExtractor={(item) => item.toISOString()}
                horizontal
                renderItem={({ item }) => renderDateItem(item)}
                contentContainerStyle={{ display: "flex", justifyContent: "center" }}
            />
            <Pressable onPress={handleNextPage} className="p-2">
                <Text className="text-blue-500 text-lg">{'>'}</Text>
            </Pressable>
        </View>
    );
};

export default DatePicker;
