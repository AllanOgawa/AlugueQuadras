import { Pressable, Text, Image, View } from 'react-native';

import { ReservasProps } from './index'
import { estilo } from '@/src/styles/style';

export function CardReservaAtivo({ reserva }: { reserva: ReservasProps }) {
    return (
        <Pressable
            style={estilo.box}
            className='
                flex flex-row-reverse items-center 
                justify-between px-2 rounded-2xl w-[99%] h-40 bg-white'
            key={reserva.id}
            onPress={() => console.log(`Clicou na reserva ${reserva.id} - ${reserva.local}`)}
        >
            <Image
                source={{ uri: reserva.image }}
                className="h-36 w-36 rounded-2xl"
            />
            <View className='flex-auto'>
                <Text
                    className='text-lg font-bold color-orange-500'
                    numberOfLines={1}
                >{reserva.local}</Text>
                <Text
                    className='text-xs'
                    numberOfLines={2}
                >{reserva.endereco}</Text>
                <Text></Text>
                <Text numberOfLines={1} className='font-semibold'>{reserva.quadra}</Text>
                <Text numberOfLines={1} >{reserva.data}</Text>
                <Text numberOfLines={1} >{reserva.hora} • {reserva.valor}</Text>
            </View >
        </Pressable >
    );
}