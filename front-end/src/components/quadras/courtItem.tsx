import { estilo } from '@/src/styles/style';
import { Pressable, View, Image, Text } from 'react-native';
import { CourtProps } from '.';

export default function CourtItem({ court }: { court: CourtProps }) {
    return (
        <Pressable
            style={estilo.box}
            className='
                flex flex-row-reverse items-center 
                justify-between px-2 rounded-2xl w-[99%] h-40 bg-white'
            key={court.id}
            onPress={() => console.log(`Clicou na quadra ${court.id} - ${court.local}`)}
        >
            <Image
                source={{ uri: court.image }}
                className="h-36 w-36 rounded-2xl"
            />
            <View className='flex-auto'>
                <Text
                    className='text-lg font-bold color-orange-500'
                    numberOfLines={1}
                >{court.local}</Text>
                <Text
                    className='text-xs'
                    numberOfLines={2}
                >{court.endereco}</Text>
                <Text></Text>
                <Text numberOfLines={1} className='font-semibold'>{court.quadra}</Text>
                <Text numberOfLines={1} >{court.data}</Text>
                <Text numberOfLines={1} >{court.hora} • {court.valor}</Text>
            </View >
        </Pressable >
    );
}