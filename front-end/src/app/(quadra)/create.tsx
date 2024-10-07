import BotaoPressable from '@components/botoes/botaoPressable';
import InputTexto from '@components/inputTexto';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View, Text, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import MultiSelect from '@components/IconService';
import globalStyles from '@/src/styles/globalStyles';


export default function NewCourt() {

    const options = [
        { id: '1', label: 'Banheiros' },
        { id: '2', label: 'Alimentação' },
        { id: '3', label: 'Espaço para crianças' },
        { id: '4', label: 'Espaço para pets' },
        { id: '5', label: 'Estacionamento' }
    ];

    const handleSelectionChange = (selected: string[]) => {
        console.log('Selecionados:', selected);
    };

    // Exibe toast e realiza navegação
    const confirmCreate = () => {
        // Atraso para garantir que o toast seja visível antes da navegação
        setTimeout(() => {
            router.replace({
                pathname: '/home',
                params: { message: "Cadastro realizado com sucesso!" }
            });
        }, 600); // Tempo para o toast ser exibido
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View>
                    <Text style={styles.headerText}>Informações Gerais</Text>
                    {/* <InputTexto
                        title={'Nome da quadra'}
                        hint={'Ex: Quadra 2'}
                    />
                    <InputTexto
                        title='Esporte'
                        hint={'Ex: Volei'}
                    />
                    <InputTexto
                        title='Valor por hora'
                        hint={'Ex: R$45,00'}
                    />
                    <InputTexto
                        title='Endereço'
                        hint={'Ex: Av: Nobrega, 239'}
                    />
                    <InputTexto
                        title='Informações adicionais'
                        hint={'Ex: Aos fundos'}
                    /> */}

                    <View className="p-4">
                        <Text className="text-xl mb-4">Selecione uma ou mais opções:</Text>
                        <MultiSelect options={options} onSelectionChange={handleSelectionChange} />
                    </View>
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
            <View style={globalStyles.buttonContainer}>
                <BotaoPressable
                    title={'Cadastrar'}
                    style='bg-primary p-4 rounded-2xl active:bg-secondary mx-4'
                    onPress={confirmCreate} // Chama a função que exibe o toast e navega
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
        borderRadius: 16,
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
});
