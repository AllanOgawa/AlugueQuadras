import IconUsuario from '@components/iconUsuario';
import Constants from 'expo-constants';
import { SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native';
import { CardConfig } from '@components/cardConfig';
import NotificationCard from '@components/cardNotification';
import { router } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { UsuarioContext } from '@context/usuarioContext';
import Loading from '@/src/components/loading';

const statusBarHeight = Constants.statusBarHeight;
const { bucketUrl, userDefaultImage } = Constants.expoConfig.extra;

export default function Perfil() {
	const [loading, setLoading] = useState(false);
	const [nome, setNome] = useState("Usuário não Logado");
	const [imagem, setImagem] = useState(userDefaultImage);

	const context = useContext(UsuarioContext);
	if (!context) {
		throw new Error("YourComponent must be used within an ArrayProvider");
	}
	const { usuario, setUsuario } = context;

	useEffect(() => {
		if (usuario != null && usuario[0] !== null) {
			if (usuario[0].nome)
				setNome(usuario[0].nome);
			if (usuario[0].imagens && usuario[0].imagens[0] && usuario[0].imagens[0].path)
				setImagem(usuario[0].imagens[0].path);
		}
		setLoading(false);
	}, [usuario]);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
			<StatusBar barStyle="dark-content" backgroundColor="white" />
			<ScrollView
				style={{ flex: 1 }}
				className="bg-white"
				showsVerticalScrollIndicator={false}
			>
				<View className="w-full px-4 py-8" style={{ marginTop: statusBarHeight }}>
					<IconUsuario image={`${bucketUrl}/${imagem}`} style="w-24 h-24 rounded-full border-2 border-black" />
					<Text className="font-bold text-center text-2xl">
						{nome}
					</Text>
				</View>
				<NotificationCard />
				<CardConfig
					icon="person"
					title="Minha conta"
					subtitle="Meus dados"
					style='h-16 w-full rounded-2xl flex-row items-center justify-between px-4'
					onPress={() => router.push('/(usuario)/editar')}
				/>
				<CardConfig
					icon="wallet"
					title="Pagamentos"
					subtitle="Informações de pagamento"
					style='h-16 w-full rounded-2xl flex-row items-center justify-between px-4'
					onPress={() => console.log("Clicou em Pagamentos")}
				/>
				<CardConfig
					icon="notifications"
					title="Notificações"
					subtitle="Minha central de notificações"
					style='h-16 w-full rounded-2xl flex-row items-center justify-between px-4'
					onPress={() => router.navigate('/notification')}
				/>
				<CardConfig
					icon="history"
					title="Histórico"
					subtitle="Meu histórico de alocações"
					style='h-16 w-full rounded-2xl flex-row items-center justify-between px-4'
					onPress={() => console.log("Clicou em Histórico")}
				/>
				<CardConfig
					icon="sports-tennis"
					title="Estabelecimento"
					subtitle="Meu estabelecimento"
					style="h-16 w-full rounded-2xl flex-row items-center justify-between px-4"
					onPress={() => {
						router.push('/(estabelecimento)/menu')
					}}
				/>
			</ScrollView>
			{loading && <Loading />}
		</SafeAreaView>
	);
}