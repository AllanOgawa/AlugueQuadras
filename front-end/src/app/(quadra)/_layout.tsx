import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native';

export default function MainLayout() {
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
			<Stack>
				{/* Tela de Perfil */}
				<Stack.Screen name="home" options={{ headerShown: true, headerTitle: "Quadras" }} />

				{/* Tela de Criar */}
				<Stack.Screen name="create" options={{ headerShown: false, headerTitle: "Nova quadra", animation: 'ios', headerTintColor: "#000000" }} />

				{/* Tela de Editar */}
				<Stack.Screen name="edit" options={{ headerShown: true, headerTitle: "Editar", animation: 'ios', headerTintColor: "#000000" }} />

				{/* Tela de Remover */}
				<Stack.Screen name="remove" options={{ headerShown: true, headerTitle: "Remover", animation: 'ios', headerTintColor: "#000000" }} />
			</Stack>
		</SafeAreaView>
	);
}
