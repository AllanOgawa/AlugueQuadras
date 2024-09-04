import { Pressable, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type MaterialIconName =
    | 'person'
    | 'wallet'
    | 'notifications'
    | 'history'
    | 'keyboard-arrow-right'
// Adicione aqui mais nomes de ícones que você for utilizar

interface CardConfigProps {
    icon: MaterialIconName;
    title: string;
    subtitle: string;
    onPress: () => void;
}

export function CardConfig({ icon, title, subtitle, onPress }: CardConfigProps) {
    return (
        <View>
            <Pressable
                className="h-16 w-full rounded-2xl flex-row items-center justify-between px-4"
                onPress={onPress}
            >
                <View className="flex-row items-center">
                    <MaterialIcons name={icon} size={30} color="black" />
                    <View className="flex-col">
                        <Text className="font-bold text-xl ml-4">{title}</Text>
                        <Text className="text-black text-lg ml-4">{subtitle}</Text>
                    </View>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={30} color="#FF7300" />
            </Pressable>
            <View className="border-b border-gray-300 my-2 mx-8" />
        </View>
    );
}
