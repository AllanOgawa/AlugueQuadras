import ArrowBack from '@/src/components/arrowBack';
import CustomButton from '@/src/components/buttom';
import TextInputExample from '@/src/components/textInput';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet } from 'react-native';

export default function NewCourt() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View>
                    <Text style={styles.headerText}>Informações Gerais</Text>
                    <TextInputExample
                        title={'CNPJ'}
                        hint={'Ex: CNPJ'}
                    />
                    <TextInputExample
                        title='Nome do responsável'
                        hint={'Ex: Nome do Responsável'}
                    />
                    <TextInputExample
                        title='Telefone para contato'
                        hint={'(99) 99999-9999'}
                    />
                    <TextInputExample
                        title='Nome do local'
                        hint={'Ex: Quadra legal'}
                    />

                    <View style={styles.uploadSection}>
                        <Text style={styles.uploadText}>Registro de funcionamento (Alvará)</Text>
                        <View style={styles.uploadButton}>
                            <Text style={styles.uploadButtonText}>Upload</Text>
                        </View>
                    </View>

                    <View style={styles.fileSection}>
                        <MaterialIcons name='upload' size={20} style={styles.icon} />
                        <Text style={styles.fileText}>Alvara.pdf</Text>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
                <CustomButton
                    title={'Próximo'}
                    onPress={() => router.push('/notification')}
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
        flexGrow: 1,
    },
    headerText: {
        fontSize: 24,
        fontWeight: '500',
        marginLeft: 12,
        marginTop: 8,
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
    },
    uploadButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    fileSection: {
        backgroundColor: '#9ca3af', // Tailwind gray-400
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 40,
        paddingVertical: 16,
        marginTop: 16,
        flexDirection: 'row',
        marginBottom: 20
    },
    icon: {
        paddingHorizontal: 8,
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
