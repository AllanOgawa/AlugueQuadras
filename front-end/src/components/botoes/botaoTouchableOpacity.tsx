import { Text, TouchableOpacity, View } from 'react-native';

interface CustomButtonProps {
    title: string;
    className: string;
    onPress: () => void;
}

export default function BotaoTouchableOpacity({ title, className, onPress }: CustomButtonProps) {
    return (
        <View className={className}>
            <TouchableOpacity
                onPress={onPress}
                className='w-full h-full'
            >
                <Text className="text-white text-center text-xl">{title}</Text>
            </TouchableOpacity>
        </View>
    );
};

