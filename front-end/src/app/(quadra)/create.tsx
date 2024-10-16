import { SafeAreaView, ScrollView, StatusBar, Text, TextInput, View } from 'react-native';
import Constants from 'expo-constants';
import { useState, useRef } from 'react';
import { router } from 'expo-router';
import Input from '@components/inputs/input';
import BotaoTouchableOpacity from '@components/botoes/botaoTouchableOpacity';
import MultiSelect from '@/src/components/IconService';
import { MaterialIcons } from '@expo/vector-icons';
import SetaVoltar from '@/src/components/setaVoltar';
import BotaoPressable from '@/src/components/botoes/botaoPressable';
import globalStyles from '@/src/styles/globalStyles';

const statusBarHeight = Constants.statusBarHeight;

export default function QuadraCadastro() {
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');
    const [comprimento, setComprimento] = useState('');
    const [largura, setLargura] = useState('');
    const [informacoes, setInformacoes] = useState('');

    const [errorNome, setErrorNome] = useState('');
    const [errorValor, setErrorValor] = useState('');
    const [errorComprimento, setErrorComprimento] = useState('');
    const [errorLargura, setErrorLargura] = useState('');

    const nomeInputRef = useRef<TextInput>(null);
    const valorInputRef = useRef<TextInput>(null);
    const comprimentoInputRef = useRef<TextInput>(null);
    const larguraInputRef = useRef<TextInput>(null);
    const InformacoesInputRef = useRef<TextInput>(null);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const handleSelectionChange = (selected: string[]) => {
        setSelectedOptions(selected);
        console.log('Selecionados:', selected);
    };

    const options = [
        { id: '1', label: 'Banheiros' },
        { id: '2', label: 'Alimentação' },
        { id: '3', label: 'Espaço para crianças' },
        { id: '4', label: 'Espaço para pets' },
        { id: '5', label: 'Estacionamento' }
    ];

    const handleSubmit = () => {
        let hasError = false;

        // Validações dos campos
        setErrorNome(!nome ? "O campo Nome é obrigatório." : "");
        setErrorValor(!valor ? "O campo Valor é obrigatório." : "");
        setErrorComprimento(!comprimento ? "O campo Comprimento é obrigatório." : "");
        setErrorLargura(!largura ? "O campo Largura é obrigatório." : "");

        if (!nome || !valor || !comprimento || !largura) {
            hasError = true;
        }

        if (!hasError) {
            setTimeout(() => {
                router.replace({
                    pathname: '/home',
                    params: { message: "Cadastro de quadra realizado com sucesso!" }
                });
            }, 600);
        } else {
            console.log("Erro: Preencha todos os campos obrigatórios.");
        }
    };

    function confirmCreate(): void {
        throw new Error('Function not implemented.');
    }

    return (
        <SafeAreaView className="flex-1 bg-white" style={{ marginTop: statusBarHeight + 8 }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <SetaVoltar />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="w-full px-4">
                    <Text className="text-4xl font-semibold mt-10 mb-5">Cadastrar Quadra</Text>

                    <Input
                        ref={nomeInputRef}
                        label="Nome da Quadra:"
                        obrigatorio
                        errorMessage={errorNome}
                        value={nome}
                        onChangeText={setNome}
                        returnKeyType="next"
                        onSubmitEditing={() => valorInputRef.current?.focus()}
                    />
                    <Input
                        ref={valorInputRef}
                        label="Valor por Hora:"
                        obrigatorio
                        errorMessage={errorValor}
                        keyboardType="numeric"
                        value={valor}
                        onChangeText={setValor}
                        returnKeyType="next"
                        onSubmitEditing={() => comprimentoInputRef.current?.focus()}
                    />
                    <Input
                        ref={comprimentoInputRef}
                        label="Comprimento (m):"
                        obrigatorio
                        errorMessage={errorComprimento}
                        keyboardType="numeric"
                        value={comprimento}
                        onChangeText={setComprimento}
                        returnKeyType="next"
                        onSubmitEditing={() => larguraInputRef.current?.focus()}
                    />
                    <Input
                        ref={larguraInputRef}
                        label="Largura (m):"
                        obrigatorio
                        errorMessage={errorLargura}
                        keyboardType="numeric"
                        value={largura}
                        onChangeText={setLargura}
                        returnKeyType="done"
                    />
                    <Input
                        ref={InformacoesInputRef}
                        label="Informações adicionais:"
                        errorMessage={""}
                        keyboardType="numeric"
                        value={informacoes}
                        onChangeText={setInformacoes}
                        returnKeyType="done"
                    />

                    <View>
                        <Text className="text-lg mt-4">Selecione uma ou mais opções:</Text>
                        <MultiSelect options={options} onSelectionChange={handleSelectionChange} />
                    </View>

                    <View>
                        <Text className='h-14 text-lg mt-4'>Insira algumas fotos do local:</Text>
                        <View className='bg-slate-400 items-center rounded-xl p-2'>
                            <MaterialIcons name="upload" size={20} color="#ffff" />
                            <Text className='color-white'>Upload</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={globalStyles.buttonContainer}>
                <BotaoPressable
                    title={'Cadastrar'}
                    className='bg-primary p-4 rounded-2xl active:bg-secondary mx-4'
                    classNameTitle="text-white text-center text-xl"
                    onPress={confirmCreate} // Chama a função que exibe o toast e navega
                />
            </View>
        </SafeAreaView>
    );
}
