import { Text, View, ScrollView, SafeAreaView, Pressable, StatusBar } from "react-native";
import Banner from "@components/banner";
import LastCourt from "@components/lastCourt";
import { Feather } from '@expo/vector-icons';

import Constants from 'expo-constants'
import { FilterSport } from "@components/filterSport";
import IconUsuario from "@components/iconUsuario";
import Loading from '@components/loading';
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";

const statusBarHeight = Constants.statusBarHeight;
const { bucketUrl } = Constants.expoConfig.extra;

export default function Inicio() {
	const { userData } = useLocalSearchParams();
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState(null);

	useEffect(() => {
		setLoading(true);
		if (userData) {
			const parsedUserData = JSON.parse(userData);
			setUser(parsedUserData);
			console.log(user);
		}
		setLoading(false);
	}, [userData]);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
			<StatusBar barStyle="dark-content" backgroundColor="white" />
			<ScrollView
				style={{ flex: 1 }}
				className="bg-white"
				showsVerticalScrollIndicator={false}
			>
				<View className="w-full px-4" style={{ marginTop: statusBarHeight + 8 }}>
					<View className="flex-row justify-between items-center mb-4">
						<View>
							<Text className="text-xl font-semibold">Olá { }</Text>
							<Text className="text-xl">Vamos Jogar hoje?</Text>
						</View>
						<View className="relative mb-2">
							<Pressable
								onPress={() => router.push('/')}
							>
								<IconUsuario image={`${bucketUrl}/public-storage/usuario/usuario.png`} style="w-16 h-16 rounded-full border-2 border-black" />
								<Feather
									name="bell"
									size={16}
									color="#FF7300"
									className="absolute top-0 right-0 p-1" // Posiciona o sino sobre a imagem
								/>
							</Pressable>
						</View>
					</View>
					<FilterSport />
					<Banner />
					<LastCourt />
				</View>
			</ScrollView>
			{loading && <Loading />}
		</SafeAreaView>
	);
}


