import { Stack } from 'expo-router';

export default function UsuarioLayout() {
  return (
    <Stack>
      <Stack.Screen name="cadastro" options={{ headerShown: false }} />
      <Stack.Screen name="editar" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="editarSenha" options={{ headerShown: false }} />
    </Stack>
  );
}