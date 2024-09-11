import CustomButton from '@/src/components/buttom';
import { router } from 'expo-router';
import { View, Text, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import QuadrasList from '@/src/components/quadras';

export default function EditCourt() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View>
                    <Text style={styles.headerText}>Selecione uma quadra para editar:</Text>
                    <View>
                        <QuadrasList />
                    </View>
                </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
                <CustomButton
                    title={'Cadastrar'}
                    onPress={() => router.push('/(quadras)/home')}
                    style='bg-orange-500 p-4 rounded-2xl active:bg-orange-400 mx-4'
                />
            </View>
        </SafeAreaView>
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
        marginLeft: 12,
        marginTop: 8,
        marginBottom: 8,
        flexDirection: "row"
    },
    uploadSection: {
        marginHorizontal: 16,
        marginTop: 8,
    },
    uploadText: {
        fontSize: 20,
    },
    uploadButton: {
        backgroundColor: '#6b7280', // Tailwind gray-500
        borderRadius: 12,
        alignItems: 'center',
        paddingVertical: 16,
        marginTop: 16,
        flexDirection: "row",
        justifyContent: "center"
    },
    uploadButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    fileSection: {
        backgroundColor: '#b0b6bf',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 40,
        paddingVertical: 16,
        marginTop: 8,
        flexDirection: 'row',
        marginBottom: 8
    },
    icon: {
        paddingHorizontal: 4,
        color: "white"
    },
    fileText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    buttonContainer: {
        backgroundColor: '#', // Tailwind slate-800
        paddingVertical: 8,
        justifyContent: 'flex-end',
    },
});