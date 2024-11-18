import { Pressable, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import HorizontalLine from '../horizontalLine';
import { Colors } from '@/src/constants/Colors';
import Icone from '../icone';

interface CardConfigProps {
    icon: string;
    title: string;
    subtitle: string;
    style?: string
    onPress: () => void;
}

export function CardConfig({ icon, title, subtitle, style, onPress }: CardConfigProps) {
    return (
        <View>
            <Pressable
                className={style}
                onPress={onPress}
            >
                <View className="flex-row items-center">
                    <Icone icone={icon} size={30} color="black" />
                    <View className="flex-col">
                        <Text className="font-bold text-xl ml-4">{title}</Text>
                        <Text className="text-black text-lg ml-4">{subtitle}</Text>
                    </View>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={30} color={Colors.primary} />
            </Pressable>
            <HorizontalLine margin={8} />
        </View>
    );
}
