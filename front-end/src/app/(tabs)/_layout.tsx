import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

type TabName = "Inicio" | "Buscar" | "Mapa" | "Reservas" | "Perfil";
type IconName = "home" | "home-outline" | "search" | "search-outline" | "map" | "map-outline" | "calendar" | "calendar-outline" | "person" | "person-outline";

const tabData: { route: string, name: TabName, iconFocused: IconName, iconUnfocused: IconName }[] = [{
	route: "inicio",
	name: "Inicio",
	iconFocused: "home",
	iconUnfocused: "home-outline"
}, {
	route: "busca",
	name: "Buscar",
	iconFocused: "search",
	iconUnfocused: "search-outline"
}, {
	route: "mapa",
	name: "Mapa",
	iconFocused: "map",
	iconUnfocused: "map-outline"
}, {
	route: "reserva",
	name: "Reservas",
	iconFocused: "calendar",
	iconUnfocused: "calendar-outline"
}, {
	route: "perfil",
	name: "Perfil",
	iconFocused: "person",
	iconUnfocused: "person-outline"
}];

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
			}}>
			{
				tabData.map((tab, index) => (
					<Tabs.Screen
						key={index}
						name={tab.route}
						options={{
							title: tab.name,
							tabBarActiveTintColor: "#f97316",
							tabBarInactiveTintColor: "#000000",
							tabBarIcon: ({ color, focused }) => (
								<Ionicons
									name={focused ? tab.iconFocused : tab.iconUnfocused}
									color={color}
									size={28}
									style={{ marginBottom: -3 }}
								/>
							)
						}}
					/>
				))
			}
		</Tabs>
	);
}