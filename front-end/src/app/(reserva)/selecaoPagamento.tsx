import { SafeAreaView, StatusBar, Text, View, Pressable } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import Constants from 'expo-constants'
import { router, useLocalSearchParams } from 'expo-router';
import SetaVoltar from '@components/setaVoltar';
import Loading from '@components/loading';
import HorizontalLine from '@/src/components/horizontalLine';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { UsuarioContext } from '@context/usuarioContext';
import BotaoPressable from '@/src/components/botoes/botaoPressable';

export default function SelecaoPagamento() {
    const {
        data,
        horaInicio,
        horaFim,
        estabelecimento,
        quadra,
    } = useLocalSearchParams();
    const [parsedEstabelecimento, setParsedEstabelecimento] = useState<any>(null);
    const [parsedQuadra, setParsedQuadra] = useState<any>(null);
    const [dataFormatada, setDataFormatada] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [idkeyQuadra, setIdkeyQuadra] = useState("");

    const [loading, setLoading] = useState(true);
    const [logado, setLogado] = useState(false);

    const context = useContext(UsuarioContext);
    if (!context) {
        throw new Error("YourComponent must be used within an ArrayProvider");
    }
    const { usuario } = context;

    useEffect(() => {
        setLoading(true);
        try {
            if (typeof estabelecimento === 'string') {
                setParsedEstabelecimento(JSON.parse(estabelecimento));
            }
            if (typeof quadra === 'string') {
                setParsedQuadra(JSON.parse(quadra));
                setIdkeyQuadra(String(JSON.parse(quadra).idkey));
            }
            if (typeof data === 'string') {
                setDataFormatada(dayjs(data).format("DD/MM/YYYY"));
                setDataInicio(`${dayjs(data).format('YYYY-MM-DD')}T${horaInicio}:00.000Z`);
                setDataFim(`${dayjs(data).format('YYYY-MM-DD')}T${horaFim}:00.000Z`);
            }
        } catch (error) {
            console.error("Erro ao parsear dados:", error);
        }
        setLoading(false);
    }, [estabelecimento]);

    useEffect(() => {
        if (usuario != null && usuario[0] !== null) {
            setLogado(true);
        }
        setLoading(false);
    }, [usuario]);

    if (!logado) {
        return (
            <View>
                <Text className='text-xl text-center p-4 mt-[130px]'>Parece que você ainda não está logado em uma conta, deseja logar?</Text>
                <BotaoPressable
                    title={'Logar'}
                    className='mt-3 bg-primary p-4 rounded-2xl active:bg-secondary mx-4'
                    classNameTitle="text-white text-center text-xl"
                    onPress={() => router.replace('/(usuario)/login')} />
            </View>
        );
    }

    return (
        <SafeAreaView className='flex-1 bg-white' style={{ marginTop: Constants.statusBarHeight }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <SetaVoltar />
            <View className='flex-1 bg-gray-200'>
                <View className='bg-white pb-7'>
                    <Text className="text-xl mt-1 text-center">{parsedEstabelecimento.razaoSocial}</Text>

                    <View className='px-4'>
                        <HorizontalLine margin={8} />
                    </View>
                    <View className='px-5 mt-2'>
                        <Text className="text-2xl text-center font-semibold" numberOfLines={2}>{parsedEstabelecimento.nome} - {parsedQuadra.nome}</Text>
                        <Text className="text-2xl text-center font-semibold mt-1">R$ {Number(parsedQuadra.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                        <Text className="text-2xl text-center mt-2">{dataFormatada} • {horaInicio}h - {horaFim}h</Text>

                    </View>
                </View>

                <Text className='pl-4 text-xl font-semibold mt-20 color-black'>Como você prefere pagar?</Text>

                <Pressable
                    onPress={() => {
                        router.push({
                            pathname: '/(reserva)/pagamentoPix',
                            params: {
                                idkeyQuadra: idkeyQuadra,
                                dataInicio: dataInicio,
                                dataFim: dataFim
                            },
                        })
                    }}
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
            {loading && <Loading cobrirTela={true} />}
        </SafeAreaView>
    );
}
