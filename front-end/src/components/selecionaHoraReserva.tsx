import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface TimeSlot {
    horaInicio: string;
    horaFim: string;
}

interface SelecionaHoraProps {
    horariosDisponiveis: TimeSlot[];
    onTimeSelect: (time: TimeSlot) => void;
}

const SelecionaHora: React.FC<SelecionaHoraProps> = ({ horariosDisponiveis, onTimeSelect }) => {

    const horariosFormatados = horariosDisponiveis.map(horario => ({
        horaInicio: horario.horaInicio.slice(0, 5), // "HH:MM"
        horaFim: horario.horaFim.slice(0, 5),       // "HH:MM"
    }));

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
                        {item.horaInicio}h - {item.horaFim}h
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
                data={horariosFormatados}
                keyExtractor={(item) => `${item.horaInicio}-${item.horaFim}`}
                showsVerticalScrollIndicator={false}
                renderItem={renderTimeItem}
                className='mb-1'
            />
        </View>
    );
};

export default SelecionaHora;
