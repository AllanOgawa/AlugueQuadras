import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface TimeSlot {
    start: string;
    end: string;
}

interface SelecionaHoraProps {
    horariosDisponiveis: TimeSlot[];
    onTimeSelect: (time: TimeSlot) => void;
}

const SelecionaHora: React.FC<SelecionaHoraProps> = ({ horariosDisponiveis, onTimeSelect }) => {
    const renderTimeItem = ({ item }: { item: TimeSlot }) => (

        <View
            className="mb-2 py-2 bg-roxo active:bg-primary rounded-2xl">
            <TouchableOpacity
                className='w-full h-full'
                onPress={() => onTimeSelect(item)}
            >
                <View className='items-center justify-between'>
                    <MaterialIcons name="access-time" size={20} color="white" />
                    <Text className="text-white text-lg font-bold">
                        {item.start}h - {item.end}h
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <View className="flex-1 px-4 mt-4">
            <Text className="text-xl font-semibold mb-2 text-center">
                Horários disponíveis
            </Text>
            <FlatList
                data={horariosDisponiveis}
                keyExtractor={(item) => `${item.start}-${item.end}`}
                showsVerticalScrollIndicator={false}
                renderItem={renderTimeItem}
                className='mb-1'
            />
        </View>
    );
};

export default SelecionaHora;
