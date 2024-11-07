import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native';

export default function MainLayout() {
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
			<Stack>
				{/* Tela de Perfil */}
				<Stack.Screen name="menu" options={{ headerShown: false, headerTitle: "Quadras" }} />

				{/* Tela de Criar */}
				<Stack.Screen name="cadastrar" options={{ headerShown: false, headerTitle: "Nova quadra", animation: 'ios', headerTintColor: "#000000" }} />

				{/* Tela de Editar */}
				<Stack.Screen name="editar" options={{ headerShown: false, headerTitle: "Editar quadra", animation: 'ios', headerTintColor: "#000000" }} />
			</Stack>
		</SafeAreaView>
	);
}
