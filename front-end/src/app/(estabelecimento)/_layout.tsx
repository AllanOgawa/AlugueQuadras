import globalStyles from '@src/styles/globalStyles';  // Importa os estilos globais
import { Stack } from 'expo-router';

export default function EstabelecimentoLayout() {
  return (
    <Stack>
      <Stack.Screen name="estabelecimento/[id]" options={{
        headerShown: true, headerTitle: "",
      }} />
    </Stack>
  );
}