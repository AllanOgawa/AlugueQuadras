import { useEffect, useState } from 'react';
import { View, Text, Button, Pressable } from 'react-native';

interface DayIconProps {
    day: string,
    color: string
}

export default function DayIcon({ day, color }: DayIconProps) {
    const [pressed, setPressed] = useState(false);

    const togglePressed = () => {
        setPressed(!pressed); // Alterna o estado de 'pressed' entre true e false
    };

    return (
        <Pressable onPress={togglePressed}>
            <View
                className={`h-14 w-14 p-2 rounded-2xl justify-center items-center`}
                style={{ backgroundColor: pressed ? color : '#D9D9D9' }} // Alterna entre duas cores
            >
                <Text className='text-white font-semibold' style={{ color: pressed ? '#ffff' : '#000000' }}>{day}</Text>
            </View>
        </Pressable>
    );
}
