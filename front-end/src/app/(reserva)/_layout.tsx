import { Stack } from 'expo-router';

export default function UsuarioLayout() {
  return (
    <Stack>
      <Stack.Screen name="selecaoQuadra" options={{ headerShown: false }} />
      <Stack.Screen name="selecaoDataHora" options={{ headerShown: false }} />
      <Stack.Screen name="selecaoPagamento" options={{ headerShown: false }} />
      <Stack.Screen name="pagamentoPix" options={{ headerShown: false }} />
    </Stack>
  );
}