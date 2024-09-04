import UserIcon from '@/src/components/userIcon';
import Constants from 'expo-constants';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import * as data from '@/db.json'
import { CardConfig } from '@/src/components/cardConfig';
import NotificationCard from '@/src/components/cardNotification';

const statusBarHeight = Constants.statusBarHeight;

export default function Perfil() {
	const user = data.user[0];

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
			<ScrollView
				style={{ flex: 1 }}
				className="bg-white"
				showsVerticalScrollIndicator={false}
			>
				<View className="w-full px-4 py-8" style={{ marginTop: statusBarHeight }}>
					<UserIcon image={user.image} style="w-24 h-24 rounded-full border-2 border-black" />
					<Text className="font-bold text-center text-2xl">
						{user.name}
					</Text>
				</View>
				<NotificationCard />
				<CardConfig
					icon="person"
					title="Minha conta"
					subtitle="Meus dados"
					onPress={() => console.log("Clicou em Minha conta")}
				/>
				<CardConfig
					icon="wallet"
					title="Pagamentos"
					subtitle="Informações de pagamento"
					onPress={() => console.log("Clicou em Pagamentos")}
				/>
				<CardConfig
					icon="notifications"
					title="Notificações"
					subtitle="Minha central de notificações"
					onPress={() => console.log("Clicou em Notificações")}
				/>
				<CardConfig
					icon="history"
					title="Histórico"
					subtitle="Meu histórico de alocações"
					onPress={() => console.log("Clicou em Histórico")}
				/>
			</ScrollView>
		</SafeAreaView>
	);
}
