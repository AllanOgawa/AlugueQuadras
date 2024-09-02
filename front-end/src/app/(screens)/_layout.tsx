import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScreenTransition, startScreenTransition } from 'react-native-reanimated';

export default function ScreenLayout() {
  return (
    <Stack>
      <Stack.Screen name="notification"/>
      <Stack.Screen name="quadras" />
    </Stack>
  );
}