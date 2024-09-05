import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, SafeAreaView } from 'react-native';
import { ScreenTransition, startScreenTransition } from 'react-native-reanimated';

export default function ScreensLayout() {
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
			<Stack>
				<Stack.Screen name="(quadras)" options={{
					headerShown: false, headerSearchBarOptions: {
						onClose() {
							console.log('clicado');
						},
					}
				}} />
			</Stack>
		</SafeAreaView>
	);
}