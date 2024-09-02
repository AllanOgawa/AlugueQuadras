import { Text, View, ScrollView } from "react-native";
import { Header } from "../../components/header";
import Banner from "../../components/banner";
import LastCourt from "@/src/components/lastCourt";

import Constants from 'expo-constants'
import { FilterSport } from "../../components/filterSport";
import { StatusBar } from "expo-status-bar";

const statusBarHeight = Constants.statusBarHeight;

export default function Inicio() {
  return (
    <ScrollView
    
      style={{ flex: 1 }}
      className="bg-white"
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full px-4" style={{ marginTop: statusBarHeight + 8 }}>
        <StatusBar style="dark" translucent={true} backgroundColor="transparent" />
        <Header />
        <Text className="text-xl font-semibold mt-3">Olá, Allan</Text>
        <Text className="text-xl">Vamos Jogar hoje?</Text>
        <FilterSport />
        <Banner />
        <LastCourt />
      </View>
    </ScrollView>
  );
}
