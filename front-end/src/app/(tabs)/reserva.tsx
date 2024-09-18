import { SafeAreaView, ScrollView, Text, View } from 'react-native'
import { ReservasList } from '../../components/reservas'
import Constants from 'expo-constants'

const statusBarHeight = Constants.statusBarHeight;

export default function Reserva() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{ flex: 1, marginTop: statusBarHeight + 8 }}
          className="bg-white w-full px-4"
        >
          <Text className="text-4xl font-semibold mt-3">Reservas</Text>
          <ReservasList />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
