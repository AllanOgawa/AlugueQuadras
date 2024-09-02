import { HoverEffect } from "react-native-gesture-handler";
import "../styles/global.css"
import { Stack } from 'expo-router';
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(screens)" options={{ headerShown: false }} />
        <Stack.Screen name="(gestao_quadra)" options={{ headerShown: true }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}  