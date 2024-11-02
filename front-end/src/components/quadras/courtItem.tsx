import { Pressable, View, Image, Text } from 'react-native';
import { CourtProps } from '.';
import globalStyles from '@src/styles/globalStyles';

interface CourtItemProps {
    court: CourtProps;
    onPress: () => void;
}

export default function CourtItem({ court, onPress }: CourtItemProps) {
    return (
        <Pressable
            style={globalStyles.box}
            className='
                flex flex-row-reverse items-center 
                justify-between px-2 rounded-2xl w-[99%] h-40 bg-white'
            key={court.id}
            onPress={onPress}
        >
            <Image
                source={{ uri: court.image }}
                className="h-36 w-36 rounded-2xl"
            />
            <View className='flex-auto'>
                <Text
                    className='text-lg font-bold color-primary'
                    numberOfLines={1}
                >{court.local}</Text>
                <Text
                    className='text-xs'
                    numberOfLines={2}
                >{court.endereco}</Text>
                <Text></Text>
                <Text numberOfLines={1} className='font-semibold'>{court.quadra}</Text>
                <Text numberOfLines={1}>{court.data}</Text>
                <Text numberOfLines={1}>{court.hora} • {court.valor}</Text>
            </View >
        </Pressable>
    );
}
