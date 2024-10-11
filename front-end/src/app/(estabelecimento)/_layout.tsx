import globalStyles from '@src/styles/globalStyles';  // Importa os estilos globais
import { Stack } from 'expo-router';

export default function EstabelecimentoLayout() {
  return (
    <Stack>
      <Stack.Screen name="estabelecimento/[id]" options={{
        headerShown: true, headerTitle: "",
      }} />
      <Stack.Screen name="avaliacoes" options={{
        headerShown: true, headerTitle: "Avaliações",
      }} />
      <Stack.Screen name="home" options={{
        headerShown: true, headerTitle: "Estabelecimento",
        animation: 'ios',
        headerTintColor: "#000000",
        headerBackButtonMenuEnabled: true
      }} />
    </Stack>
  );
}