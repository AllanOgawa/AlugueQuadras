import { SafeAreaView, StatusBar, Text, View, Image, Modal, Pressable, Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';
import Constants from 'expo-constants'
import { router, useLocalSearchParams } from 'expo-router';
import SetaVoltar from '@components/setaVoltar';
import Loading from '@components/loading';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HorizontalLine from '@/src/components/horizontalLine';
import LocalizacaoEstabelecimento from '@/src/components/localizacaoEstabelecimento';
import BotaoTouchableOpacity from '@/src/components/botoes/botaoTouchableOpacity';

const bucketUrl = Constants.expoConfig?.extra?.bucketUrl || '';
const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';

dayjs.extend(utc);

dayjs.extend(localizedFormat);

export default function DetalhesReserva() {
    const { reserva } = useLocalSearchParams();
    const [parsedReserva, setParsedReserva] = useState<any>(null);
    const [parsedEstabelecimento, setParsedEstabelecimento] = useState<any>(null);
    const [parsedQuadra, setParsedQuadra] = useState<any>(null);
    const [cancelavel, setCancelavel] = useState(false);
    const [avaliavel, setAvaliavel] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        setLoading(true);
        try {
            if (typeof reserva === 'string') {
                setParsedReserva(JSON.parse(reserva));
                setParsedQuadra(JSON.parse(reserva).quadra);
                setParsedEstabelecimento(JSON.parse(reserva).quadra.estabelecimento);
            }
        } catch (error) {
            console.error("Erro ao parsear dados:", error);
        }
        setLoading(false);
    }, [reserva]);

    useEffect(() => {
        setLoading(true);
        try {
            if (parsedReserva) {
                const agora = dayjs(`${dayjs().local().format("YYYY-MM-DD")}T${dayjs().local().format("HH:mm:ss")}.000Z`);
                if (dayjs.utc(parsedReserva.dataInicio).isAfter(agora)) {
                    setCancelavel(true);
                }
                if (dayjs.utc(parsedReserva.dataFim).isBefore(agora)) {
                    setAvaliavel(true);
                }
            }
        } catch (error) {
            console.error("Erro ao parsear dados:", error);
        }
        setLoading(false);
    }, [parsedReserva]);

    async function cancelarReserva() {
        setModalVisible(false);
        setLoading(true);
        const access_token = await AsyncStorage.getItem('access_token');
        await fetch(`${apiUrl}/estabelecimento/quadra/reserva/cancelar/${parsedReserva.idkey}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        });
        setLoading(false);
        router.replace('/(tabs)/reserva');
    }


    if (parsedReserva && parsedEstabelecimento && parsedQuadra)
        return (
            <SafeAreaView className='flex-1 bg-white' style={{ marginTop: Constants.statusBarHeight }}>
                <StatusBar barStyle="dark-content" backgroundColor="white" />
                <SetaVoltar />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    className='flex-1 px-4'
                >
                    <Text className="text-4xl font-semibold mt-3 mb-2 px-2">Detalhes da Reserva</Text>
                    <HorizontalLine margin={14} />

                    <View>
                        <Text className='font-bold text-xl mb-5'>Estabelecimento</Text>
                        <View className='flex flex-row w-full'>
                            <Image
                                source={{ uri: `${bucketUrl}/${parsedEstabelecimento.imagens[0].path}` }}
                                className='w-[9rem] h-[9rem] rounded-2xl'
                            />
                            <View className='ml-3 flex-1'>
                                <View className='flex-1'>
                                    <Text className='text-xl leading-5 font-bold mt-1' numberOfLines={2}>
                                        {parsedEstabelecimento.nome}
                                    </Text>
                                    <Text className='text-sm leading-4 mt-1 color-gray-600' numberOfLines={3}>
                                        {parsedEstabelecimento.acomodacoes.map((acomodacao: { descricao: string | number; }, index: number) => (
                                            (index === 0 ? '' : ', ') + acomodacao.descricao
                                        ))}
                                    </Text>
                                </View>
                                <BotaoTouchableOpacity
                                    title={'Página do Estabelecimento'}
                                    className=' bg-primary p-2 rounded-2xl active:bg-secondary h-10'
                                    classNameTitle="text-white text-center text-base"
                                    onPress={() => router.push({
                                        pathname: '/(estabelecimento)/detalhes',
                                        params: { idEstabelecimento: parsedEstabelecimento.idkey },
                                    })} />
                                <View>
                                </View>
                            </View>
                        </View>
                    </View>

                    <HorizontalLine margin={14} />
                    <View>
                        <Text className='font-bold text-xl mb-5'>Quadra Alugada</Text>
                        <View className='flex flex-row w-full'>
                            <Image
                                source={{ uri: `${bucketUrl}/${parsedQuadra.imagens[0].path}` }}
                                className='w-[9rem] h-[9rem] rounded-2xl'
                            />
                            <View className='ml-3 flex-1'>
                                <View className="flex-1">
                                    <Text className='text-xl leading-5 font-bold mt-1' numberOfLines={2}>
                                        {parsedQuadra.nome}
                                    </Text>
                                    <Text className='text-sm leading-4 mt-1 color-gray-600' numberOfLines={2}>
                                        {parsedQuadra.tiposEsporte.map((esporte: { descricao: string | number; }, index: number) => (
                                            (index === 0 ? '' : ', ') + esporte.descricao
                                        ))}
                                    </Text>
                                </View>
                                <View>
                                    <Text className='text-sm leading-4 color-gray-600' numberOfLines={1}>
                                        Dimensões: {parsedQuadra.comprimento}m x {parsedQuadra.largura}m
                                    </Text>
                                    {parsedQuadra.coberta && (
                                        <Text className='text-sm leading-4 color-gray-600' numberOfLines={2}>
                                            Quadra Coberta
                                        </Text>
                                    )}
                                    {parsedQuadra.informacoesAdicionais && (
                                        <Text className='text-sm leading-4 color-gray-600' numberOfLines={2}>
                                            {parsedQuadra.informacoesAdicionais}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        </View>
                    </View>

                    <HorizontalLine margin={14} />
                    <View className='mb-4'>
                        <View className='flex items-center'>
                            <Text className='font-bold text-xl'>Valor</Text>
                            <View className='w-[90%] h-12 bg-roxo rounded-2xl flex justify-center'>
                                <Text className='text-white text-xl text-center'>R$ {Number(parsedQuadra.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                            </View>
                        </View>
                        <View className='flex items-center'>
                            <Text className='font-bold text-xl mt-2'>Data e Hora</Text>
                            <View className='w-[90%] h-12 bg-roxo rounded-2xl flex-row justify-between px-8 items-center'>
                                <Text className='text-white text-xl text-center'>{dayjs.utc(parsedReserva.dataInicio).format('DD/MM/YYYY')}</Text>
                                <Text className='text-white text-xl text-center'>{dayjs.utc(parsedReserva.dataInicio).format('HH:mm')} - {dayjs.utc(parsedReserva.dataFim).format('HH:mm')}</Text>
                            </View>
                        </View>
                    </View>

                    <HorizontalLine margin={14} />
                    <View>
                        <Text className='font-bold text-xl mb-5'>Localização do Estabelecimento</Text>
                        <LocalizacaoEstabelecimento
                            markerTitle={parsedEstabelecimento.nome}
                            endereco={parsedEstabelecimento.endereco}
                        />
                    </View>

                    <HorizontalLine margin={14} />
                    {cancelavel &&
                        <BotaoTouchableOpacity
                            title={'Cancelar Reserva'}
                            className='bg-red-600 p-4 rounded-2xl active:bg-red-800 mx-1 mb-5'
                            classNameTitle="text-white text-center text-2xl"
                            onPress={() => setModalVisible(true)}
                        />
                    }
                </ScrollView>
                {loading && <Loading />}

                {/* Modal de Confirmação */}
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Deseja realmente Cancelar a sua Reserva?</Text>
                            <View style={styles.modalActions}>
                                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                                    <Text style={styles.cancelText}>Voltar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={cancelarReserva} style={styles.confirmButton}>
                                    <Text style={styles.confirmText}>Cancelar Reserva</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 8,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#ddd',
        borderRadius: 5,
        marginRight: 10,
    },
    confirmButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#FF6600',
        borderRadius: 5,
    },
    cancelText: {
        fontSize: 16,
        color: 'black',
    },
    confirmText: {
        fontSize: 16,
        color: 'white',
    },
});