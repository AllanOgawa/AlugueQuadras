import { Stack } from 'expo-router';

export default function UsuarioLayout() {
  return (
    <Stack>
      <Stack.Screen name="cadastro" options={{ headerShown: false }} />
    </Stack>
  );
}