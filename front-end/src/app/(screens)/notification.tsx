import { ScrollView, StatusBar, Text, View } from 'react-native';

import Constants from 'expo-constants'

const statusBarHeight = Constants.statusBarHeight;

export default function Notification() {
    return (
        <ScrollView
            style={{ flex: 1 }}
            className="bg-white"
            showsVerticalScrollIndicator={false}
        >
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <View className="w-full px-4" style={{ marginTop: statusBarHeight + 8 }}>
                <Text className="text-xl font-semibold mt-3">NOTIFICATION 1</Text>
            </View>
        </ScrollView>
    );
}
