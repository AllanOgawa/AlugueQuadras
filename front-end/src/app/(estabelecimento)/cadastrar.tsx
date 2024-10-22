import { ActivityIndicator, SafeAreaView, ScrollView, StatusBar, Text, TextInput, View } from 'react-native';
import Constants from 'expo-constants';
import { useState, useRef } from 'react';
import { router } from 'expo-router';
import Input from '@components/inputs/input';
import BotaoTouchableOpacity from '@components/botoes/botaoTouchableOpacity';
import { MaterialIcons } from '@expo/vector-icons';
import SetaVoltar from '@/src/components/setaVoltar';
import Loading from '@/src/components/loading';
import globalStyles from '@/src/styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import MultiSelect from '@/src/components/IconService';

const statusBarHeight = Constants.statusBarHeight;

const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';

export default function EstabelecimentoCadastro() {
    const [loading, setLoading] = useState(false);
    const [isAppReady, setIsAppReady] = useState(true);

    // estabelecimento
    const [nome, setNome] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [telefone, setTelefone] = useState('');
    const [razaoSocial, setRazaoSocial] = useState('');
    const [email, setEmail] = useState('');
    const [alvara, setAlvara] = useState('');

    // endereco
    const [cep, SetCep] = useState('');
    const [estado, SetEstado] = useState('');
    const [cidade, SetCidade] = useState('');
    const [bairro, SetBairro] = useState('');
    const [logradouro, SetLogradouro] = useState('');
    const [numero, SetNumero] = useState('');
    const [complemento, SetComplemento] = useState('');

    // validation errors
    const [errorNome, setErrorNome] = useState('');
    const [errorCnpj, setErrorCnpj] = useState('');
    const [errorTelefone, setErrorTelefone] = useState('');
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [errorRazaoSocial, setErrorRazaoSocial] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorAlvara, setErrorAlvara] = useState('');


    // erros endereco
    const [errorEndereco, setErrorEndereco] = useState('');
    const [errorCep, setErrorCep] = useState('');
    const [errorEstado, setErrorEstado] = useState('');
    const [errorCidade, setErrorCidade] = useState('');
    const [errorBairro, setErrorBairro] = useState('');
    const [errorLogradouro, setErrorLogradouro] = useState('');
    const [errorNumero, setErrorNumero] = useState('');

    // refs
    const nomeInputRef = useRef<TextInput>(null);
    const nomeResponsavelInputRef = useRef<TextInput>(null);
    const cnpjInputRef = useRef<TextInput>(null);
    const telefoneInputRef = useRef<TextInput>(null);
    const InformacoesInputRef = useRef<TextInput>(null);
    const razaoSocialInputRef = useRef<TextInput>(null);
    const emailInputRef = useRef<TextInput>(null);

    const EnderecoInputRef = useRef<TextInput>(null);
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
        console.log(estabelecimento);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let hasError = false;

        // Validações dos campos
        setErrorNome(!nome ? "O campo Nome é obrigatório." : "");
        setErrorCnpj(!cnpj ? "O campo CNPJ é obrigatório." : "");
        setErrorTelefone(!telefone ? "O campo Telefone é obrigatório." : "");
        setErrorCep(!cep ? "Informe um CEP" : "");
        setErrorAlvara(!alvara ? "O campo Alvará é obrigatório" : "");
        setErrorEmail(!email ? "O campo Email é obrigatório" : "");
        setErrorRazaoSocial(!razaoSocial ? "O campo Razão Social é obrigatório." : "");


        setErrorCidade(!cidade ? "O campo Cidade é obrigatório." : "");
        setErrorBairro(!bairro ? "O campo Bairro é obrigatório." : "");
        setErrorLogradouro(!logradouro ? "O campo Logradouro é obrigatório." : "");
        setErrorNumero(!numero ? "O campo Número é obrigatório." : "");
        setErrorEstado(!estado ? "O campo Estado é obrigatório." : "");


        if (!nome || !cnpj || !telefone || !cep || !alvara || !email || !razaoSocial || !cidade || !bairro || !logradouro || !numero || !estado) {
            hasError = true;
        }

        if (!hasError) {
            getData();
        } else {
            console.log("Erro: Preencha todos os campos obrigatórios.");
        }
    };

    function formatCNPJ(value: string) {
        return value
            .replace(/\D/g, '') // Remove tudo que não for dígito
            .replace(/(\d{2})(\d)/, '$1.$2') // Coloca o primeiro ponto
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca o segundo ponto
            .replace(/(\d{3})(\d)/, '$1/$2') // Coloca a barra
            .replace(/(\d{4})(\d)/, '$1-$2') // Coloca o hífen
            .replace(/(-\d{2})\d+?$/, '$1'); // Limita a 14 dígitos
    }

    function formatCEP(value: string) {
        return value
            .replace(/\D/g, '') // Remove tudo que não for dígito
            .replace(/(\d{5})(\d)/, '$1-$2') // Coloca o hífen
            .replace(/(-\d{3})\d+?$/, '$1'); // Limita a 9 dígitos
    }

    function formatTelefone(value: string) {
        return value
            .replace(/\D/g, '') // Remove tudo que não for dígito
            .replace(/(\d{2})(\d)/, '($1) $2') // Coloca o DDD
            .replace(/(\d{5})(\d)/, '$1-$2') // Coloca o hífen
            .replace(/(-\d{4})\d+?$/, '$1'); // Limita a 14 dígitos
    }

    const handleTelefoneChange = (value: string) => {
        const formattedTelefone = formatTelefone(value);
        setTelefone(formattedTelefone); // Atualiza o estado com o telefone formatado
    }

    const handleCEPChange = (value: string) => {
        const formattedCEP = formatCEP(value);
        SetCep(formattedCEP); // Atualiza o estado com o CEP formatado
    };

    const handleCNPJChange = (value: string) => {
        const formattedCNPJ = formatCNPJ(value);
        setCnpj(formattedCNPJ); // Atualiza o estado com o CNPJ formatado
    };

    async function getData() {
        try {
            const value = await AsyncStorage.getItem("access_token");
            if (value !== null && value !== "") {
                // If the access token exists, continue to cadastro logic
                setIsAppReady(true)
                cadastrar(value);
            } else {
                // If no access token, allow the app to render the screen
                setIsAppReady(true);
            }
        } catch (e) {
            console.error('Erro ao obter dados', e);
            // In case of an error, allow the app to render the screen
            setIsAppReady(true);
        }
    };

    const estabelecimento = {
        cnpj: cnpj.replace(/\D/g, ''),
        nome: nome,
        razaoSocial: razaoSocial,
        telefone: telefone.replace(/\D/g, ''),
        email: email,
        alvara: alvara,
        endereco: {
            cep: cep.replace(/\D/g, ''),
            estado: estado,
            cidade: cidade,
            bairro: bairro,
            logradouro: logradouro,
            numero: numero,
            complemento: complemento
        },
        imagensToAdd: [
            "estabelecimento/imagem1.jpg",
            "estabelecimento/imagem2.png"
        ]
    }

    async function cadastrar(access_token: string) {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/estabelecimento/new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
                body: JSON.stringify(estabelecimento)
            });

            const data = await response.json();

            if (response.ok) {
                Toast.show({
                    type: 'success',
                    text1: "Cadastro Realizado com Sucesso",
                    text2: "Bem-vindo ao AlugueQuadras!",
                });
                router.replace('/menu');
            } else {
                Toast.show({
                    type: 'error',
                    text1: "Cadastro Falhou",
                    text2: data.message,
                });
            }
        } catch (error) {
            console.log('Erro no cadastro', error);
            Toast.show({
                type: 'error',
                text1: "Cadastro falhou",
                text2: String(error),
            });
        } finally {
            setLoading(false);  // Stop showing the loading indicator
            setIsAppReady(true);  // Ensure the app is marked as ready
        }
    }

    if (!isAppReady) {
        return (
            <View className='rounded-2xl flex-1 justify-center items-center'>
                <ActivityIndicator size="large" className='color-primary' />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white" style={{ marginTop: statusBarHeight }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <SetaVoltar />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="w-full px-3">
                    <Text className="text-4xl font-semibold mt-5 mb-5">Cadastro Estabelecimento</Text>
                    <Text className="text-2xl font-semibold">Informações Operacionais:</Text>
                    <Input
                        className='mt-5'
                        ref={nomeInputRef}
                        label="Nome do Estabelecimento:"
                        obrigatorio
                        errorMessage={errorNome}
                        value={nome}
                        onChangeText={setNome}

                    />
                    <Input
                        className='mt-5'
                        ref={cnpjInputRef}
                        label="CNPJ:"
                        obrigatorio
                        errorMessage={errorCnpj}
                        value={cnpj}
                        keyboardType="numeric"
                        onChangeText={handleCNPJChange}
                        maxLength={18}
                    />
                    <Input
                        className='mt-5'
                        ref={telefoneInputRef}
                        label="Telefone:"
                        obrigatorio
                        errorMessage={errorTelefone}
                        value={telefone}
                        keyboardType="phone-pad"
                        onChangeText={handleTelefoneChange}
                    />
                    <Input
                        className='mt-5'
                        ref={razaoSocialInputRef}
                        label="Razão Social:"
                        obrigatorio
                        errorMessage={errorRazaoSocial}
                        value={razaoSocial}
                        onChangeText={setRazaoSocial}
                        autoCapitalize='none'
                    />
                    <Input
                        className='mt-5'
                        ref={emailInputRef}
                        label="Email:"
                        obrigatorio
                        errorMessage={errorEmail}
                        value={email}
                        keyboardType="email-address"
                        onChangeText={setEmail}
                        autoCapitalize='none'
                    />
                    <Input
                        className='mt-5'
                        ref={InformacoesInputRef}
                        label="Alvará de Funcionamento:"
                        obrigatorio
                        errorMessage={errorAlvara}
                        value={alvara}
                        onChangeText={setAlvara}
                        autoCapitalize='none'
                    />

                    <Text className="text-2xl font-semibold mt-6">Endereço:</Text>

                    <Input
                        className='mt-5'
                        ref={CepInputRef}
                        label="CEP:"
                        obrigatorio
                        errorMessage={errorCep}
                        value={cep}
                        keyboardType="numeric"
                        onChangeText={handleCEPChange}
                    />
                    <Input
                        className='mt-5'
                        ref={EstadoInputRef}
                        label="Estado(Sigla):"
                        obrigatorio
                        errorMessage={errorEstado}
                        value={estado}
                        onChangeText={SetEstado}
                        maxLength={2}
                    />
                    <Input
                        className='mt-5'
                        ref={CidadeInputRef}
                        label="Cidade:"
                        obrigatorio
                        errorMessage={errorCidade}
                        value={cidade}
                        onChangeText={SetCidade}
                    />
                    <Input
                        className='mt-5'
                        ref={BairroInputRef}
                        label="Bairro:"
                        obrigatorio
                        errorMessage={errorBairro}
                        value={bairro}
                        onChangeText={SetBairro}
                    />
                    <Input
                        className='mt-5'
                        ref={LogradouroInputRef}
                        label="Logradouro:"
                        obrigatorio
                        errorMessage={errorLogradouro}
                        value={logradouro}
                        onChangeText={SetLogradouro}
                    />
                    <Input
                        className='mt-5'
                        ref={NumeroInputRef}
                        label="Número:"
                        obrigatorio
                        errorMessage={errorNumero}
                        value={numero}
                        keyboardType="numeric"
                        onChangeText={SetNumero}
                    />
                    <Input
                        className='mt-5'
                        ref={ComplementoInputRef}
                        label="Complemento:"
                        value={complemento}
                        onChangeText={SetComplemento}
                    />

                    <Text className="text-2xl font-semibold mt-6">Acomocações:</Text>
                    <MultiSelect
                        options={options}
                        selectedOptions={selectedOptions}
                        onSelectionChange={handleSelectionChange}
                        icon={<MaterialIcons name="check-box" size={24} color="black" />}
                    />
                </View>
            </ScrollView>
            <View style={globalStyles.buttonContainer}>
                <BotaoTouchableOpacity
                    title={'Cadastrar'}
                    className='bg-primary p-4 rounded-2xl active:bg-secondary mx-4'
                    classNameTitle="text-white text-center text-xl"
                    onPress={handleSubmit}
                />
            </View>
            {loading && <Loading />}
        </SafeAreaView>
    );
}
