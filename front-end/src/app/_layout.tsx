import "@src/styles/global.css"
import { Stack } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" translucent={true} backgroundColor="transparent" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="(screens)" options={{ headerShown: false }} /> */}
        <Stack.Screen name="(quadra)" options={{ headerShown: false }} />
        <Stack.Screen name="(estabelecimento)" options={{ headerShown: false }} />
        <Stack.Screen name="(usuario)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast />
    </>
  );
}  