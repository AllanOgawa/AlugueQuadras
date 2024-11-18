import { Tabs } from 'expo-router'
import Icone from '@/src/components/icone';

const tabData: { route: string, name: string, iconFocused: string, iconUnfocused: string }[] = [{
	route: "inicio",
	name: "Inicio",
	iconFocused: "MaterialCommunityIcons;home",
	iconUnfocused: "MaterialCommunityIcons;home-outline"
}, {
	route: "busca",
	name: "Buscar",
	iconFocused: "Ionicons;search",
	iconUnfocused: "Ionicons;search-outline"
}, {
	route: "mapa",
	name: "Mapa",
	iconFocused: "MaterialCommunityIcons;map-marker",
	iconUnfocused: "MaterialCommunityIcons;map-marker-outline"
}, {
	route: "reserva",
	name: "Reservas",
	iconFocused: "Ionicons;calendar-clear",
	iconUnfocused: "Ionicons;calendar-clear-outline"
}, {
	route: "perfil",
	name: "Perfil",
	iconFocused: "Ionicons;person",
	iconUnfocused: "Ionicons;person-outline"
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
								<Icone
									icone={focused ? tab.iconFocused : tab.iconUnfocused}
									color={color}
									size={28}
								/>
							)
						}}
					/>
				))
			}
		</Tabs>
	);
}