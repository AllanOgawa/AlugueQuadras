import { Text, View, ScrollView, SafeAreaView, Pressable, StatusBar } from "react-native";
import Banner from "@components/banner";
import LastCourt from "@components/lastCourt";
import { Feather } from '@expo/vector-icons';

import Constants from 'expo-constants'
import { FilterSport } from "@components/filterSport";
import * as data from '@/db.json'
import IconUsuario from "@components/iconUsuario";
import { router } from "expo-router";

const statusBarHeight = Constants.statusBarHeight;

export default function Inicio() {
	const user = data.user[0];
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
			<StatusBar barStyle="dark-content" backgroundColor="white" />
			<ScrollView
				style={{ flex: 1 }}
				className="bg-white"
				showsVerticalScrollIndicator={false}
			>
				<View className="w-full px-4" style={{ marginTop: statusBarHeight }}>
					<View className="flex-row justify-between items-center mb-4">
						<View>
							<Text className="text-xl font-semibold">Olá {user.name}</Text>
							<Text className="text-xl">Vamos Jogar hoje?</Text>
						</View>
						<View className="relative mb-2">
							<Pressable
								onPress={() => router.push('/(usuario)/cadastro')}
							>
								<IconUsuario image={user.image} style="w-16 h-16 rounded-full border-2 border-black" />
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
		</SafeAreaView>
	);
}


