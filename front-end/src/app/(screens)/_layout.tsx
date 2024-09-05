import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native';

export default function MainLayout() {
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
			<Stack>
				{/* Tela de Perfil */}
				<Stack.Screen name="(quadras)/home" options={{ headerShown: true, headerTitle: "Quadras" }} />

				{/* Tela de Criar */}
				<Stack.Screen name="(quadras)/create" options={{ headerShown: true, headerTitle: "Nova quadra", animation: 'ios', headerTintColor: "#000000" }} />

				{/* Tela de Editar */}
				<Stack.Screen name="(quadras)/edit" options={{ headerShown: true, headerTitle: "Editar", animation: 'ios', headerTintColor: "#000000" }} />

				{/* Outras telas, se houver */}
			</Stack>
		</SafeAreaView>
	);
}
