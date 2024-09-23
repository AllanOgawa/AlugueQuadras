import { Pressable, Text, Image, View } from 'react-native';
import { ReservasProps } from '@src/interfaces/reservas';
import { Ionicons } from '@expo/vector-icons';
import { estilo } from '@src/styles/style';
import { router } from 'expo-router';

export function CardReservaHistorico({ reserva }: { reserva: ReservasProps }) {
    const navigateToEstabelecimento = (id: String) => {
        router.push(`../estabelecimento/${id}`); // Navega para a tela de detalhes com um ID na URL
    };
    return (
        <Pressable
            style={estilo.box}
            className='flex flex-row items-center px-2 rounded-2xl w-[99%] h-28 bg-white'
            key={reserva.id}
            onPress={() => navigateToEstabelecimento(reserva.id)}
        >
            <Image
                source={{ uri: reserva.image }}
                className="h-24 w-24 rounded-2xl"
            />
            <View className='ml-2 '>
                <Text
                    className='text-lg font-bold color-primary'
                    numberOfLines={1}
                >{reserva.local}</Text>
                <Text className='font-semibold'>{reserva.data} • {reserva.hora}</Text>
                <Text>{reserva.valor} - {reserva.quadra}</Text>
                <Text>
                    {reserva.avaliacao}
                    <Ionicons name='star' />
                </Text>
            </View>
        </Pressable>
    );
}