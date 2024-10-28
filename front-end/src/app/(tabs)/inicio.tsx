import { Text, View, ScrollView, SafeAreaView, Pressable, StatusBar } from "react-native";
import Banner from "@components/banner";
import LastCourt from "@components/lastCourt";
import { Feather } from '@expo/vector-icons';

import Constants from 'expo-constants'
import { FilterSport } from "@components/filterSport";
import IconUsuario from "@components/iconUsuario";
import Loading from '@components/loading';
import { useLocalSearchParams, router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { UsuarioContext } from '@context/usuarioContext';

const statusBarHeight = Constants.statusBarHeight;
const { bucketUrl, userDefaultImage } = Constants.expoConfig.extra;

export default function Inicio() {
	const [loading, setLoading] = useState(false);
	const [nome, setNome] = useState("Bem-vindo!");
	const [imagem, setImagem] = useState(userDefaultImage);

	const context = useContext(UsuarioContext);
	if (!context) {
		throw new Error("YourComponent must be used within an ArrayProvider");
	}
	const { usuario, setUsuario } = context;

	useEffect(() => {
		if (usuario != null && usuario[0] !== null) {
			if (usuario[0].nome)
				setNome("Olá! " + usuario[0].nome);
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
				<View className="w-full px-4" style={{ marginTop: statusBarHeight + 8 }}>
					<View className="flex-row justify-between items-center mb-4">
						<View>
							<Text className="text-xl font-semibold">{nome}</Text>
							<Text className="text-xl">Vamos Jogar hoje?</Text>
						</View>
						<View className="relative mb-2">
							<Pressable
							// onPress={() => router.push('/')}
							>
								<IconUsuario image={`${bucketUrl}/${imagem}`} style="w-16 h-16 rounded-full border-2 border-black" />
								{/* <Feather
									name="bell"
									size={16}
									color="#FF7300"
									className="absolute top-0 right-0 p-1" // Posiciona o sino sobre a imagem
								/> */}
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


