import globalStyles from '@/src/styles/globalStyles';
import { Text, View, StyleSheet, Animated } from 'react-native';
import { useNavigation, useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import CarouselQuadra from '@components/carouselQuadra';
import HorizontalLine from '@components/horizontalLine';
import TextoExpandivel from '@components/textoExpandivel';
import Acomodacoes from '@components/acomodacoes';
import LocationEstabelecimento from '@components/localizacaoEstabelecimento';
import ListaQuadrasEstabelecimento from '@components/listaQuadrasEstabelecimento';
import HorarioEstabelecimento from '@components/horarioEstabelecimento';
import BotaoPressable from '@components/botoes/botaoPressable';
import AvaliacoesEstabelecimento from '@components/avaliacoesEstabelecimento';
import { EstabelecimentoProps } from '@src/interfaces/estabelecimento';

import { QuadraProps } from '@/src/interfaces/quadra';


export default function Estabelecimento() {
    const { estabelecimentoParam } = useLocalSearchParams(); // Obtém o parâmetro 'id' da URL
    const navigation = useNavigation();
    const [scrollY] = useState(new Animated.Value(0));
    const [fadeAnim] = useState(new Animated.Value(0)); // Novo valor animado para a opacidade
    const [estabelecimento, setEstabelecimento] = useState<EstabelecimentoProps>();

    useEffect(() => {
        console.log(JSON.parse(estabelecimentoParam))
        setEstabelecimento(JSON.parse(estabelecimentoParam))
    }, [])

    useEffect(() => {
        const listener = scrollY.addListener(({ value }) => {
            // Atualiza o título do header conforme a rolagem
            if (value > 250) {
                navigation.setOptions({
                    headerTitle: () => (
                        <Animated.Text numberOfLines={1} style={[styles.headerText, { opacity: fadeAnim }]}>
                            { }
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
    }, [scrollY, fadeAnim, navigation]);

    if (estabelecimento == undefined || null) return (<Text>Erro TESTTT</Text>);
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
                <CarouselQuadra imagemQuadra={estabelecimento.image} />

                <View className='px-4 mb-5'>
                    <View className="flex-row py-4">
                        <View className="flex-1 justify-center">
                            <Text numberOfLines={3} className='font-semibold text-2xl color-black'>
                                {estabelecimento.name}
                            </Text>
                        </View>

                        <View className='flex justify-center'>
                            <View className="ml-4 flex justify-center items-center rounded-2xl  bg-secondary h-14 w-14">
                                <Text className='font-semibold text-2xl color-white'>
                                    {estabelecimento.avaliacao}</Text>
                            </View>
                        </View>
                    </View>

                    <Acomodacoes acomodacoes={estabelecimento.acomodacoes} />

                    <HorizontalLine margin={28} />
                    {/* <ListaQuadrasEstabelecimento quadras={estabelecimento.quadras} onClick={() => { }} /> */}

                    <Text className='font-bold text-xl mb-7 mt-2'>Localização do Estabelecimento</Text>
                    <LocationEstabelecimento
                        latitude={estabelecimento.latitude}
                        longitude={estabelecimento.longitude}
                        markerTitle={estabelecimento.name}
                        endereco={estabelecimento.endereco}
                    />

                    <HorizontalLine margin={28} />
                    <Text className='font-bold text-xl mb-7'>Avaliações</Text>
                    <AvaliacoesEstabelecimento
                        idEstabelecimento={estabelecimento.id}
                        avaliacoes={estabelecimento.avaliacoes}
                        avaliacaoMedia={estabelecimento.avaliacao}
                        telaCheia={false}
                    />

                    <Text className='font-bold text-xl mb-7'>Horário de Funcionamento</Text>
                    <HorarioEstabelecimento horarios={estabelecimento.horario} />

                    <HorizontalLine margin={28} />
                    <Text className='font-bold text-xl mb-7'>Sobre nós</Text>
                    <TextoExpandivel className='text-lg' text={estabelecimento.sobre} numberOfLines={5} numberOfChar={200} />

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
                            params: {
                                estabelecimento: JSON.stringify(
                                    {
                                        idKey: 1,
                                        nome: "Beach Park Maringá",
                                        quadras: [
                                            {
                                                idkey: 1,
                                                nome: "Quadra 1",
                                                informacoesAdicionais: "Quadra coberta com iluminação",
                                                valor: "80.50",
                                                largura: "8",
                                                comprimento: "3.90",
                                                tiposEsporte: [
                                                    { idkey: 1, descricao: "tennis" },
                                                    { idkey: 4, descricao: "beach tennis" }
                                                ],
                                                imagens: [{ path: "public-storage/quadra/5ceee16e6e73f59f3876f51c14cd82f6823350b4cd8c85af15d00133e0f546b0.jpeg" }],
                                            },
                                            {
                                                idkey: 2,
                                                nome: "Quadra 2",
                                                informacoesAdicionais: "Quadra de areia para beach volley",
                                                valor: "70.00",
                                                largura: "10",
                                                comprimento: "5.0",
                                                tiposEsporte: [
                                                    { idkey: 2, descricao: "volleyball" },
                                                    { idkey: 4, descricao: "beach tennis" }
                                                ],
                                                imagens: [{ path: "public-storage/quadra/5ceee16e6e73f59f3876f51c14cd82f6823350b4cd8c85af15d00133e0f546b0.jpeg" }],
                                            },
                                            {
                                                idkey: 3,
                                                nome: "Quadra 3",
                                                informacoesAdicionais: "Quadra ao ar livre com vista para o parque",
                                                valor: "90.00",
                                                largura: "9",
                                                comprimento: "4.5",
                                                tiposEsporte: [
                                                    { idkey: 1, descricao: "tennis" }
                                                ],
                                                imagens: [{ path: "public-storage/quadra/5ceee16e6e73f59f3876f51c14cd82f6823350b4cd8c85af15d00133e0f546b0.jpeg" }],
                                            },
                                            {
                                                idkey: 4,
                                                nome: "Quadra 4",
                                                informacoesAdicionais: "Quadra de grama sintética para futebol",
                                                valor: "100.00",
                                                largura: "12",
                                                comprimento: "6.0",
                                                tiposEsporte: [
                                                    { idkey: 3, descricao: "soccer" }
                                                ],
                                                imagens: [{ path: "public-storage/quadra/5ceee16e6e73f59f3876f51c14cd82f6823350b4cd8c85af15d00133e0f546b0.jpeg" }],
                                            },
                                            {
                                                idkey: 5,
                                                nome: "Quadra 5",
                                                informacoesAdicionais: "Quadra com arquibancada",
                                                valor: "120.00",
                                                largura: "10",
                                                comprimento: "5.0",
                                                tiposEsporte: [
                                                    { idkey: 2, descricao: "volleyball" },
                                                    { idkey: 4, descricao: "beach tennis" }
                                                ],
                                                imagens: [{ path: "public-storage/quadra/5ceee16e6e73f59f3876f51c14cd82f6823350b4cd8c85af15d00133e0f546b0.jpeg" }],
                                            },
                                            {
                                                idkey: 6,
                                                nome: "Quadra 6",
                                                informacoesAdicionais: "Quadra com sistema de som",
                                                valor: "85.00",
                                                largura: "8.5",
                                                comprimento: "4.0",
                                                tiposEsporte: [
                                                    { idkey: 1, descricao: "tennis" },
                                                    { idkey: 4, descricao: "beach tennis" }
                                                ],
                                                imagens: [{ path: "public-storage/quadra/5ceee16e6e73f59f3876f51c14cd82f6823350b4cd8c85af15d00133e0f546b0.jpeg" }],
                                            },
                                            {
                                                idkey: 7,
                                                nome: "Quadra 7",
                                                informacoesAdicionais: "Quadra de areia com redes",
                                                valor: "75.00",
                                                largura: "9",
                                                comprimento: "5.0",
                                                tiposEsporte: [
                                                    { idkey: 2, descricao: "volleyball" }
                                                ],
                                                imagens: [{ path: "public-storage/quadra/5ceee16e6e73f59f3876f51c14cd82f6823350b4cd8c85af15d00133e0f546b0.jpeg" }],
                                            },
                                            {
                                                idkey: 8,
                                                nome: "Quadra 8",
                                                informacoesAdicionais: "Quadra de basquete com cestas de regulagem",
                                                valor: "110.00",
                                                largura: "11",
                                                comprimento: "6.0",
                                                tiposEsporte: [
                                                    { idkey: 5, descricao: "basketball" }
                                                ],
                                                imagens: [{ path: "public-storage/quadra/5ceee16e6e73f59f3876f51c14cd82f6823350b4cd8c85af15d00133e0f546b0.jpeg" }],
                                            },
                                            {
                                                idkey: 9,
                                                nome: "Quadra 9",
                                                informacoesAdicionais: "Quadra poliesportiva com grades de proteção",
                                                valor: "95.00",
                                                largura: "10",
                                                comprimento: "6.5",
                                                tiposEsporte: [
                                                    { idkey: 1, descricao: "tennis" },
                                                    { idkey: 2, descricao: "volleyball" },
                                                    { idkey: 4, descricao: "beach tennis" }
                                                ],
                                                imagens: [{ path: "public-storage/quadra/5ceee16e6e73f59f3876f51c14cd82f6823350b4cd8c85af15d00133e0f546b0.jpeg" }],
                                            },
                                            {
                                                idkey: 10,
                                                nome: "Quadra 10",
                                                informacoesAdicionais: "Quadra com iluminação noturna e cobertura",
                                                valor: "130.00",
                                                largura: "10",
                                                comprimento: "5.5",
                                                tiposEsporte: [
                                                    { idkey: 3, descricao: "soccer" },
                                                    { idkey: 2, descricao: "volleyball" }
                                                ],
                                                imagens: [{ path: "public-storage/quadra/5ceee16e6e73f59f3876f51c14cd82f6823350b4cd8c85af15d00133e0f546b0.jpeg" }],
                                            }
                                        ]
                                    }
                                )
                            },
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