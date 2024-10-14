import { Pressable, Text, ViewStyle } from 'react-native';

interface CustomButtonProps {
    title: string;
    className: string;
    classNameTitle: string;
    onPress: () => void;
}

export default function BotaoPressable({ title, className, classNameTitle, onPress }: CustomButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            className={className}
        >
            <Text className={classNameTitle}>{title}</Text>
        </Pressable>
    );
};

