import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const DisponibilidadeQuadra = () => {
  const horarios = [
    { dia: 'Ter', inicio: '10:00', fim: '21:00' },
    { dia: 'Qua', inicio: '10:00', fim: '21:00' },
    { dia: 'Qui', inicio: '10:00', fim: '21:00' },
    { dia: 'Sex', inicio: '10:00', fim: '21:00' },
    { dia: 'Sab', inicio: '8:00', fim: '21:00' },
    { dia: 'Dom', inicio: '6:00', fim: '22:00' },
  ];

  return (
    <View className="p-4">
      <Text className="text-lg font-bold mb-4">Horários Disponíveis:</Text>
      <View className="space-y-4">
        {horarios.map((horario, index) => (
          <View
            key={index}
            className="flex-row items-center justify-between bg-white p-2 rounded-lg shadow-sm"
          >
            {/* Dia da semana */}
            <TouchableOpacity className="bg-orange-500 rounded-full py-2 px-4">
              <Text className="text-white font-bold text-base">
                {horario.dia}
              </Text>
            </TouchableOpacity>

            {/* Horário de Início */}
            <View className="flex-row items-center">
              <FontAwesome name="clock-o" size={16} className="text-orange-500 mr-2" />
              <Text className="text-base">{horario.inicio}</Text>
            </View>

            {/* Texto "às" */}
            <Text className="text-base mx-2 text-gray-500">às</Text>

            {/* Horário de Fim */}
            <View className="flex-row items-center">
              <FontAwesome name="clock-o" size={16} className="text-orange-500 mr-2" />
              <Text className="text-base">{horario.fim}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default DisponibilidadeQuadra;
