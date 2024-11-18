import "@src/styles/global.css"
import { Stack } from 'expo-router';
import { StatusBar } from "react-native";
import Toast from "react-native-toast-message";
import { UsuarioProvider } from '@context/usuarioContext';


export default function RootLayout() {

  return (
    <UsuarioProvider>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(usuario)" options={{ headerShown: false }} />
        <Stack.Screen name="(reserva)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="(screens)" options={{ headerShown: false }} /> */}
        <Stack.Screen name="(quadra)" options={{ headerShown: false }} />
        <Stack.Screen name="(estabelecimento)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast />
    </UsuarioProvider>
  );
}  