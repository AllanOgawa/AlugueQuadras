import { View, Text, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AcomodacoesProps } from '@src/interfaces/acomodacoes';

export default function Acomodacoes({ acomodacoes }: { acomodacoes: AcomodacoesProps[] }) {
    return (
        <View className='mt-7'>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={(acomodacoes.length < 5) ?
                    { flex: 1, justifyContent: 'space-around', }
                    :
                    {}
                }
            >
                {acomodacoes.map((item, index) => (
                    <View key={index} className="items-center mx-2 w-16">
                        <View className="w-16 h-16 rounded-full bg-gray-200 items-center justify-center">
                            <MaterialIcons name={item.icon} size={24} color="black" />
                        </View>
                        <Text className="mt-2 text-center text-sm" numberOfLines={2}>{item.text}</Text>
                    </View>
                ))}
            </ScrollView>
        </View >
    );
}
