import globalStyles from '@src/styles/globalStyles';  // Importa os estilos globais
import { Stack } from 'expo-router';

export default function EstabelecimentoLayout() {
	return (
		<Stack>
			<Stack.Screen name="detalhes" options={{
				headerShown: true, headerTitle: "", animation: "ios"
			}} />
			<Stack.Screen name="avaliacoes" options={{
				headerShown: true, headerTitle: "Avaliações", animation: "ios"
			}} />
			<Stack.Screen name='menu' options={{
				headerShown: false, headerTitle: "Estabelecimentos", animation: "ios"
			}} />
			<Stack.Screen name="cadastrarEditar" options={{
				headerShown: false, headerTitle: "Cadastro", animation: "ios"
			}} />
			<Stack.Screen name="menuDetalhado" options={{
				headerShown: false, animation: "ios"
			}} />
			<Stack.Screen name="reserva" options={{
				headerShown: false, animation: "ios"
			}} />
		</Stack>
	);
}