import ArrowBack from '@/src/components/arrowBack';
import CustomButton from '@/src/components/buttom';
import DayIcon from '@/src/components/dayIcon';
import TextInputExample from '@/src/components/textInput';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import HorariosDisponiveis from '@/src/components/timerSelector';

export default function NewCourt() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View>
                    <Text style={styles.headerText}>Informações Gerais</Text>
                    <TextInputExample
                        title={'Nome da quadra'}
                        hint={'Ex: Quadra 2'}
                    />
                    <TextInputExample
                        title='Esporte'
                        hint={'Ex: Volei'}
                    />
                    <TextInputExample
                        title='Valor por hora'
                        hint={'Ex: R$45,00'}
                    />
                    <TextInputExample
                        title='Endereço'
                        hint={'Ex: Av: Nobrega, 239'}
                    />
                    <TextInputExample
                        title='Informações adicionais'
                        hint={'Ex: Aos fundos'}
                    />

                    <Text className=' ml-3 py-2 text-xl'>Dias da semana disponíveis:</Text>

                    <View className='flex-row mx-4 justify-between py-2'>
                        <DayIcon day={'Dom'} color={'#FF7300'} />
                        <DayIcon day={'Seg'} color={'#FF7300'} />
                        <DayIcon day={'Ter'} color={'#FF7300'} />
                        <DayIcon day={'Qua'} color={'#FF7300'} />
                        <DayIcon day={'Qui'} color={'#FF7300'} />
                        <DayIcon day={'Sex'} color={'#FF7300'} />
                        <DayIcon day={'Sab'} color={'#FF7300'} />
                    </View>
                    <HorariosDisponiveis />
                    <View style={styles.uploadSection}>
                        <Text style={styles.uploadText}>Insira algumas fotos do local:</Text>
                        <View style={styles.uploadButton}>
                            <MaterialIcons name='upload' size={20} style={styles.icon} />
                            <Text style={styles.uploadButtonText}>Upload</Text>
                        </View>
                    </View>
                    <View style={styles.fileSection}>
                        <AntDesign name='picture' size={20} style={styles.icon} />
                        <Text style={styles.fileText}>Foto 1.png</Text>
                    </View>
                    <View style={styles.fileSection}>
                        <AntDesign name='picture' size={20} style={styles.icon} />
                        <Text style={styles.fileText}>Foto 2.png</Text>
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
        flexGrow: 1,
    },
    headerText: {
        fontSize: 24,
        fontWeight: '500',
        marginLeft: 12,
        marginTop: 8,
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
