import { Text, View, ScrollView } from "react-native";
import { Header } from "../../components/header";
import { Banner } from "../../components/banner";

import Constants from 'expo-constants'
import { FilterSport } from "../../components/filterSport";

const statusBarHeight = Constants.statusBarHeight;

export default function Inicio() {
  return (
    <ScrollView
      style={{ flex: 1 }}
      className="bg-white"
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full px-4" style={{ marginTop: statusBarHeight + 8 }}>
        <Header />
        <Text className="text-xl font-semibold mt-3">Olá, Allan</Text>
        <Text className="text-xl">Vamos Jogar hoje?</Text>
        <FilterSport />
        <Banner />
        <Text className="text-xl font-semibold mt-3">Ultimas Quadras Visitadas</Text>
      </View>
    </ScrollView>
  );
}
