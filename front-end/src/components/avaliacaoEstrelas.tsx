import { FontAwesome } from '@expo/vector-icons';
import { View } from 'react-native';
import { Colors } from '@src/constants/Colors';

export default function AvaliacaoEstrelas({ avaliacao }: { avaliacao: number }) {
    const stars = Array(5).fill(0);

    const getTipoEstrela = (index: number) => {
        if (avaliacao >= index + 1) {
            return 'star'; // Estrela inteira
        } else if (avaliacao >= index + 0.5) {
            return 'star-half-full'; // Meia estrela
        } else {
            return 'star-o'; // Estrela vazia
        }
    };

    return (
        <View className="flex flex-row space-x-1">
            {stars.map((item, index) => (
                <FontAwesome
                    key={index}
                    name={getTipoEstrela(index)}
                    size={32}
                    color={Colors.secondary}
                />
            ))}
        </View>
    );
}
