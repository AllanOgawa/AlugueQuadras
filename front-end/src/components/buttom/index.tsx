import React from 'react';
import { Text, Pressable } from 'react-native';

interface CustomButtonProps {
    title: string;
    style: string;
    onPress: () => void
}

export default function CustomButton({ title, style, onPress }: CustomButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            className={style}
        >
            <Text className="text-white text-center text-lg">{title}</Text>
        </Pressable>
    );
};

