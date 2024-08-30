import UserIcon from '@/src/components/userIcon';
import Constants from 'expo-constants';
import { ScrollView, Text, View } from 'react-native';
import * as data from '@/db.json'

const statusBarHeight = Constants.statusBarHeight;

export default function Perfil() {
	const user = data.user[0];
	return (
		<ScrollView
			style={{ flex: 1 }}
			className="bg-white"
			showsVerticalScrollIndicator={false}
		>
			<View
				style={{ flex: 1, marginTop: statusBarHeight + 8 }}
				className="bg-white w-full px-10 pt-4"
			>
				<UserIcon image={user.image} />
				<Text
					className='font-bold text-center text-2xl'
				>
					{user.name}
				</Text>
			</View>
		</ScrollView>
	);
}
