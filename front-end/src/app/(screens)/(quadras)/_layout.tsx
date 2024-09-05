import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, SafeAreaView } from 'react-native';
import { ScreenTransition, startScreenTransition } from 'react-native-reanimated';

export default function QuadrasLayout() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Stack>
                <Stack.Screen name='home' options={{ headerShown: false }} />
                <Stack.Screen name='edit' />
                <Stack.Screen name='create' options={{ headerShown: false }} />
            </Stack>
        </SafeAreaView>
    );
}