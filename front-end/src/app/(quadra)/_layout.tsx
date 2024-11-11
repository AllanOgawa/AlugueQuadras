import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native';

export default function MainLayout() {
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
			<Stack>
				{/* Tela de Perfil */}
				<Stack.Screen name="menu" options={{ headerShown: false }} />

				{/* Tela de Criar */}
				<Stack.Screen name="cadastrarEditar" options={{ headerShown: false, animation: 'ios', headerTintColor: "#000000" }} />
			</Stack>
		</SafeAreaView>
	);
}
