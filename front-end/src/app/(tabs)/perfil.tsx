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
			if (usuario[0].nome) {
				setNome(usuario[0].nome);
			}
			if (usuario[0].imagens && usuario[0].imagens[0].path) {
				setImagem(usuario[0].imagens[0].path);
			}
		}
		setLoading(false);
	}, [usuario]);

	// if (false) {
	// 	return (
	// 		<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
	// 			<StatusBar barStyle="dark-content" backgroundColor="white" />
	// 			<ScrollView
	// 				style={{ flex: 1 }}
	// 				className="bg-white"
	// 				showsVerticalScrollIndicator={false}
	// 			>
	// 				<View className="w-full px-4 py-8" style={{ marginTop: statusBarHeight }}>
	// 					<IconUsuario image={user.image} style="w-24 h-24 rounded-full border-2 border-black" />
	// 					<Text className="font-bold text-center text-2xl mt-2">
	// 						{user.name}
	// 					</Text>
	// 				</View>
	// 				<NotificationCard />
	// 				<CardConfig
	// 					icon="person"
	// 					title="Minha conta"
	// 					subtitle="Meus dados"
	// 					style='h-16 w-full rounded-2xl flex-row items-center justify-between px-4'
	// 					onPress={() => console.log("Clicou em Minha conta")}
	// 				/>
	// 				<CardConfig
	// 					icon="monetization-on"
	// 					title="Financeiro"
	// 					subtitle="Minhas Finanças"
	// 					style='h-16 w-full rounded-2xl flex-row items-center justify-between px-4'
	// 					onPress={() => console.log("Clicou em Financas")}
	// 				/>
	// 				<CardConfig
	// 					icon="notifications"
	// 					title="Notificações"
	// 					subtitle="Minha central de notificações"
	// 					style='h-16 w-full rounded-2xl flex-row items-center justify-between px-4'
	// 					onPress={() => router.navigate('/(screens)/notification')}
	// 				/>
	// 				<CardConfig
	// 					icon="sports-tennis"
	// 					title="Tenho um negócio"
	// 					subtitle="Torne-se um parceiro nosso!"
	// 					style="h-16 w-full rounded-2xl flex-row items-center justify-between px-4"
	// 					onPress={() => {
	// 						if (user.adm) {
	// 							router.push('/(quadra)/menu')
	// 						} else {
	// 							console.log("Usuário não é administrador, ação não permitida.");
	// 						}
	// 					}}
	// 				/>

	// 				<CardConfig
	// 					icon="sell"
	// 					title="Promoções"
	// 					subtitle="Minhas promoções"
	// 					style='h-16 w-full rounded-2xl flex-row items-center justify-between px-4'
	// 					onPress={() => console.log("Clicou em Promoções")}
	// 				/>

	// 			</ScrollView>
	// 			{loading && <Loading />}
	// 		</SafeAreaView>
	// 	);
	// }

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
				<CardConfig
					icon="sports-tennis"
					title="Quadras"
					subtitle="Minhas quadras"
					style='h-16 w-full rounded-2xl flex-row items-center justify-between px-4'
					onPress={() => router.push('/(quadra)/menu')}
				/>
			</ScrollView>
			{loading && <Loading />}
		</SafeAreaView>
	);
}