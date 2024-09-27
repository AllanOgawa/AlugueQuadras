import { Pressable, Text, Image, View } from 'react-native';
import { ReservasProps } from '@src/interfaces/reservas';
import { estilo } from '@src/styles/style';
import { router } from 'expo-router';

export function CardReservaAtivo({ reserva }: { reserva: ReservasProps }) {
    const navigateToEstabelecimento = (id: String) => {
        router.push(`../estabelecimento/${id}`); // Navega para a tela de detalhes com um ID na URL
    };
    return (
        <Pressable
            style={estilo.box}
            className='
                flex flex-row-reverse items-center 
                justify-between px-2 rounded-2xl w-[99%] h-auto bg-white p-3'
            key={reserva.id}
            onPress={() => navigateToEstabelecimento(reserva.id)}
        >
            <Image
                source={{ uri: reserva.image }}
                className="h-36 w-36 rounded-2xl"
            />
            <View className='flex-auto'>
                <Text
                    className='text-xl font-bold color-primary'
                    numberOfLines={2}
                >{reserva.local}</Text>
                <Text
                    className='text-sm'
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