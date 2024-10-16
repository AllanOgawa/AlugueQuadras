import globalStyles from '@src/styles/globalStyles';  // Importa os estilos globais
import { Stack } from 'expo-router';

export default function EstabelecimentoLayout() {
  return (
    <Stack>
      <Stack.Screen name="estabelecimento/[id]" options={{
        headerShown: true, headerTitle: "", animation: "ios"
      }} />
      <Stack.Screen name="avaliacoes" options={{
        headerShown: true, headerTitle: "Avaliações", animation: "ios"
      }} />
      <Stack.Screen name='home' options={{
        headerShown: true, headerTitle: "Estabelecimentos", animation: "ios"
      }}/>
      <Stack.Screen name="create" options={{
        headerShown: false, headerTitle: "Cadastro", animation: "ios"
      }} />
      <Stack.Screen name="remove" options={{
        headerShown: false, headerTitle: "Remover", animation: "ios"
      }}/>
    </Stack>
  );
}