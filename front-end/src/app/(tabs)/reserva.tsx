import { Alert, SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native'
import ListaReservas from '@components/listaReservas'
import Constants from 'expo-constants'
import { useContext, useEffect, useState } from 'react';
import Loading from '@components/loading';
import { ReservasProps } from '@/src/interfaces/reservas';
import { UsuarioContext } from '@/src/context/usuarioContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BotaoPressable from '@/src/components/botoes/botaoPressable';
import { router } from 'expo-router';

const statusBarHeight = Constants.statusBarHeight;
const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';

export default function Reserva() {
	const [loading, setLoading] = useState(true);
	const [logado, setLogado] = useState(false);
	const [reservas, setReservas] = useState<ReservasProps[]>([]);

	const context = useContext(UsuarioContext);
	if (!context) {
		throw new Error("YourComponent must be used within an ArrayProvider");
	}
	const { usuario } = context;

	useEffect(() => {
		if (usuario != null && usuario[0] !== null) {
			setLogado(true);
		}
		setLoading(false);
	}, [usuario]);

	useEffect(() => {
		if (logado)
			buscaReservas();
	}, [logado]);

	async function buscaReservas() {
		setLoading(true);
		try {
			const access_token = await AsyncStorage.getItem('access_token');
			const response = await fetch(`${apiUrl}/estabelecimento/quadra/reserva/list`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${access_token}`,
				},
			});

			const data = await response.json();
			if (response.ok) {
				setReservas(data);
			} else {
				// Alert.alert(
				//     "Falha ao buscar Reservas",
				//     data.message
				// );
			}
		} catch (error) {
			Alert.alert(
				"Erro de Rede",
				String(error)
			);
		} finally {
			setLoading(false);
		}
	};

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
		<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
			<StatusBar barStyle="dark-content" backgroundColor="white" />
			<ScrollView
				style={{ flex: 1 }}
				showsVerticalScrollIndicator={false}
			>
				<View
					style={{ flex: 1, marginTop: statusBarHeight + 8 }}
					className="bg-white w-full px-4"
				>
					<Text className="text-4xl font-semibold mt-3">Reservas</Text>
					<ListaReservas reservas={reservas} />
				</View>
			</ScrollView>
			{loading && <Loading />}

		</SafeAreaView>
	);
}
