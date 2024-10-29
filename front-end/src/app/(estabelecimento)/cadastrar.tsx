import { ActivityIndicator, SafeAreaView, ScrollView, StatusBar, Text, TextInput, View } from 'react-native';
import Constants from 'expo-constants';
import { useState, useEffect, useRef } from 'react';
import { router, useLocalSearchParams } from 'expo-router';  // Importar useLocalSearchParams para pegar os parâmetros da rota
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
    const { estabelecimento } = useLocalSearchParams(); // Recupera o parâmetro da rota
    const [isEditing, setIsEditing] = useState(false); // Verifica se é edição ou cadastro

    const [idkey, setIdkey] = useState(null); // Para armazenar o ID
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
    const [errorCep, setErrorCep] = useState('');
    const [errorEstado, setErrorEstado] = useState('');
    const [errorCidade, setErrorCidade] = useState('');
    const [errorBairro, setErrorBairro] = useState('');
    const [errorLogradouro, setErrorLogradouro] = useState('');
    const [errorNumero, setErrorNumero] = useState('');

    // refs
    const nomeInputRef = useRef<TextInput>(null);
    const cnpjInputRef = useRef<TextInput>(null);
    const telefoneInputRef = useRef<TextInput>(null);
    const razaoSocialInputRef = useRef<TextInput>(null);
    const emailInputRef = useRef<TextInput>(null);
    const InformacoesInputRef = useRef<TextInput>(null);
    const CepInputRef = useRef<TextInput>(null);
    const EstadoInputRef = useRef<TextInput>(null);
    const CidadeInputRef = useRef<TextInput>(null);
    const BairroInputRef = useRef<TextInput>(null);
    const LogradouroInputRef = useRef<TextInput>(null);
    const NumeroInputRef = useRef<TextInput>(null);
    const ComplementoInputRef = useRef<TextInput>(null);

    const options = [
        { id: '1', label: 'Banheiros' },
        { id: '2', label: 'Alimentação' },
        { id: '3', label: 'Espaço para crianças' },
        { id: '4', label: 'Espaço para pets' },
        { id: '5', label: 'Estacionamento' }
    ];

    // Verificar se o parâmetro `estabelecimento` foi passado e preencher os estados
    useEffect(() => {
        if (estabelecimento) {
            const parsedEstabelecimento = JSON.parse(estabelecimento); // Converte de JSON string para objeto
            setIdkey(parsedEstabelecimento.idkey || null);
            setNome(parsedEstabelecimento.nome || '');
            setCnpj(parsedEstabelecimento.cnpj || '');
            setTelefone(parsedEstabelecimento.telefone || '');
            setRazaoSocial(parsedEstabelecimento.razaoSocial || '');
            setEmail(parsedEstabelecimento.email || '');
            setAlvara(parsedEstabelecimento.alvara || '');

            if (parsedEstabelecimento.endereco) {
                SetCep(parsedEstabelecimento.endereco.cep || '');
                SetEstado(parsedEstabelecimento.endereco.estado || '');
                SetCidade(parsedEstabelecimento.endereco.cidade || '');
                SetBairro(parsedEstabelecimento.endereco.bairro || '');
                SetLogradouro(parsedEstabelecimento.endereco.logradouro || '');
                SetNumero(parsedEstabelecimento.endereco.numero || '');
                SetComplemento(parsedEstabelecimento.endereco.complemento || '');
            }
            setIsEditing(true); // Está no modo de edição
        } else {
            setIsEditing(false); // Está no modo de cadastro
        }
    }, [estabelecimento]);

    // Função para lidar com a submissão, verificando se é edição ou cadastro
    const handleSubmit = () => {
        const hasError = validateFields();
        if (!hasError) {
            if (isEditing) {
                editarEstabelecimento();
            } else {
                cadastrarEstabelecimento();
            }
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

    const validateFields = () => {
        let hasError = false;
        setErrorNome(!nome ? "O campo Nome é obrigatório." : "");
        setErrorCnpj(!cnpj ? "O campo CNPJ é obrigatório." : "");
        setErrorTelefone(!telefone ? "O campo Telefone é obrigatório." : "");
        setErrorCep(!cep ? "Informe um CEP" : "");
        setErrorAlvara(!alvara ? "O campo Alvará é obrigatório" : "");
        setErrorEmail(!email ? "O campo Email é obrigatório." : "");
        setErrorRazaoSocial(!razaoSocial ? "O campo Razão Social é obrigatório." : "");

        if (!nome || !cnpj || !telefone || !cep || !alvara || !email || !razaoSocial) {
            hasError = true;
        }
        return hasError;
    };

    const cadastrarEstabelecimento = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('access_token');
            const response = await fetch(`${apiUrl}/estabelecimento/new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(estabelecimento),
            });
            const data = await response.json();
            if (response.ok) {
                Toast.show({ type: 'success', text1: 'Cadastro Realizado com Sucesso' });
                router.replace('/menu');
            } else {
                Toast.show({ type: 'error', text1: 'Falha no Cadastro', text2: data.message });
            }
        } catch (error) {
            console.error('Erro no cadastro', error);
        } finally {
            setLoading(false);
        }
    };

    const editarEstabelecimento = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('access_token');
            const response = await fetch(`${apiUrl}/estabelecimento/edit/${idkey}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nome: nome,
                    telefone: telefone,
                    email: email,
                    alvara: alvara,
                    endereco: {
                        logradouro: logradouro,
                        numero: numero,
                        bairro: bairro,
                        cidade: cidade,
                        estado: estado,
                        cep: cep
                    }
                }),
            });
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                Toast.show({ type: 'success', text1: 'Edição Realizada com Sucesso' });
                router.replace('/menu');
            } else {
                console.log(data);
                Toast.show({ type: 'error', text1: 'Falha na Edição', text2: data.message });
            }
        } catch (error) {
            console.error('Erro na edição', error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <SafeAreaView className="flex-1 bg-white" style={{ marginTop: statusBarHeight }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <SetaVoltar />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="w-full px-3">
                    <Text className="text-4xl font-semibold mt-5 mb-5">
                        {isEditing ? "Editar Estabelecimento" : "Cadastro Estabelecimento"}
                    </Text>
                    {/* Informações Operacionais */}
                    <Input label="Nome do Estabelecimento" value={nome} onChangeText={setNome} errorMessage={errorNome} className='mt-5' />
                    <Input label="CNPJ" value={cnpj} onChangeText={handleCNPJChange} errorMessage={errorCnpj} keyboardType="numeric" maxLength={18} className='mt-5' />
                    <Input label="Telefone" value={telefone} onChangeText={handleTelefoneChange} errorMessage={errorTelefone} keyboardType="phone-pad" className='mt-5' />
                    <Input label="Razão Social" value={razaoSocial} onChangeText={setRazaoSocial} errorMessage={errorRazaoSocial} className='mt-5' />
                    <Input label="Email" value={email} onChangeText={setEmail} errorMessage={errorEmail} keyboardType="email-address" className='mt-5' />
                    <Input label="Alvará de Funcionamento" value={alvara} onChangeText={setAlvara} errorMessage={errorAlvara} className='mt-5' />

                    {/* Endereço */}
                    <Text className="text-2xl font-semibold mt-6">Endereço:</Text>
                    <Input label="CEP" value={cep} onChangeText={handleCEPChange} errorMessage={errorCep} keyboardType="numeric" className='mt-5' />
                    <Input label="Estado" value={estado} onChangeText={SetEstado} errorMessage={errorEstado} maxLength={2} className='mt-5' />
                    <Input label="Cidade" value={cidade} onChangeText={SetCidade} errorMessage={errorCidade} className='mt-5' />
                    <Input label="Bairro" value={bairro} onChangeText={SetBairro} errorMessage={errorBairro} className='mt-5' />
                    <Input label="Logradouro" value={logradouro} onChangeText={SetLogradouro} errorMessage={errorLogradouro} className='mt-5' />
                    <Input label="Número" value={numero} onChangeText={SetNumero} errorMessage={errorNumero} keyboardType="numeric" className='mt-5' />
                    <Input label="Complemento" value={complemento} onChangeText={SetComplemento} className='mt-5' />

                    {/* Acomodações */}
                    <Text className="text-2xl font-semibold mt-6">Acomodações:</Text>
                    <MultiSelect options={options} selectedOptions={selectedOptions} onSelectionChange={setSelectedOptions} icon={<MaterialIcons name="check-box" size={24} color="black" />} />
                </View>
            </ScrollView>
            <View style={globalStyles.buttonContainer}>
                <BotaoTouchableOpacity title={isEditing ? 'Salvar Alterações' : 'Cadastrar'} onPress={handleSubmit} className='bg-primary p-4 rounded-2xl active:bg-secondary mx-4' classNameTitle="text-white text-center text-xl" />
            </View>
            {loading && <Loading />}
        </SafeAreaView>
    );
}
