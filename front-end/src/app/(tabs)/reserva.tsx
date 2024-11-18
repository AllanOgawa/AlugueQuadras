import { Alert, Pressable, SafeAreaView, ScrollView, StatusBar, Text, View, Image } from 'react-native'
import Constants from 'expo-constants'
import { useContext, useEffect, useState } from 'react';
import Loading from '@components/loading';
import { ReservasProps } from '@/src/interfaces/reservas';
import { UsuarioContext } from '@/src/context/usuarioContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BotaoPressable from '@/src/components/botoes/botaoPressable';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { router } from 'expo-router';
import HorizontalLine from '@/src/components/horizontalLine';
import AvaliacaoEstrelas from '@/src/components/avaliacaoEstrelas';

const statusBarHeight = Constants.statusBarHeight;
const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';
const bucketUrl = Constants.expoConfig?.extra?.bucketUrl || '';

dayjs.extend(utc);

export default function Reserva() {
	const [loading, setLoading] = useState(true);
	const [logado, setLogado] = useState(false);
	const [reservas, setReservas] = useState<ReservasProps[]>([]);
	const [reservasAtivas, setReservasAtivas] = useState<ReservasProps[]>([]);
	const [reservasHistorico, setReservasHistorico] = useState<ReservasProps[]>([]);

	const context = useContext(UsuarioContext);
	if (!context) {
		throw new Error("YourComponent must be used within an ArrayProvider");
	}
	const { usuario } = context;

	useEffect(() => {
		if (usuario != null && usuario.length > 0 && usuario[0] !== null) {
			setLogado(true);
		}
		setLoading(false);
	}, [usuario]);

	useEffect(() => {
		if (reservas.length > 0) {
			setLoading(true);
			const agora = dayjs(`${dayjs().local().format("YYYY-MM-DD")}T${dayjs().local().format("HH:mm:ss")}.000Z`);
			setReservasAtivas(reservas
				.filter(reserva => !reserva.cancelada)
				.filter(reserva => dayjs.utc(reserva.dataFim).isAfter(agora))
			);
			setReservasHistorico(reservas
				.filter(reserva => !reserva.cancelada)
				.filter(reserva => dayjs.utc(reserva.dataFim).isBefore(agora))
				.concat(reservas.filter(reserva => reserva.cancelada))
			);
			setLoading(false);
		}
	}, [reservas]);

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
			<View className='bg-white flex-1 justify-center'>
				<Text className='text-xl text-center p-4'>Parece que você ainda não está logado em uma conta, deseja logar?</Text>
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
					<SafeAreaView>
						<Text className="text-2xl font-semibold mt-5">Ativos</Text>
						<HorizontalLine margin={10} />
						{reservasAtivas.map((reserva) => (
							<View key={reserva.idkey}>
								<Pressable onPress={() => {
									router.navigate({
										pathname: '/(reserva)/detalhes',
										params: {
											reserva: JSON.stringify(reserva),
										},
									});
								}} className='flex flex-row w-full'>
									<View className='flex-1 pr-1'>
										<View className='flex-1'>
											<Text className='text-lg font-bold color-primary' numberOfLines={2}>{reserva.quadra.estabelecimento?.nome}</Text>
											<Text className='text-sm text-gray-500' numberOfLines={2}>
												{reserva.quadra.estabelecimento?.endereco.logradouro}, {reserva.quadra.estabelecimento?.endereco.numero} - {reserva.quadra.estabelecimento?.endereco.cidade} - {reserva.quadra.estabelecimento?.endereco.estado.toUpperCase()}
											</Text>
										</View>
										<View>
											<Text numberOfLines={1} className='font-semibold'>{reserva.quadra.nome}</Text>
											<Text numberOfLines={1}>{dayjs.utc(reserva.dataInicio).format('DD/MM/YYYY')} • {dayjs.utc(reserva.dataInicio).format('HH:mm')} - {dayjs.utc(reserva.dataFim).format('HH:mm')}</Text>
											<Text numberOfLines={1}>R$ {Number(reserva.quadra.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
										</View>
									</View>
									<Image
										source={{ uri: `${bucketUrl}/${reserva.quadra.estabelecimento?.imagens[0].path}` }}
										className="h-40 w-40 rounded-2xl"
									/>
								</Pressable>
								<HorizontalLine margin={14} />
							</View>
						))}

						<Text className="text-2xl font-semibold mt-5">Histórico</Text>
						<HorizontalLine margin={10} />
						{reservasHistorico.map((reserva) => (
							<View key={reserva.idkey}>
								<Pressable onPress={() => {
									router.navigate({
										pathname: '/(reserva)/detalhes',
										params: {
											reserva: JSON.stringify(reserva),
										},
									});
								}} className='flex flex-row w-full'>
									<Image
										source={{ uri: `${bucketUrl}/${reserva.quadra.estabelecimento?.imagens[0].path}` }}
										className="h-[134px] w-[134px] rounded-2xl"
									/>
									<View className='flex-1 ml-3'>
										<View className='flex-1'>
											<Text className='text-lg font-bold color-primary' numberOfLines={2}>{reserva.quadra.estabelecimento?.nome}</Text>
											<Text numberOfLines={1} className='font-semibold'>{reserva.quadra.nome}</Text>
											<Text numberOfLines={1}>{dayjs(reserva.dataInicio).format('DD/MM/YYYY')} • {dayjs.utc(reserva.dataInicio).format('HH:mm')} - {dayjs.utc(reserva.dataFim).format('HH:mm')}</Text>
											<Text numberOfLines={1}>R$ {Number(reserva.quadra.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
										</View>
										<View>
											<HorizontalLine margin={4} color='bg-secondary' />
											{reserva.cancelada ?
												<View>
													<Text className='text-center' numberOfLines={1}>Reserva Cancelada</Text>
												</View>
												:
												<View className='flex-row items-center justify-between'>
													<Text numberOfLines={1}>Avaliação</Text>
													<AvaliacaoEstrelas size={14} avaliacao={0} />
												</View>
											}
										</View>
									</View >
								</Pressable>
								<HorizontalLine margin={14} />
							</View>
						))}
						{loading && <Loading />}
					</SafeAreaView>
				</View>
			</ScrollView>
			{loading && <Loading />}

		</SafeAreaView>
	);
}
