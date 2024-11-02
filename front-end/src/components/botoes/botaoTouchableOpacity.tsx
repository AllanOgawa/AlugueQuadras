import { Text, TouchableOpacity, View } from 'react-native';

interface CustomButtonProps {
    title: string;
    className: string;
    classNameTitle: string;
    onPress: () => void;
}

export default function BotaoTouchableOpacity({ title, className, classNameTitle, onPress }: CustomButtonProps) {
    return (
        <View className={className}>
            <TouchableOpacity
                onPress={onPress}
                className='w-full h-full'
            >
                <Text className={classNameTitle}>{title}</Text>
            </TouchableOpacity>
        </View>
    );
};

