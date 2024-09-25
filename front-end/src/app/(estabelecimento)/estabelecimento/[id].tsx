import { Text, View, StyleSheet, Animated } from 'react-native';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import CarouselQuadra from '@components/carouselQuadra';
import HorizontalLine from '@components/horizontalLine';
import ExpandableText from '@components/expandableText';
import Acomodacoes from '@components/acomodacoes';
import LocationEstabelecimento from '@components/localizacaoEstabelecimento';
import { EstabelecimentoProps } from '@src/interfaces/estabelecimento';
import ListaQuadrasEstabelecimento from '@components/listaQuadrasEstabelecimento';
import HorarioEstabelecimento from '@components/horarioEstabelecimento';
import BotaoCustom from '@components/botaoCustom';

import * as data from '@/db.json';
import { QuadraProps } from '@/src/interfaces/quadra';


export default function Estabelecimento() {
	const { id } = useLocalSearchParams(); // Obtém o parâmetro 'id' da URL
	const navigation = useNavigation();
	const [scrollY] = useState(new Animated.Value(0));
	const [fadeAnim] = useState(new Animated.Value(0)); // Novo valor animado para a opacidade
	const [estabelecimento, setEstabelecimento] = useState<EstabelecimentoProps>()

	useEffect(() => {
		setEstabelecimento(data.estabelecimento.find(item => item.id == id))
	}, [])

	useEffect(() => {
		const listener = scrollY.addListener(({ value }) => {
			// Atualiza o título do header conforme a rolagem
			if (value > 250) {
				navigation.setOptions({
					headerTitle: () => (
						<Animated.Text numberOfLines={1} style={[styles.headerText, { opacity: fadeAnim }]}>
							{data.estabelecimento.find(item => item.id == id)?.name}
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

				<View className='px-4'>
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
					<ListaQuadrasEstabelecimento quadras={estabelecimento.quadras} onClick={() => { }} />

					<Text className='font-bold text-xl mb-7'>Localização do Estabelecimento</Text>
					<LocationEstabelecimento
						latitude={estabelecimento.latitude}
						longitude={estabelecimento.longitude}
						markerTitle={estabelecimento.name}
						endereco={estabelecimento.endereco}
					/>

					<HorizontalLine margin={28} />
					<Text className='font-bold text-xl mb-7'>Horário de Funcionamento</Text>
					<HorarioEstabelecimento horarios={estabelecimento.horario} />

					<HorizontalLine margin={28} />
					<Text className='font-bold text-xl mb-7'>Sobre nós</Text>
					<ExpandableText text={estabelecimento.sobre} numberOfLines={5} numberOfChar={200} />

				</View>
			</Animated.ScrollView>

			<View style={styles.buttonContainer}>
				<BotaoCustom
					title={'Alugar Quadra'}
					style='bg-primary p-4 rounded-2xl active:bg-secondary mx-4'
					onPress={() => { }}
				/>
			</View>

		</View>
	);
}
const styles = StyleSheet.create({

	buttonContainer: {
		backgroundColor: '#', // Tailwind slate-800
		paddingVertical: 8,
		justifyContent: 'flex-end',

	},
	headerText: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#000",
		maxWidth: 300
	}
});