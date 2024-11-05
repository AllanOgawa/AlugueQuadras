import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuadraProps } from '@/src/interfaces/quadra';
import UploadImage from '@components/UploadImagem';
import SetaVoltar from '@/src/components/setaVoltar';
import Toast from 'react-native-toast-message';
import BotaoTouchableOpacity from '@components/botoes/botaoTouchableOpacity';
import Constants from 'expo-constants';
import globalStyles from '@/src/styles/globalStyles';
import Input from '@/src/components/inputs/input';
import Checkbox from '@/src/components/checkbox';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';

export default function CadastroEdicaoQuadra() {

    const [errorNome, setErrorNome] = useState('');
    const [errorValor, setErrorValor] = useState('');
    const [errorLargura, setErrorLargura] = useState('');
    const [errorComprimento, setErrorComprimento] = useState('');
    const [isCovered, setIsCovered] = useState(false);

    const quadraNomeInputRef = useRef<TextInput>(null);
    const valorInputRef = useRef<TextInput>(null);
    const informacoesAdicionaisInputRef = useRef<TextInput>(null);
    const larguraInputRef = useRef<TextInput>(null);
    const comprimentoInputRef = useRef<TextInput>(null);

    const { quadra: quadraParam } = useLocalSearchParams();
    const [quadraData, setQuadraData] = useState<Partial<QuadraProps>>({
        nome: '',
        informacoesAdicionais: '',
        valor: '',
        largura: '',
        comprimento: '',
        coberta: false,
        imagens: []
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (quadraParam) {
            const parsedQuadra = typeof quadraParam === 'string' ? JSON.parse(quadraParam) : quadraParam;
            setQuadraData(parsedQuadra);
            setIsEditing(true);
        }
    }, [quadraParam]);

    const handleInputChange = (field: keyof QuadraProps, value: string) => {
        setQuadraData((prevData) => ({ ...prevData, [field]: value }));
    };

    const handleSubmit = async () => {

        if (!quadraData.nome) {
            setErrorNome('Campo obrigatório');
            quadraNomeInputRef.current?.focus();
            return;
        } else {
            setErrorNome('');
        }

        if (!quadraData.valor) {
            setErrorValor('Campo obrigatório');
            valorInputRef.current?.focus();
            return;
        } else {
            setErrorValor('');
        }

        if (!quadraData.largura) {
            setErrorLargura('Campo obrigatório');
            larguraInputRef.current?.focus();
            return;
        } else {
            setErrorLargura('');
        }

        if (!quadraData.comprimento) {
            setErrorComprimento('Campo obrigatório');
            comprimentoInputRef.current?.focus();
            return;
        } else {
            setErrorComprimento('');
        }

        setLoading(true);
        try {
            console.log('QuadraData:', quadraData);
            const access_token = await AsyncStorage.getItem('access_token');
            const url = isEditing
                ? `${apiUrl}/estabelecimento/quadra/edit/${quadraData.idkey}`
                : `${apiUrl}/estabelecimento/quadra/new`;
            const method = isEditing ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
                body: JSON.stringify({
                    ...quadraData,
                    valor: parseFloat(quadraData.valor || '0'), // Convertendo o valor para float
                    imagensToAdd: "",
                }),
            });

            if (!response.ok) {
                throw new Error(isEditing ? 'Erro ao editar a quadra' : 'Erro ao cadastrar a quadra');
            }

            Toast.show({
                type: 'success',
                text1: isEditing ? 'Quadra editada com sucesso!' : 'Quadra cadastrada com sucesso!',
            });
            setTimeout(() => router.replace('/menu'), 600);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Erro ao salvar a quadra',
                text2: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        Alert.alert(
            'Confirmação',
            'Deseja realmente remover esta quadra?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Remover',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const access_token = await AsyncStorage.getItem('access_token');
                            const response = await fetch(`${apiUrl}/estabelecimento/quadra/remove/${quadraData.idkey}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${access_token}`,
                                },
                            });

                            if (!response.ok) {
                                throw new Error('Erro ao remover a quadra');
                            }

                            Toast.show({
                                type: 'success',
                                text1: 'Quadra removida com sucesso!',
                            });
                            setTimeout(() => router.replace('/menu'), 600);
                        } catch (error) {
                            Toast.show({
                                type: 'error',
                                text1: 'Erro ao remover a quadra',
                                text2: error.message,
                            });
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white" style={{ marginTop: Constants.statusBarHeight }}>
            <SetaVoltar />
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Text className="text-4xl font-semibold mb-5">
                    {isEditing ? 'Editar Quadra' : 'Cadastrar Quadra'}
                </Text>

                <Input
                    className='mb-5'
                    ref={quadraNomeInputRef}
                    label="Nome Completo:"
                    obrigatorio
                    errorMessage={errorNome}
                    value={quadraData.nome}
                    onChangeText={(text) => handleInputChange('nome', text)}
                    autoComplete="name"
                    returnKeyType="done"
                />
                <Input
                    className='mb-5'
                    ref={informacoesAdicionaisInputRef}
                    label="Informações adicionais:"
                    value={quadraData.informacoesAdicionais}
                    onChangeText={(text) => handleInputChange('informacoesAdicionais', text)}
                    autoComplete="off"
                    returnKeyType="done"
                />

                <Input
                    className='mb-5'
                    ref={valorInputRef}
                    label="Valor:"
                    errorMessage={errorValor}
                    value={quadraData.valor}
                    onChangeText={(text) => handleInputChange('valor', text)}
                    autoComplete="off"
                    returnKeyType="done"
                />

                <Input
                    className='mb-5'
                    ref={larguraInputRef}
                    label="Largura:"
                    errorMessage={errorLargura}
                    value={quadraData.largura}
                    onChangeText={(text) => handleInputChange('largura', text)}
                    autoComplete="off"
                    returnKeyType="done"
                />

                <Input
                    className='mb-5'
                    ref={comprimentoInputRef}
                    label="Valor:"
                    errorMessage={errorComprimento}
                    value={quadraData.comprimento}
                    onChangeText={(text) => handleInputChange('comprimento', text)}
                    autoComplete="off"
                    keyboardType='numeric'
                    returnKeyType="done"
                />

                <Checkbox
                    label="Quadra coberta"
                    value={quadraData.coberta || false}  // Inicializa com o valor vindo da API
                    onValueChange={(newValue) => setQuadraData((prevData) => ({ ...prevData, coberta: newValue }))}
                />

                <BotaoTouchableOpacity
                    title={isEditing ? 'Salvar Alterações' : 'Cadastrar Quadra'}
                    className="bg-primary p-4 rounded-xl mt-4"
                    classNameTitle="text-white text-center text-lg"
                    onPress={handleSubmit}
                />

                <UploadImage
                    ref={uploadImageRef}
                    pastaBucket="usuario"
                    multipasImagens={false}
                    imagensExistentes={imagensExistentes}
                    linksImagens={handleLinksImagens}
                    btClassName='mt-1 bg-roxo p-2 rounded-2xl active:bg-roxo/80 mx-4 w-[100%]'
                    btClassNameTitle="text-white text-center text-lg"
                />

                {isEditing && (
                    <BotaoTouchableOpacity
                        title="Remover Quadra"
                        className="bg-red-500 p-4 rounded-xl mt-4"
                        classNameTitle="text-white text-center text-lg"
                        onPress={handleDelete}
                    />
                )}

                {loading && <ActivityIndicator size="large" color="#FF6600" style={{ marginTop: 16 }} />}
            </ScrollView>
        </SafeAreaView>
    );
}
