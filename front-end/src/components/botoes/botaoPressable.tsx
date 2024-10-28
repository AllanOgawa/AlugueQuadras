import { Pressable, Text, View, ViewStyle } from 'react-native';

interface CustomButtonProps {
    title: string;
    className: string;
    classNameTitle: string;
    onPress: () => void;
}

export default function BotaoPressable({ title, className, classNameTitle, onPress }: CustomButtonProps) {
    return (
        <View className={className}>
            <Pressable
                onPress={onPress}
            >
                <Text className={classNameTitle}>{title}</Text>
            </Pressable>
        </View>
    );
};

