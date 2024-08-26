import { Stack } from 'expo-router';
import { ScreenTransition } from 'react-native-reanimated';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="notification" />
      <Stack.Screen name="quadras"/>
      <Stack.Screen name="reserva" />
    </Stack>
  );
}