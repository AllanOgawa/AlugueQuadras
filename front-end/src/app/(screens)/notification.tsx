import { ScrollView, Text, View } from 'react-native';

import Constants from 'expo-constants'

const statusBarHeight = Constants.statusBarHeight;

export default function Notification() {
    return (
        <ScrollView
            style={{ flex: 1 }}
            className="bg-white"
            showsVerticalScrollIndicator={false}
        >
            <View className="w-full px-4" style={{ marginTop: statusBarHeight + 8 }}>
                <Text className="text-xl font-semibold mt-3">NOTIFICAITON BUSCAR</Text>
            </View>
        </ScrollView>
    );
}
