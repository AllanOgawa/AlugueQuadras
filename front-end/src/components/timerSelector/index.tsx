import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import DayIcon from '../dayIcon';


const diasDaSemana = [
  { dia: 'Ter', inicio: '10:00', fim: '21:00' },
  { dia: 'Qua', inicio: '10:00', fim: '21:00' },
  { dia: 'Qui', inicio: '10:00', fim: '21:00' },
  { dia: 'Sex', inicio: '10:00', fim: '21:00' },
  { dia: 'Sab', inicio: '8:00', fim: '21:00' },
  { dia: 'Dom', inicio: '6:00', fim: '22:00' },
];

export default function HorariosDisponiveis() {
  const [horarios, setHorarios] = useState(diasDaSemana);

  const handleHorarioChange = (index: number, campo: string, valor: string) => {
    const novosHorarios = [...horarios];
    novosHorarios[index][campo] = valor;
    setHorarios(novosHorarios);
  };

  return (
    <View className='mx-4'>
      <Text className="py-4 text-xl">Horários Disponíveis:</Text>
      {horarios.map((dia, index) => (
        <View key={index} className="flex-row items-center mb-3 justify-between mx-4">
          <View
            className={`h-16 w-16 p-3 rounded-xl justify-center items-center`}
            style={{ backgroundColor: '#FF7300' }}
          >
            <Text className='text-white font-semibold' style={{ color: '#ffff' }}>{dia.dia}</Text>
          </View>
          <TextInput
            className="border border-orange-500 rounded-lg p-2 px-4 mr-2 text-center"
            value={dia.inicio}
            onChangeText={(text) => handleHorarioChange(index, 'inicio', text)}
            keyboardType="numeric"
          />
          <Text className="text-gray-600 font-bold text-xl">as</Text>
          <TextInput
            className="border border-orange-500 rounded-lg p-2 px-4 text-center"
            value={dia.fim}
            onChangeText={(text) => handleHorarioChange(index, 'fim', text)}
            keyboardType="numeric"
          />
        </View>
      ))}
    </View>
  );
};
