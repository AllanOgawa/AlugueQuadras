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

    //estabelecimento
    const [nome, setNome] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [nomeResponsavel, setNomeResponsavel] = useState('');
    const [telefone, setTelefone] = useState('');
    const [informacoes, setInformacoes] = useState('');

    //endereco
    const [cep, SetCep] = useState('');
    const [estado, SetEstado] = useState('');
    const [cidade, SetCidade] = useState('');
    const [bairro, SetBairro] = useState('');
    const [logradouro, SetLogradouro] = useState('');
    const [numero, SetNumero] = useState('');
    const [complemento, SetComplemento] = useState('');


    const [errorNome, setErrorNome] = useState('');
    const [errorCnpj, setErrorCnpj] = useState('');
    const [errorNomeResponsavel, setErrorNomeResponsavel] = useState('');
    const [errorTelefone, setErrorTelefone] = useState('');
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const [errorCep, setErrorCep] = useState('');
    const [errorEstado, setErrorEstado] = useState('');
    const [errorCidade, setErrorCidade] = useState('');
    const [errorBairro, setErrorBairro] = useState('');
    const [errorLogradouro, setErrorLogradouro] = useState('');
    const [errorNumero, SetErrorNumero] = useState('');

    const nomeInputRef = useRef<TextInput>(null);
    const nomeResponsavelInputRef = useRef<TextInput>(null);
    const cnpjInputRef = useRef<TextInput>(null);
    const telefoneInputRef = useRef<TextInput>(null);
    const InformacoesInputRef = useRef<TextInput>(null);

    const CepInputRef = useRef<TextInput>(null);
    const EstadoInputRef = useRef<TextInput>(null);
    const CidadeInputRef = useRef<TextInput>(null);
    const BairroInputRef = useRef<TextInput>(null);
    const LogradouroInputRef = useRef<TextInput>(null);
    const NumeroInputRef = useRef<TextInput>(null);
    const ComplementoInputRef = useRef<TextInput>(null);

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
        setErrorCep(!cep ? "Informe um CEP" : "")
        setErrorEstado(!estado ? "Informe um Estado" : "")
        setErrorCidade(!cidade ? "Informe uma Cidade" : "")
        setErrorBairro(!bairro ? "Informe um Bairro" : "")
        setErrorLogradouro(!logradouro ? "Informe um Logradouro" : "")
        SetErrorNumero(!numero ? "Informe o número do local" : "")

        if (!nome || !cnpj || !nomeResponsavel || !telefone || !cep || !estado || !cidade || !bairro || !logradouro || !numero) {
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
                    <Text className="text-2xl font-semibold">Informações Operacionais:</Text>
                    <Input
                        className='mt-5'
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
                        className='mt-5'
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
                        className='mt-5'
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
                        className='mt-5'
                        ref={telefoneInputRef}
                        label="Telefone para Contato:"
                        obrigatorio
                        errorMessage={errorTelefone}
                        keyboardType="numeric"
                        value={telefone}
                        onChangeText={setTelefone}
                        returnKeyType="next"
                        onSubmitEditing={() => { InformacoesInputRef.current?.focus() }}
                    />
                    <Input
                        className='mt-5'
                        ref={InformacoesInputRef}
                        label="Informações adicionais:"
                        errorMessage={""}
                        value={informacoes}
                        onChangeText={setInformacoes}
                        returnKeyType="done"
                        onSubmitEditing={() => CepInputRef.current?.focus()}
                    />

                    <Text className="text-2xl font-semibold mt-10">Informações de Endereço:</Text>

                    <Input
                        className='mt-5'
                        ref={CepInputRef}
                        label="CEP"
                        obrigatorio={true}
                        errorMessage={errorCep}
                        keyboardType='numeric'
                        value={cep}
                        onChangeText={SetCep}
                        returnKeyType="done"
                        onSubmitEditing={() => EstadoInputRef.current?.focus()}
                    />

                    <Input
                        className='mt-5'
                        ref={EstadoInputRef}
                        label="Estado"
                        obrigatorio={true}
                        errorMessage={errorEstado}
                        keyboardType='default'
                        value={estado}
                        onChangeText={SetEstado}
                        returnKeyType="done"
                        onSubmitEditing={() => CidadeInputRef.current?.focus()}
                    />

                    <Input
                        className='mt-5'
                        ref={CidadeInputRef}
                        label="Cidade"
                        obrigatorio={true}
                        errorMessage={errorCidade}
                        keyboardType='default'
                        value={cidade}
                        onChangeText={SetCidade}
                        returnKeyType="done"
                        onSubmitEditing={() => BairroInputRef.current?.focus()}
                    />

                    <Input
                        className='mt-5'
                        ref={BairroInputRef}
                        label="Bairro"
                        obrigatorio={true}
                        errorMessage={errorBairro}
                        keyboardType='default'
                        value={bairro}
                        onChangeText={SetBairro}
                        returnKeyType="done"
                        onSubmitEditing={() => LogradouroInputRef.current?.focus()}
                    />

                    <Input
                        className='mt-5'
                        ref={LogradouroInputRef}
                        label="Logradouro"
                        obrigatorio={true}
                        errorMessage={errorLogradouro}
                        keyboardType='default'
                        value={logradouro}
                        onChangeText={SetLogradouro}
                        returnKeyType="done"
                        onSubmitEditing={() => NumeroInputRef.current?.focus()}
                    />

                    <Input
                        className='mt-5'
                        ref={NumeroInputRef}
                        label="Número"
                        obrigatorio={true}
                        errorMessage={errorNumero}
                        keyboardType='numeric'
                        value={numero}
                        onChangeText={SetNumero}
                        returnKeyType="done"
                        onSubmitEditing={() => ComplementoInputRef.current?.focus()}
                    />

                    <Input
                        className='mt-5'
                        ref={ComplementoInputRef}
                        label="Complemento"
                        obrigatorio={false}
                        errorMessage={""}
                        keyboardType='default'
                        value={complemento}
                        onChangeText={SetComplemento}
                        returnKeyType="done"
                        onSubmitEditing={() => ComplementoInputRef.current?.blur()}
                    />

                    <Text className="text-2xl font-semibold mt-10">Informações Gerais:</Text>

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
