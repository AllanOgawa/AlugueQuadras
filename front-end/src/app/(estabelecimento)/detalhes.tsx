import globalStyles from '@/src/styles/globalStyles';
import { Text, View, StyleSheet, Animated, ScrollView } from 'react-native';
import { useNavigation, useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import CarouselQuadra from '@components/carouselQuadra';
import HorizontalLine from '@components/horizontalLine';
import TextoExpandivel from '@components/textoExpandivel';
import Acomodacoes from '@components/acomodacoes';
import LocationEstabelecimento from '@components/localizacaoEstabelecimento';
import HorarioEstabelecimento from '@components/horarioEstabelecimento';
import BotaoPressable from '@components/botoes/botaoPressable';
import AvaliacoesEstabelecimento from '@components/avaliacoesEstabelecimento';
import { EstabelecimentoProps } from '@src/interfaces/estabelecimento';
import Constants from 'expo-constants';
import Loading from '@/src/components/loading';
import ListaQuadras from '@/src/components/listaQuadras';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';

export default function Estabelecimento() {
    const { idEstabelecimento } = useLocalSearchParams(); // Obtém o parâmetro 'id' da URL
    const navigation = useNavigation();
    const [scrollY] = useState(new Animated.Value(0));
    const [fadeAnim] = useState(new Animated.Value(0)); // Novo valor animado para a opacidade
    const [estabelecimento, setEstabelecimento] = useState<EstabelecimentoProps>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getEstabelecimento();
    }, [])

    useEffect(() => {
        const listener = scrollY.addListener(({ value }) => {
            // Atualiza o título do header conforme a rolagem
            if (value > 250) {
                navigation.setOptions({
                    headerTitle: () => (
                        <Animated.Text numberOfLines={1} style={[styles.headerText, { opacity: fadeAnim }]}>
                            {estabelecimento?.nome || ""}
                        </Animated.Text>
                    ),
                });
                // Faz o fade in da opacidade quando passa dos 50px
                Animated.timing(fadeAnim, {
                    toValue: 1, // Alvo da opacidade (1: completamente visível)
                    duration: 25, // Duração do fade in
                    useNativeDriver: true,
                }).start();
            } else {
                // Faz o fade out da opacidade quando a rolagem é menor que 50px
                Animated.timing(fadeAnim, {
                    toValue: 0, // Alvo da opacidade (0: invisível)
                    duration: 25, // Duração do fade out
                    useNativeDriver: true,
                }).start();
            }
        });
        return () => {
            scrollY.removeListener(listener);
        };
    }, [scrollY, fadeAnim, navigation, estabelecimento]);

    async function getEstabelecimento() {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/estabelecimento/search?idkey=${idEstabelecimento}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const responseJson = await response.json();
            const data = responseJson.data && responseJson.data.length > 0 ? responseJson.data[0] : null;

            if (!response.ok) throw new Error('Erro ao buscar estabelecimento');

            console.log("data", data);
            setEstabelecimento(data);
        } catch (error) {
            console.error('Erro ao buscar estabelecimentos:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <Loading />; // Mostra o componente de carregamento enquanto busca os dados
    }

    if (!estabelecimento) {
        return (
            <View className='flex-1 justify-center items-center'>
                <Text>Nenhum dado disponível</Text>
            </View>
        );
    } else console.log(estabelecimento.horariosFuncionamento)

    return (
        <View className='flex-1'>
            <Animated.ScrollView
                style={{ flex: 1 }}
                className="bg-white"
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
            >
                <CarouselQuadra imagemQuadra={estabelecimento.imagens} />

                <View className='px-4 mb-5'>
                    <View className="flex-row py-4">
                        <View className="flex-1 justify-center">
                            <Text numberOfLines={3} className='font-semibold text-2xl color-black'>
                                {estabelecimento.nome}
                            </Text>
                        </View>

                        <View className='flex justify-center'>
                            <View className="ml-4 flex justify-center items-center rounded-2xl  bg-secondary h-14 w-14">
                                <Text className='font-semibold text-2xl color-white'>
                                    {/* {estabelecimento.avaliacao} */}
                                    {4.5}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {estabelecimento.acomodacoes &&
                        <Acomodacoes acomodacoes={estabelecimento.acomodacoes} />}


                    <HorizontalLine margin={28} />
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {estabelecimento.quadras && estabelecimento.quadras.length > 0 ? (
                            <ListaQuadras
                                quadras={estabelecimento.quadras}
                                showTitle={true}
                                onClick={(quadra) => { }}
                            />
                        ) : (
                            <Text className="text-center color-gray-600">Nenhuma quadra cadastrada.</Text>
                        )}
                    </ScrollView>
                    <View className='mt-4' />
                    {estabelecimento.endereco &&
                        <View>
                            <Text className='font-bold text-xl mb-5 mt-2'>Localização do Estabelecimento</Text>
                            <LocationEstabelecimento
                                markerTitle={estabelecimento.nome}
                                endereco={estabelecimento.endereco}
                            />
                        </View>
                    }

                    <HorizontalLine margin={28} />
                    {/* <Text className='font-bold text-xl mb-7'>Avaliações</Text> */}
                    {/* <AvaliacoesEstabelecimento
                        idEstabelecimento={estabelecimento.id}
                        avaliacoes={estabelecimento.avaliacoes}
                        avaliacaoMedia={estabelecimento.avaliacao}
                        telaCheia={false}
                    /> */}

                    <Text className='font-bold text-xl mb-5'>Horário de Funcionamento</Text>
                    <HorarioEstabelecimento horarios={estabelecimento.horariosFuncionamento} />

                    {estabelecimento.sobre &&
                        <View>
                            <HorizontalLine margin={28} />
                            <Text className='font-bold text-xl mb-5'>Sobre nós</Text>
                            <TextoExpandivel className='text-lg' text={estabelecimento.sobre} numberOfLines={5} numberOfChar={200} />
                        </View>
                    }

                    <View>
                        <HorizontalLine margin={28} />
                        <Text className='font-bold text-xl mb-5'>Nosso Contato</Text>

                    </View>
                </View>
            </Animated.ScrollView>

            <View style={globalStyles.buttonContainer}>
                <BotaoPressable
                    title={'Alugar Quadra'}
                    className='bg-primary p-4 rounded-2xl active:bg-secondary mx-4'
                    classNameTitle="text-white text-center text-xl"
                    onPress={() => {
                        router.push({
                            pathname: '/(reserva)/selecaoQuadra',
                            params: { estabelecimento: JSON.stringify({}) },
                        })
                    }}
                />
            </View>
        </View>
    );

}
const styles = StyleSheet.create({
    headerText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
        maxWidth: 300
    }
});