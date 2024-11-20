import { MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { View, StyleSheet, Text } from 'react-native';

export default function NotFoundScreen() {
	return (
		<>
			<Stack.Screen options={{ title: 'Oops!' }} />
			<View style={styles.container}>
				<MaterialIcons name='error' size={50} />
				<Text style={styles.text}>Ocorreu um erro!</Text>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff',
	},
	text: {
		marginTop: 5,
		color: '#5b5b5b',
		fontSize: 20
	}
});

