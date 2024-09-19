import { Stack } from 'expo-router';

export default function ScreenLayout() {
  return (
    <Stack>
      <Stack.Screen name="notification" />
      <Stack.Screen name="quadras" />
    </Stack>
  );
}