import { Stack } from 'expo-router';

export default function GestaoQuadraLayout() {
  return (
    <Stack>
      <Stack.Screen name="(estabelecimento)"  options={{ headerShown: true }} />
      <Stack.Screen name="(quadra)"           options={{ headerShown: true }} />
      <Stack.Screen name="(reserva)"          options={{ headerShown: true }} />
    </Stack>
  );
}