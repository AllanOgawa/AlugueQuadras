import { Text, View, ScrollView, SafeAreaView, Pressable } from "react-native";
import Banner from "../../components/banner";
import LastCourt from "@/src/components/lastCourt";
import { Feather } from '@expo/vector-icons';

import Constants from 'expo-constants'
import { FilterSport } from "../../components/filterSport";
import { StatusBar } from "expo-status-bar";
import * as data from '@/db.json'
import UserIcon from "@/src/components/userIcon";
import { router } from "expo-router";

const statusBarHeight = Constants.statusBarHeight;

export default function Inicio() {
	const user = data.user[0];
	return (
		<ScrollView
			style={{ flex: 1 }}
			className="bg-white"
			showsVerticalScrollIndicator={false}
		>
			<StatusBar style="dark" translucent={true} backgroundColor="transparent" />
			<SafeAreaView className="flex-1 bg-white mt-5">
				<View className="w-full px-4" style={{ marginTop: statusBarHeight }}>
					<View className="flex-row justify-between items-center mb-4">
						<View>
							<Text className="text-xl font-semibold">Olá {user.name}</Text>
							<Text className="text-xl">Vamos Jogar hoje?</Text>
						</View>
						<View className="relative">
							<Pressable
								onPress={() => router.push('/notification')}
							>
								<UserIcon image={user.image} style="w-16 h-16 rounded-full border-2 border-black" />
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
			</SafeAreaView>
		</ScrollView>
	);
}


