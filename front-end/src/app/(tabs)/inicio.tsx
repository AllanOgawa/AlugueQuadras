import { Text, View, ScrollView, SafeAreaView, Pressable, StatusBar } from "react-native";
import Banner from "@components/banner";
import MaisVisitados from "@/src/components/estabelecimentosMaisVisitados";
import { Feather } from '@expo/vector-icons';

import Constants from 'expo-constants'
import FiltroEsportes from "@/src/components/filtroEsportes";
import IconUsuario from "@components/iconUsuario";
import Loading from '@components/loading';
import { useLocalSearchParams, router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { UsuarioContext } from '@context/usuarioContext';

const statusBarHeight = Constants.statusBarHeight;
const extraConfig = Constants.expoConfig?.extra as { bucketUrl: string; userDefaultImage: string } | undefined;
if (!extraConfig) {
	throw new Error("Missing configuration");
}
const { bucketUrl, userDefaultImage } = extraConfig;

export default function Inicio() {
	const [loading, setLoading] = useState(false);
	const [logado, setLogado] = useState(false);
	const [nome, setNome] = useState("Bem-vindo!");
	const [imagem, setImagem] = useState(userDefaultImage);

	const context = useContext(UsuarioContext);
	if (!context) {
		throw new Error("YourComponent must be used within an ArrayProvider");
	}
	const { usuario } = context;

	useEffect(() => {
		if (usuario != null && usuario.length > 0 && usuario[0] !== null) {
			setLogado(true);
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
								onPress={() => {
									if (logado) router.navigate('/(tabs)/perfil');
									else router.navigate('/(usuario)/login');
								}}
							>
								<IconUsuario image={`${bucketUrl}/${imagem}`} style="w-16 h-16 rounded-full border-2 border-black" />
							</Pressable>
						</View>
					</View>
					<FiltroEsportes />
					<Banner />
					<MaisVisitados />
				</View>
			</ScrollView>
			{loading && <Loading />}
		</SafeAreaView>
	);
}


