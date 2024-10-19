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
      <Stack.Screen name='menu' options={{
        headerShown: false, headerTitle: "Estabelecimentos", animation: "ios"
      }} />
      <Stack.Screen name="cadastrar" options={{
        headerShown: false, headerTitle: "Cadastro", animation: "ios"
      }} />
      <Stack.Screen name="remover" options={{
        headerShown: false, headerTitle: "Remover", animation: "ios"
      }} />
      <Stack.Screen name="editar" options={{
        headerShown: false, headerTitle: "Edição", animation: "ios"
      }} />
      <Stack.Screen name="menu/[id]" options={{
        headerShown: false, animation: "ios"
      }} />
    </Stack>
  );
}