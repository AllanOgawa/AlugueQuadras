import ListaEstabelecimento from '@/src/components/listaEstabelecimento';
import { CardConfig } from '@components/cardConfig';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, SafeAreaView, StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';
import SetaVoltar from '@/src/components/setaVoltar';

const statusBarHeight = Constants.statusBarHeight;

export default function HomeEstabelecimento() {
    const { message } = useLocalSearchParams();

    // Função para lidar com o clique em um estabelecimento
    function handleEstablishmentPress(estabelecimento) {
        console.log(`Você clicou no estabelecimento ${estabelecimento.nome}`);
        // Você pode redirecionar ou fazer outras ações aqui
    }

    // Exibir toast com a mensagem, se disponível
    useEffect(() => {
        if (message) {
            const toastMessage = Array.isArray(message) ? message.join(', ') : message;
            Toast.show({
                type: 'success',
                text1: toastMessage,
            });
        }
    }, [message]);

    return (
        <SafeAreaView className="flex-1 bg-white" style={{ marginTop: statusBarHeight }}>
            <SetaVoltar />
            <View className='mx-3'>
                <StatusBar barStyle="dark-content" backgroundColor="white" />
                <CardConfig
                    icon={'add-circle-outline'}
                    title={'Novo Estabelecimento'}
                    subtitle={'Cadastrar um novo estabelecimento'}
                    style='h-16 w-full rounded-2xl flex-row items-center justify-between'
                    onPress={() => router.push('/cadastrar')}
                />
                <CardConfig
                    icon={'create'}
                    title={'Editar Estabelecimento'}
                    subtitle={'Editar um estabelecimento'}
                    style='h-16 w-full rounded-2xl flex-row items-center justify-between'
                    onPress={() => router.push('/editar')}
                />
                <CardConfig
                    icon={'highlight-remove'}
                    title={'Remover Estabelecimento'}
                    subtitle={'Remover um estabelecimento'}
                    style='h-16 w-full rounded-2xl flex-row items-center justify-between'
                    onPress={() => router.push('/remover')}
                />
                <Text className='font-normal text-3xl pt-5 pb-3'>Ativas</Text>
            </View>

            <ListaEstabelecimento
                onPress={handleEstablishmentPress}
                options={{
                    showImage: true,
                    showAvaliacao: true,
                    showPreco: true,
                    showAcomodacoes: true,
                }}
            />
        </SafeAreaView>
    );
}
