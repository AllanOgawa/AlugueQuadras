import React, { useEffect, useRef, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
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
import { EnderecoProps } from '@/src/interfaces/estabelecimento';
import UploadImage from '@components/UploadImagem';

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
    return value.replace(/\D/g, '');
}

export default function CadastroEstabelecimento() {
    const [loading, setLoading] = useState(false);
    const [imagensExistentes, setImagensExistentes] = useState<string[]>([]);
    const [imagensToRemove, setImagensToRemove] = useState<string[]>([]);
    const [estabelecimentoData, setEstabelecimentoData] = useState({
        nome: '',
        cnpj: '',
        telefone: '',
        razaoSocial: '',
        email: '',
        alvara: '',
        imagens: []
    });
    const [enderecoData, setEnderecoData] = useState<EnderecoProps>(initialEnderecoState);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [imagensToAdd, setImagensToAdd] = useState<string[]>([]);
    const uploadImageRef = useRef<{ uploadAllImages: () => Promise<string[]> } | null>(null);

    const options = [
        { id: '1', label: 'Banheiros' },
        { id: '2', label: 'Alimentação' },
        { id: '3', label: 'Espaço para crianças' },
        { id: '4', label: 'Espaço para pets' },
        { id: '5', label: 'Estacionamento' }
    ];

    const handleInputChange = (field: keyof typeof estabelecimentoData, value: string) => {
        setEstabelecimentoData(prev => ({ ...prev, [field]: value }));
    };

    const handleEnderecoChange = (field: keyof EnderecoProps, value: string) => {
        setEnderecoData(prev => ({ ...prev, [field]: value }));
    };

    const handleLinksImagens = (imagensToAdd: string[], imagensToRemove: string[]) => {
        setImagensToAdd(imagensToAdd || []);
        setImagensToRemove(imagensToRemove || []);
    };

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
        if (!razaoSocial) errors.razaoSocial = "O campo Razão Social é obrigatório.";
        if (!email) errors.email = "O campo Email é obrigatório.";
        if (!alvara) errors.alvara = "O campo Alvará é obrigatório.";
        if (!cep) errors.cep = "O campo CEP é obrigatório.";
        if (!logradouro) errors.logradouro = "O campo Logradouro é obrigatório.";
        if (!estado) errors.estado = "O campo Estado é obrigatório.";
        if (!cidade) errors.cidade = "O campo Cidade é obrigatório.";
        if (!bairro) errors.bairro = "O campo Bairro é obrigatório.";
        if (!numero) errors.numero = "O campo Número é obrigatório.";

        return Object.keys(errors).length ? errors : null;
    };

    const handleSubmit = async () => {
        const errors = validateFields();
        if (!errors) {
            setLoading(true);
            try {
                const token = await AsyncStorage.getItem('access_token');

                let uploadedImages: string[] = [];
                if (uploadImageRef.current) {
                    uploadedImages = (await uploadImageRef.current.uploadAllImages()) || []; // Garante que é um array
                    console.log('Imagens enviadas:', uploadedImages);
                }

                const payload = {
                    ...estabelecimentoData,
                    cnpj: removePontuacao(estabelecimentoData.cnpj),
                    telefone: removePontuacao(estabelecimentoData.telefone),
                    endereco: {
                        ...enderecoData,
                        cep: removePontuacao(enderecoData.cep)
                    },
                    imagensToAdd: uploadedImages, // Certifique-se de que isso é um array de strings
                    imagensToRemove: imagensToRemove // Certifique-se de que isso também é um array de strings
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
                    Toast.show({ type: 'success', text1: 'Cadastro realizado com sucesso!' });
                    router.replace('/menu');
                } else {
                    Toast.show({ type: 'error', text1: 'Falha no cadastro', text2: data.message });
                }
            } catch (error) {
                console.error('Erro no cadastro:', error);
                Toast.show({ type: 'error', text1: 'Erro no cadastro', text2: error.message });
            } finally {
                setLoading(false);
            }
        } else {
            Object.keys(errors).forEach(key => Toast.show({ type: 'error', text1: errors[key] }));
        }
    };



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', marginTop: statusBarHeight }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <SetaVoltar />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ padding: 16 }}>
                    <Text className='text-2xl font-bold py-3'>Cadastro de Estabelecimento</Text>
                    <Input
                        className='py-3'
                        label="Nome"
                        value={estabelecimentoData.nome}
                        onChangeText={value => handleInputChange('nome', value)}
                    />
                    <Input
                        className='py-3'
                        label="CNPJ"
                        value={estabelecimentoData.cnpj}
                        onChangeText={handleCNPJChange}
                        keyboardType="numeric"
                        maxLength={18}
                    />
                    <Input
                        className='py-3'
                        label="Telefone"
                        value={estabelecimentoData.telefone}
                        onChangeText={handleTelefoneChange}
                        keyboardType="phone-pad"
                    />
                    <Input
                        className='py-3'
                        label="Razão Social"
                        value={estabelecimentoData.razaoSocial}
                        onChangeText={value => handleInputChange('razaoSocial', value)}
                    />
                    <Input
                        className='py-3'
                        label="Email"
                        value={estabelecimentoData.email}
                        onChangeText={value => handleInputChange('email', value)}
                        keyboardType="email-address"
                    />
                    <Input
                        className='py-3'
                        label="Alvará"
                        value={estabelecimentoData.alvara}
                        onChangeText={value => handleInputChange('alvara', value)}
                    />

                    <Text className='text-2xl font-bold py-3'>Endereço:</Text>
                    <Input
                        className='py-3'
                        label="CEP"
                        value={enderecoData.cep}
                        onChangeText={handleCEPChange}
                        keyboardType="numeric"
                    />
                    <Input
                        className='py-3'
                        label="Estado"
                        value={enderecoData.estado}
                        onChangeText={value => handleEnderecoChange('estado', value)}
                        maxLength={2}
                    />
                    <Input
                        className='py-3'
                        label="Cidade"
                        value={enderecoData.cidade}
                        onChangeText={value => handleEnderecoChange('cidade', value)}
                    />
                    <Input
                        className='py-3'
                        label="Bairro"
                        value={enderecoData.bairro}
                        onChangeText={value => handleEnderecoChange('bairro', value)}
                    />
                    <Input
                        className='py-3'
                        label="Logradouro"
                        value={enderecoData.logradouro}
                        onChangeText={value => handleEnderecoChange('logradouro', value)}
                    />
                    <Input
                        className='py-3'
                        label="Número"
                        value={enderecoData.numero}
                        onChangeText={value => handleEnderecoChange('numero', value)}
                        keyboardType="numeric"
                    />
                    <Input
                        className='py-3'
                        label="Complemento"
                        value={enderecoData.complemento}
                        onChangeText={value => handleEnderecoChange('complemento', value)}
                    />

                    <Text className='text-2xl font-bold py-3'>Acomodações:</Text>
                    <MultiSelect
                        options={options}
                        selectedOptions={selectedOptions}
                        onSelectionChange={setSelectedOptions}
                        icon={<MaterialIcons name="check-box" size={24} color="black" />}
                    />

                    <Text className='text-2xl font-bold py-3'>Imagens:</Text>
                    <UploadImage
                        ref={uploadImageRef}
                        pastaBucket="estabelecimento"
                        multipasImagens={true}
                        imagensExistentes={imagensExistentes}
                        linksImagens={handleLinksImagens}
                        btClassName='mt-1 bg-roxo p-2 rounded-2xl active:bg-roxo/80 mx-4 w-[100%]'
                        btClassNameTitle="text-white text-center text-lg"
                    />
                    <BotaoTouchableOpacity
                        title="Cadastrar"
                        onPress={handleSubmit}
                        className='bg-primary p-4 rounded-2xl active:bg-secondary mx-4'
                        classNameTitle="text-white text-center text-xl"
                    />
                </View>
            </ScrollView>
            {loading && <Loading />}
        </SafeAreaView>
    );
}
