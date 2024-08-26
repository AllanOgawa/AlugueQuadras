import { Button, ScrollView, Text, View } from 'react-native';


import Constants from 'expo-constants'
import { Navigator } from 'expo-router';

const statusBarHeight = Constants.statusBarHeight;

export default function Perfil() {
  return (
    <ScrollView
      style={{ flex: 1 }}
      className="bg-white"
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full px-4" style={{ marginTop: statusBarHeight + 8 }}>
        <Text className="text-xl font-semibold mt-3">TESTE PERFIL</Text>

        <Button
          title="Ir para Detalhes"
        // onPress={() => navigation.navigate('Teste')}
        />
      </View>
    </ScrollView>
  );
}
