import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, SafeAreaView } from 'react-native';
import { ScreenTransition, startScreenTransition } from 'react-native-reanimated';

export default function QuadrasLayout() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Stack>
                <Stack.Screen name='home' />
                <Stack.Screen name='edit' />
                <Stack.Screen name='create' />
            </Stack>
        </SafeAreaView>
    );
}