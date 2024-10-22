import ListaEstabelecimento from '@/src/components/listaEstabelecimento';
import { EstabelecimentoProps } from '@/src/interfaces/estabelecimento';
import { CardConfig } from '@components/cardConfig';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, StatusBar, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';
import SetaVoltar from '@/src/components/setaVoltar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const statusBarHeight = Constants.statusBarHeight;
const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';

export default function HomeEstabelecimento() {
    const [estabelecimentos, setEstabelecimentos] = useState<EstabelecimentoProps[]>([]);
    const { message } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);

    // Função para lidar com o clique em um estabelecimento
    function handleCourtPress(estabelecimento: EstabelecimentoProps): void {
        console.log(`Você clicou no estabelecimento ${estabelecimento.nome}`);
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

    // Carregar os estabelecimentos da API
    const fetchEstabelecimentos = async () => {
        setLoading(true);
        try {
            const access_token = await AsyncStorage.getItem('access_token');
            const response = await fetch(`${apiUrl}/estabelecimento/usuario`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar estabelecimentos');
            }

            const jsonData = await response.json();
            // Certifique-se de que jsonData não contém duplicatas
            const uniqueEstabelecimentos = Array.from(new Set(jsonData.map(item => item.idkey)))
                .map(id => jsonData.find(item => item.idkey === id));
            setEstabelecimentos(uniqueEstabelecimentos);
        } catch (error) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'Erro ao carregar os estabelecimentos',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEstabelecimentos();
    }, []);

    // Rodapé da lista
    const getFooter = () => {
        if (loading) {
            return <ActivityIndicator size="large" color="#FF6600" />;
        }
        return null;
    };

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
            <FlatList
                data={estabelecimentos}
                renderItem={({ item }) => (
                    <ListaEstabelecimento
                        data={item} // Passa o item diretamente
                        onPress={handleCourtPress}
                        options={{ showImage: true, showAvaliacao: false, showPreco: false }}
                    />
                )}
                ListFooterComponent={getFooter}
                keyExtractor={(item) => item.idkey?.toString() || Math.random().toString()} // Certifique-se de que cada idkey é único
                contentContainerStyle={{ paddingBottom: 20 }} // Adiciona um padding se necessário
            />
        </SafeAreaView>
    );
}
