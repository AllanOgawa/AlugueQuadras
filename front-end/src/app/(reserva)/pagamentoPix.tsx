import { SafeAreaView, StatusBar, Text, View, Image, Modal, Pressable, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import Constants from 'expo-constants'
import { router, useLocalSearchParams } from 'expo-router';
import SetaVoltar from '@components/setaVoltar';
import Loading from '@components/loading';
import AsyncStorage from '@react-native-async-storage/async-storage';

const bucketUrl = Constants.expoConfig?.extra?.bucketUrl || '';
const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';

export default function PagamentoPix() {
    const {
        idkeyQuadra,
        dataInicio,
        dataFim,
    } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [aprovado, setAprovado] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            reservarQuadra();
        }, 2000);
    }, []);

    async function reservarQuadra() {
        setLoading(true);
        try {
            const access_token = await AsyncStorage.getItem('access_token');
            const response = await fetch(`${apiUrl}/estabelecimento/quadra/reserva/new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
                body: JSON.stringify({
                    idkeyQuadra: Number(idkeyQuadra),
                    dataInicio: dataInicio,
                    dataFim: dataFim
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                Alert.alert(
                    "Falha ao realizar Reserva",
                    String(data.message)
                );
            }
        } catch (error) {
            console.log(error)
            Alert.alert(
                "Erro de Rede",
                String(error)
            );
        } finally {
            setTimeout(() => {
                setLoading(false);
                setAprovado(true);
            }, 2000);
        }
    };

    return (
        <SafeAreaView className='flex-1 bg-white' style={{ marginTop: Constants.statusBarHeight }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <SetaVoltar />
            <View className='flex-1 px-4'>
                <Text className="text-4xl font-semibold mt-5">Pagamento Pix:</Text>
                <View className='items-center mt-24'>
                    <Image className='w-80 h-80' source={{ uri: `${bucketUrl}/public-storage/outros/qrcode.png` }} />
                    <Text className="text-xl font-semibold text-center mt-7">ou copie o código:</Text>
                    <View className='w-[80%] h-24 bg-gray-200 rounded-2xl px-4 py-2'>
                        <Text selectable className='font-semibold'>00020126330017BR.GOV.BCB.PIX01121284545699352040700534398654040.015802BR5911AlugueQUadras6007Maringa62070503***630405F9</Text>
                    </View>
                </View>
            </View>
            {loading && <Loading />}
            <Modal
                transparent
                visible={aprovado}
                animationType="fade"
                onRequestClose={() => { }}
            >
                <View className='flex-1 justify-center items-center bg-black/50'>
                    <View className='w-4/5 bg-white p-6 rounded-lg shadow-lg'>
                        <Text className='text-xl font-semibold text-center mb-4'>
                            Pagamento Aprovado!
                        </Text>
                        <Text className='text-gray-600 text-center mb-6'>
                            Sua reserva foi realizada com sucesso!
                        </Text>
                        <Pressable
                            onPress={() => { router.replace("/(tabs)/inicio") }}
                            className='bg-green-500 rounded-md py-2'
                        >
                            <Text className='text-white text-center text-lg'>Voltar a Tela Inicial</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
