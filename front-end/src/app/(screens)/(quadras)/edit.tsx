import { router } from 'expo-router';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, Pressable } from 'react-native';
import QuadrasList from '@components/quadras';

export default function EditCourt() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View>
                    <Text style={styles.headerText}>Selecione uma quadra para editar:</Text>
                    <Pressable>
                        <QuadrasList onPress={() => router.push('/(quadras)/create')} />
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContent: {
        marginTop: 8,
        flexGrow: 1,
        margin: 12,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '300',
        marginLeft: 4,
        marginTop: 8,
        marginBottom: 8,
        flexDirection: "row"
    }
});