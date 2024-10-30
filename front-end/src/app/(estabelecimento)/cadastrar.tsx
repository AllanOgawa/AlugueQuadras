import { ActivityIndicator, SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import Input from '@components/inputs/input';
import BotaoTouchableOpacity from '@components/botoes/botaoTouchableOpacity';
import { MaterialIcons } from '@expo/vector-icons';
import SetaVoltar from '@/src/components/setaVoltar';
import Loading from '@/src/components/loading';
import globalStyles from '@/src/styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import MultiSelect from '@/src/components/IconService';
import { EstabelecimentoProps, EnderecoProps } from '@/src/interfaces/estabelecimento';

const statusBarHeight = Constants.statusBarHeight;
const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';

const initialEnderecoState: EnderecoProps = {
    idkey: 0,
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    dataCadastro: '',
    dataAtualizacao: ''
};

// Funções auxiliares para formatação
function formatCNPJ(value: string) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
}

function formatCEP(value: string) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1');
}

function formatTelefone(value: string) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
}

function removePontuacao(value: string) {
    return value.replace(/\D/g, ''); // Remove tudo que não for dígito
}


export default function EstabelecimentoCadastro() {
    const { estabelecimento } = useLocalSearchParams();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [idkey, setIdkey] = useState<number | null>(null);
    const [estabelecimentoData, setEstabelecimentoData] = useState<Omit<EstabelecimentoProps, 'endereco' | 'imagens' | 'quadras'>>({
        idkey: 0,
        nome: '',
        cnpj: ''.replace(/\D/g, ''),
        telefone: ''.replace(/\D/g, ''),
        razaoSocial: '',
        email: '',
        alvara: '',
        dataCadastro: '',
        dataAtualizacao: ''
    });
    const [enderecoData, setEnderecoData] = useState<EnderecoProps>(initialEnderecoState);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const options = [
        { id: '1', label: 'Banheiros' },
        { id: '2', label: 'Alimentação' },
        { id: '3', label: 'Espaço para crianças' },
        { id: '4', label: 'Espaço para pets' },
        { id: '5', label: 'Estacionamento' }
    ];



    useEffect(() => {
        if (estabelecimento) {
            const parsedEstabelecimento: EstabelecimentoProps = typeof estabelecimento === 'string'
                ? JSON.parse(estabelecimento)
                : estabelecimento;

            setIsEditing(true);
            setIdkey(parsedEstabelecimento.idkey);
            setEstabelecimentoData(parsedEstabelecimento);
            setEnderecoData(parsedEstabelecimento.endereco);
        } else {
            setIsEditing(false);
        }
    }, [estabelecimento]);

    const handleInputChange = (field: keyof EstabelecimentoProps, value: string) => {
        setEstabelecimentoData(prev => ({ ...prev, [field]: value }));
    };

    const handleEnderecoChange = (field: keyof EnderecoProps, value: string) => {
        setEnderecoData(prev => ({ ...prev, [field]: value }));
    };

    // Manipuladores de formatação para atualização de estado
    const handleTelefoneChange = (value: string) => handleInputChange('telefone', formatTelefone(value));
    const handleCEPChange = (value: string) => handleEnderecoChange('cep', formatCEP(value));
    const handleCNPJChange = (value: string) => handleInputChange('cnpj', formatCNPJ(value));

    const validateFields = () => {
        const { nome, cnpj, telefone, razaoSocial, email, alvara } = estabelecimentoData;
        const { cep, logradouro, estado, cidade, bairro, numero } = enderecoData;
        const errors: { [key: string]: string } = {};

        if (!nome) errors.nome = "O campo Nome é obrigatório.";
        if (!cnpj) errors.cnpj = "O campo CNPJ é obrigatório.";
        if (!telefone) errors.telefone = "O campo Telefone é obrigatório.";
        if (!cep) errors.cep = "Informe um CEP";
        if (!alvara) errors.alvara = "O campo Alvará é obrigatório";
        if (!email) errors.email = "O campo Email é obrigatório.";
        if (!razaoSocial) errors.razaoSocial = "O campo Razão Social é obrigatório.";

        return Object.keys(errors).length ? errors : null;
    };

    const handleSubmit = async () => {
        const errors = validateFields();
        if (!errors) {
            isEditing ? await editarEstabelecimento() : await cadastrarEstabelecimento();
        } else {
            Object.keys(errors).forEach(key => {
                Toast.show({ type: 'error', text1: errors[key] });
            });
        }
    };

    const cadastrarEstabelecimento = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('access_token');

            // Estruturando o objeto com os campos necessários
            const payload = {
                cnpj: removePontuacao(estabelecimentoData.cnpj),          // Remove pontuação do CNPJ
                razaoSocial: estabelecimentoData.razaoSocial,
                nome: estabelecimentoData.nome,
                telefone: estabelecimentoData.telefone,
                email: estabelecimentoData.email,
                alvara: estabelecimentoData.alvara,
                endereco: {
                    logradouro: enderecoData.logradouro,
                    numero: enderecoData.numero,
                    complemento: enderecoData.complemento,
                    bairro: enderecoData.bairro,
                    cidade: enderecoData.cidade,
                    estado: enderecoData.estado,
                    cep: removePontuacao(enderecoData.cep)                // Remove pontuação do CEP
                },
                imagensToAdd: [
                    "estabelecimento/imagem1.jpg",
                    "estabelecimento/imagem2.png"
                ]
            };

            console.log('Dados enviados no cadastro:', payload);

            const response = await fetch(`${apiUrl}/estabelecimento/new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
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
                    ...estabelecimentoData,
                    cnpj: removePontuacao(estabelecimentoData.cnpj),
                    telefone: removePontuacao(estabelecimentoData.telefone),
                    endereco: {
                        ...enderecoData,
                        cep: removePontuacao(enderecoData.cep)
                    }
                }),
            });
            const data = await response.json();
            response.ok
                ? Toast.show({ type: 'success', text1: 'Edição Realizada com Sucesso' })
                : Toast.show({ type: 'error', text1: 'Falha na Edição', text2: data.message });
            router.replace('/menu');
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
                    <Input label="Nome do Estabelecimento" value={estabelecimentoData.nome} onChangeText={value => handleInputChange('nome', value)} className='mt-5' />
                    <Input label="CNPJ" value={estabelecimentoData.cnpj} onChangeText={handleCNPJChange} keyboardType="numeric" maxLength={18} className='mt-5' />
                    <Input label="Telefone" value={estabelecimentoData.telefone} onChangeText={handleTelefoneChange} keyboardType="phone-pad" className='mt-5' />
                    <Input label="Razão Social" value={estabelecimentoData.razaoSocial} onChangeText={value => handleInputChange('razaoSocial', value)} className='mt-5' />
                    <Input label="Email" value={estabelecimentoData.email} onChangeText={value => handleInputChange('email', value)} keyboardType="email-address" className='mt-5' />
                    <Input label="Alvará de Funcionamento" value={estabelecimentoData.alvara} onChangeText={value => handleInputChange('alvara', value)} className='mt-5' />

                    <Text className="text-2xl font-semibold mt-6">Endereço:</Text>
                    <Input label="CEP" value={enderecoData.cep} onChangeText={handleCEPChange} keyboardType="numeric" className='mt-5' />
                    <Input label="Estado" value={enderecoData.estado} onChangeText={value => handleEnderecoChange('estado', value)} maxLength={2} className='mt-5' />
                    <Input label="Cidade" value={enderecoData.cidade} onChangeText={value => handleEnderecoChange('cidade', value)} className='mt-5' />
                    <Input label="Bairro" value={enderecoData.bairro} onChangeText={value => handleEnderecoChange('bairro', value)} className='mt-5' />
                    <Input label="Logradouro" value={enderecoData.logradouro} onChangeText={value => handleEnderecoChange('logradouro', value)} className='mt-5' />
                    <Input label="Número" value={enderecoData.numero} onChangeText={value => handleEnderecoChange('numero', value)} keyboardType="numeric" className='mt-5' />
                    <Input label="Complemento" value={enderecoData.complemento} onChangeText={value => handleEnderecoChange('complemento', value)} className='mt-5' />

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
