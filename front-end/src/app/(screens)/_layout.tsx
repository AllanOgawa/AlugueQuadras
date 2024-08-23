import { Stack } from 'expo-router';

export default function ScreenLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="notification"
        options={{
          headerShown: true,
          headerTitle: 'Notificações',
          presentation: 'modal'
        }}
      />
    </Stack>
  );
}