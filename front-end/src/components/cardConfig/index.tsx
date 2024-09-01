import { estilo } from '@/src/styles/style';
import { Pressable, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export function CardConfig() {
    return (
        <View className="mt-5 mb-4">
            <View className="flex-col">
                <Pressable
                    className="h-20 w-full rounded-2xl flex-row items-center justify-between px-4"
                    onPress={() => console.log("Clicou filtro Beach Tennis")}
                >
                    <View className="flex-row items-center">
                        <MaterialIcons name="person" size={35} color="black" />
                        <View className='flex-col'>
                            <Text className="font-bold text-xl ml-4">Minha conta</Text>
                            <Text className="text-black text-xl ml-4">Meus dados</Text>
                        </View>
                    </View>
                    <MaterialIcons name="keyboard-arrow-right" size={30} color="#FF7300" />
                </Pressable>
                <View className="border-b border-gray-300 my-2 mx-8" />

                <Pressable
                    className="h-20 w-full rounded-2xl flex-row items-center justify-between px-4"
                    onPress={() => console.log("Clicou filtro Beach Tennis")}
                >
                    <View className="flex-row items-center">
                        <MaterialIcons name="wallet" size={35} color="black" />
                        <View className='flex-col'>
                            <Text className="font-bold text-xl ml-4">Pagamentos</Text>
                            <Text className="text-black text-xl ml-4">Informações de pagamento</Text>
                        </View>
                    </View>
                    <MaterialIcons name="keyboard-arrow-right" size={30} color="#FF7300" />
                </Pressable>
                <View className="border-b border-gray-300 my-2 mx-8" />

                <Pressable
                    className="h-20 w-full rounded-2xl flex-row items-center justify-between px-4"
                    onPress={() => console.log("Clicou filtro Beach Tennis")}
                >
                    <View className="flex-row items-center">
                        <MaterialIcons name="notifications" size={35} color="black" />
                        <View className='flex-col'>
                            <Text className="font-bold text-xl ml-4">Notificações</Text>
                            <Text className="text-black text-xl ml-4">Minha central de notificações</Text>
                        </View>
                    </View>
                    <MaterialIcons name="keyboard-arrow-right" size={30} color="#FF7300" />
                </Pressable>
                <View className="border-b border-gray-300 my-2 mx-8" />

                <Pressable
                    className="h-20 w-full rounded-2xl flex-row items-center justify-between px-4"
                    onPress={() => console.log("Clicou filtro Beach Tennis")}
                >
                    <View className="flex-row items-center">
                        <MaterialIcons name="history" size={35} color="black" />
                        <View className='flex-col'>
                            <Text className="font-bold text-xl ml-4">Histórico</Text>
                            <Text className="text-black text-xl ml-4">Meu histórico de alocações</Text>
                        </View>
                    </View>
                    <MaterialIcons name="keyboard-arrow-right" size={30} color="#FF7300" />
                </Pressable>
                <View className="border-b border-gray-300 my-2 mx-8" />
                
            </View>
        </View>
    );
}