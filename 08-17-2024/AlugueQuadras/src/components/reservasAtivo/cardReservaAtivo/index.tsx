import { Pressable, Text, Image, View } from 'react-native';

import { ReservasProps } from '..'
import { Ionicons } from '@expo/vector-icons';

export function CardReservaAtivo({ reserva }: { reserva: ReservasProps }) {
    return (
        <Pressable
            className='flex flex-row items-center px-2 rounded-2xl w-full h-28 bg-slate-100'
            key={reserva.id}
            onPress={() => console.log(`Clicou na reserva ${reserva.id} - ${reserva.local}`)}
        >
            <View className='ml-1'>
                <Text
                    className='text-lg font-bold color-orange-500'
                    numberOfLines={1}
                >{reserva.local}</Text>
                <Text className='font-semibold'>{reserva.data} • {reserva.hora}</Text>
                <Text>{reserva.valor} - {reserva.quadra}</Text>
                <Text>
                    {reserva.avaliacao}
                    <Ionicons name='star' />
                </Text>

            </View>
            <Image
                source={{ uri: reserva.image }}
                className="h-24 w-24 rounded-2xl"
            />
        </Pressable>
    );
}