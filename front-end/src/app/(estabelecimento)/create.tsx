import { SafeAreaView, ScrollView, StatusBar, Text, TextInput, View } from 'react-native';
import Constants from 'expo-constants';
import { useState, useRef } from 'react';
import { router } from 'expo-router';
import Input from '@components/inputs/input';
import BotaoTouchableOpacity from '@components/botoes/botaoTouchableOpacity';
import MultiSelect from '@/src/components/IconService';
import { MaterialIcons } from '@expo/vector-icons';
import SetaVoltar from '@/src/components/setaVoltar';

const statusBarHeight = Constants.statusBarHeight;

export default function EstabelecimentoCadastro() {
    const [nome, setNome] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [nomeResponsavel, setNomeResponsavel] = useState('');
    const [telefone, setTelefone] = useState('');
    const [informacoes, setInformacoes] = useState('');

    const [errorNome, setErrorNome] = useState('');
    const [errorCnpj, setErrorCnpj] = useState('');
    const [errorNomeResponsavel, setErrorNomeResponsavel] = useState('');
    const [errorTelefone, setErrorTelefone] = useState('');
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const nomeInputRef = useRef<TextInput>(null);
    const nomeResponsavelInputRef = useRef<TextInput>(null);
    const cnpjInputRef = useRef<TextInput>(null);
    const telefoneInputRef = useRef<TextInput>(null);
    const InformacoesInputRef = useRef<TextInput>(null);

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
        setErrorCnpj(!cnpj ? "O campo CNPJ é obrigatório." : "");
        setErrorNomeResponsavel(!nomeResponsavel ? "O campo Nome do responsável é obrigatório." : "");
        setErrorTelefone(!telefone ? "O campo Telefone é obrigatório." : "");

        if (!nome || !cnpj || !nomeResponsavel || !telefone) {
            hasError = true;
        }

        if (!hasError) {
            setTimeout(() => {
                router.replace({
                    pathname: '/home',
                    params: { message: "Estabelecimento cadastrado!" }
                });
            }, 600);
        } else {
            console.log("Erro: Preencha todos os campos obrigatórios.");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white" style={{ marginTop: statusBarHeight }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <SetaVoltar />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="w-full px-3">
                    <Text className="text-4xl font-semibold mt-5 mb-5">Cadastrar Estabelecimento</Text>
                    <Input
                        ref={nomeInputRef}
                        label="Nome do Estabelecimento:"
                        obrigatorio
                        errorMessage={errorNome}
                        value={nome}
                        onChangeText={setNome}
                        returnKeyType="next"
                        onSubmitEditing={() => nomeResponsavelInputRef.current?.focus()}
                    />
                    <Input
                        ref={cnpjInputRef}
                        label="CNPJ:"
                        obrigatorio
                        errorMessage={errorCnpj}
                        value={cnpj}
                        onChangeText={setCnpj}
                        returnKeyType="next"
                        onSubmitEditing={() => nomeResponsavelInputRef.current?.focus()}
                    />
                    <Input
                        ref={nomeResponsavelInputRef}
                        label="Nome do Resposável:"
                        obrigatorio
                        errorMessage={errorNomeResponsavel}
                        value={nomeResponsavel}
                        onChangeText={setNomeResponsavel}
                        returnKeyType="next"
                        onSubmitEditing={() => cnpjInputRef.current?.focus()}
                    />
                    <Input
                        ref={telefoneInputRef}
                        label="Telefone para Contato:"
                        obrigatorio
                        errorMessage={errorTelefone}
                        keyboardType="numeric"
                        value={telefone}
                        onChangeText={setTelefone}
                        returnKeyType="next"
                        onSubmitEditing={() => { }}
                    />
                    <Input
                        ref={InformacoesInputRef}
                        label="Informações adicionais:"
                        errorMessage={""}
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
            <View style={{ padding: 16 }}>
                <BotaoTouchableOpacity
                    title={'Cadastrar Estabelecimento'}
                    className='bg-primary p-4 rounded-2xl active:bg-secondary'
                    onPress={handleSubmit}
                />
            </View>
        </SafeAreaView>
    );
}
