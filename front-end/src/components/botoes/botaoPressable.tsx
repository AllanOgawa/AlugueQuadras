import { Pressable, Text, ViewStyle } from 'react-native';

interface CustomButtonProps {
    title: string;
    style: string; // ClassName do Tailwind
    onPress: () => void;
    customStyles?: ViewStyle; // Estilos personalizados para sombra ou outras propriedades
}

export default function BotaoPressable({ title, style, onPress, customStyles }: CustomButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            className={style}
            style={customStyles} // Passando o estilo para o Pressable
        >
            <Text className="text-white text-center text-xl">{title}</Text>
        </Pressable>
    );
};

