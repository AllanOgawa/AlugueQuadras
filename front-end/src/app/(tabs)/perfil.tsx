import UserIcon from '@components/userIcon';
import Constants from 'expo-constants';
import { ScrollView, Text, View } from 'react-native';
import * as data from '@/db.json'
import { CardConfig } from '@components/cardConfig';
import NotificationCard from '@components/cardNotification';

const statusBarHeight = Constants.statusBarHeight;

export default function Perfil() {
	const user = data.user[1];
	return (
		<ScrollView
			style={{ flex: 1 }}
			className="bg-white"
			showsVerticalScrollIndicator={false}
		>
			<View className="w-full px-4 py-8" style={{ marginTop: statusBarHeight + 8 }}>
				<UserIcon image={user.image} />
				<Text
					className='font-bold text-center text-2xl'
				>
					{user.name}
				</Text>
			</View>
			<NotificationCard />
			<CardConfig />
		</ScrollView>
	);
}