import { SafeAreaView, StatusBar, Text, View, Pressable } from 'react-native';
import { useState } from 'react';
import Constants from 'expo-constants'
import { router } from 'expo-router';
import SetaVoltar from '@components/setaVoltar';
import Loading from '@components/loading';
import HorizontalLine from '@/src/components/horizontalLine';
import IconUsuario from '@/src/components/iconUsuario';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import DatePicker from '@/src/components/selecionaData';

const { bucketUrl } = Constants.expoConfig.extra;

export default function SelecaoPagamento() {
    const [loading, setLoading] = useState(false);
    const handleDateSelect = (selectedDate: Date) => {
        // Trate a data selecionada aqui
        console.log('Data selecionada:', selectedDate.toDateString());
    };

    return (
        <SafeAreaView className='flex-1 bg-white' style={{ marginTop: Constants.statusBarHeight }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            {/* <SetaVoltar /> */}
            <View style={{ flex: 1 }}>
                {/* Chamada do componente DatePicker */}
                <DatePicker
                    minDate={new Date('2024-01-01')} // Define a data mínima
                    maxDate={new Date('2024-12-31')} // Define a data máxima
                    onDateSelect={handleDateSelect} // Função para tratar a data selecionada
                />

                {/* Conteúdo principal da tela */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Selecione uma data no componente acima</Text>
                </View>
            </View>
            <View className='flex-1 bg-gray-200'>
                <View className='bg-white pb-6'>
                    <Text className="text-3xl font-semibold mt-5 text-center">ALUGUEQUADRAS LTDA</Text>

                    <View className=' px-4'>
                        <HorizontalLine margin={16} />
                    </View>
                    <Text className="text-3xl mt-1 text-center">R$80,00</Text>
                </View>

                <Text className='pl-4 text-xl font-semibold mt-20 color-black'>Como você prefere pagar?</Text>

                <Pressable
                    onPress={() => { router.push("/(reserva)/pagamentoPix") }}
                    className='bg-roxo active:bg-roxo/80 rounded-2xl mx-4 my-2 h-20 px-5 flex-row items-center justify-between'
                >
                    <View className='flex-row items-center'>
                        <FontAwesome6 name="pix" size={30} color="white" />
                        <Text className='text-white text-xl font-bold ml-8'>Pix</Text>
                    </View>
                    <MaterialIcons name="keyboard-arrow-right" size={30} color="white" />
                </Pressable>

                <Pressable
                    onPress={() => { }}
                    className='bg-roxo active:bg-roxo/80 rounded-2xl mx-4 my-2 h-20 px-5 flex-row items-center justify-between'
                >
                    <View className='flex-row items-center'>
                        <FontAwesome6 name="credit-card" size={30} color="white" />
                        <Text className='text-white text-xl font-bold ml-8'>Cartão de Débito</Text>
                    </View>
                    <MaterialIcons name="keyboard-arrow-right" size={30} color="white" />
                </Pressable>

                <Pressable
                    onPress={() => { }}
                    className='bg-roxo active:bg-roxo/80 rounded-2xl mx-4 my-2 h-20 px-5 flex-row items-center justify-between'
                >
                    <View className='flex-row items-center'>
                        <FontAwesome6 name="credit-card" size={30} color="white" />
                        <Text className='text-white text-xl font-bold ml-8'>Cartão de Crédito</Text>
                    </View>
                    <MaterialIcons name="keyboard-arrow-right" size={30} color="white" />
                </Pressable>

            </View>
            {loading && <Loading />}
        </SafeAreaView>
    );
}
