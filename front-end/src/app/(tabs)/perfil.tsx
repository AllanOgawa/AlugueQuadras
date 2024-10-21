import IconUsuario from '@components/iconUsuario';
import Constants from 'expo-constants';
import { SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native';
import * as data from '@/db.json'
import { CardConfig } from '@components/cardConfig';
import NotificationCard from '@components/cardNotification';
import { useRouter } from 'expo-router';

const statusBarHeight = Constants.statusBarHeight;

export default function Perfil() {
	const user = data.user[1];

	const router = useRouter()

	if (user.adm) {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
				<StatusBar barStyle="dark-content" backgroundColor="white" />
				<ScrollView
					style={{ flex: 1 }}
					className="bg-white"
					showsVerticalScrollIndicator={false}
				>
					<View className="w-full px-4 py-8" style={{ marginTop: statusBarHeight }}>
						<IconUsuario image={user.image} style="w-24 h-24 rounded-full border-2 border-black" />
						<Text className="font-bold text-center text-2xl mt-2">
							{user.name}
						</Text>
					</View>
					<NotificationCard />
					<CardConfig
						icon="person"
						title="Minha conta"
						subtitle="Meus dados"
						style='h-16 w-full rounded-2xl flex-row items-center justify-between px-4'
						onPress={() => console.log("Clicou em Minha conta")}
					/>
					<CardConfig
						icon="monetization-on"
						title="Financeiro"
						subtitle="Minhas Finanças"
						style='h-16 w-full rounded-2xl flex-row items-center justify-between px-4'
						onPress={() => console.log("Clicou em Financas")}
					/>
					<CardConfig
						icon="notifications"
						title="Notificações"
						subtitle="Minha central de notificações"
						style='h-16 w-full rounded-2xl flex-row items-center justify-between px-4'
						onPress={() => router.navigate('/(screens)/notification')}
					/>
					<CardConfig
						icon="sports-tennis"
						title="Tenho um negócio"
						subtitle="Torne-se um parceiro nosso!"
						style="h-16 w-full rounded-2xl flex-row items-center justify-between px-4"
						onPress={() => {
							if (user.adm) {
								router.push('/(quadra)/menu')
							} else {
								console.log("Usuário não é administrador, ação não permitida.");
							}
						}}
					/>

					<CardConfig
						icon="sell"
						title="Promoções"
						subtitle="Minhas promoções"
						style='h-16 w-full rounded-2xl flex-row items-center justify-between px-4'
						onPress={() => console.log("Clicou em Promoções")}
					/>

				</ScrollView>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
			<StatusBar barStyle="dark-content" backgroundColor="white" />
			<ScrollView
				style={{ flex: 1 }}
				className="bg-white"
				showsVerticalScrollIndicator={false}
			>
				<View className="w-full px-4 py-8" style={{ marginTop: statusBarHeight }}>
					<IconUsuario image={user.image} style="w-24 h-24 rounded-full border-2 border-black" />
					<Text className="font-bold text-center text-2xl">
						{user.name}
					</Text>
				</View>
				<NotificationCard />
				<CardConfig
					icon="person"
					title="Minha conta"
					subtitle="Meus dados"
					style='h-16 w-full rounded-2xl flex-row items-center justify-between px-4'
					onPress={() => router.push('/(usuario)/cadastro')}
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
					title="Tenho um negócio"
					subtitle="Torne-se um parceiro!"
					style="h-16 w-full rounded-2xl flex-row items-center justify-between px-4"
					onPress={() => {
						router.push('/(estabelecimento)/menu')
					}}
				/>
			</ScrollView>
		</SafeAreaView>
	);
}
