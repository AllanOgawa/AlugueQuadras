import React, { useEffect, useRef, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Alert, ActivityIndicator, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuadraProps } from '@/src/interfaces/quadra';
import UploadImage from '@/src/components/UploadImagem';
import SetaVoltar from '@/src/components/setaVoltar';
import Toast from 'react-native-toast-message';
import BotaoTouchableOpacity from '@components/botoes/botaoTouchableOpacity';
import Constants from 'expo-constants';
import Input from '@/src/components/inputs/input';
import Checkbox from '@/src/components/checkbox';
import Loading from '@/src/components/loading';
import MultiSelect from '@/src/components/multiSelect';
import globalStyles from '@/src/styles/globalStyles';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';

export default function CadastroQuadra() {
    const { idEstabelecimento, quadra } = useLocalSearchParams();
    const [isEditing, setIsEditing] = useState(false); // Verifica se é edição ou cadastro
    const [idkey, setIdkey] = useState(null);
    const [loading, setLoading] = useState(false);

    // quadra
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');
    const [largura, setLargura] = useState('');
    const [comprimento, setComprimento] = useState('');
    const [informacoes, setInformacoes] = useState('');
    const [coberta, setCoberta] = useState(false);

    //Tipo Esporte
    const [esportes, setEsportes] = useState<{ idkey: number; descricao: string }[]>([]);
    const [esportesSelected, setEsportesSelected] = useState<number[]>([]);
    const [esportesToAdd, setEsportesToAdd] = useState<number[]>([]);
    const [esportesToRemove, setEsportesToRemove] = useState<number[]>([]);

    // validação de errors
    const [errorNome, setErrorNome] = useState('');
    const [errorValor, setErrorValor] = useState('');
    const [errorLargura, setErrorLargura] = useState('');
    const [errorComprimento, setErrorComprimento] = useState('');

    //imagens
    const [imagensExistentes, setImagensExistentes] = useState<string[]>([]);
    const [imagensToAdd, setImagensToAdd] = useState<string[]>([]);
    const [imagensToRemove, setImagensToRemove] = useState<string[]>([]);
    const [okHandleLinksImagens, setOkHandleLinksImagens] = useState(false);

    // refs
    const nomeInputRef = useRef<TextInput>(null);
    const valorInputRef = useRef<TextInput>(null);
    const larguraInputRef = useRef<TextInput>(null);
    const comprimentoInputRef = useRef<TextInput>(null);
    const informacoesInputRef = useRef<TextInput>(null);
    const uploadImageRef = useRef<{ uploadAllImages: () => Promise<void> } | null>(null);

    useEffect(() => {
        setLoading(true);
        try {
            if (typeof quadra === 'string') {
                const parsedQuadra = (JSON.parse(quadra));

                if (quadra) {
                    setIdkey(parsedQuadra.idkey || null);
                    setNome(parsedQuadra.nome || '');
                    setValor(parsedQuadra.valor || '');
                    setLargura(parsedQuadra.largura || '');
                    setComprimento(parsedQuadra.comprimento || '');
                    setInformacoes(parsedQuadra.informacoesAdicionais || '')
                    setCoberta(parsedQuadra.coberta || false);

                    if (parsedQuadra.tiposEsporte) {
                        const tiposEsporte = parsedQuadra.tiposEsporte.map((item: any) => item.idkey);
                        setEsportesSelected(tiposEsporte);
                    }
                    if (parsedQuadra.imagens && parsedQuadra.imagens.length > 0) {
                        setImagensExistentes(parsedQuadra.imagens.map((img: { path: string }) => img.path));
                    }
                    setIsEditing(true); // Está no modo de edição
                } else {
                    setIsEditing(false); // Está no modo de cadastro
                }
            }
        } catch (error) {
            console.error("Erro ao parsear estabelecimento:", error);
        } finally {
            setLoading(false);
            fetchEsportes();
        }
    }, [quadra]);

    async function fetchEsportes() {
        setLoading(true);
        try {
            const access_token = await AsyncStorage.getItem('access_token');
            if (!access_token) {
                throw new Error('Token de acesso não disponível');
            }

            const response = await fetch(`${apiUrl}/estabelecimento/quadra/tipo-esporte/list`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar os tipos de esportes');
            }

            const data = await response.json();
            setEsportes(data);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Erro ao carregar os tipos de esportes',
                text2: error ? String(error) : "",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (okHandleLinksImagens)
            handleRequestBody();
    }, [okHandleLinksImagens]);

    function handleTipoEsporteChange(toAdd: number[], toRemove: number[]) {
        setEsportesToAdd(toAdd);
        setEsportesToRemove(toRemove);
    };

    function handleSubmit() {
        let hasError = false;
        setOkHandleLinksImagens(false);
        setLoading(true);

        setErrorNome(!nome ? "Informe o Nome da Quadra" : "");
        setErrorValor(!valor && Number(valor) <= 0 ? "Informe o Valor da Quadra" : "");
        setErrorComprimento(!comprimento ? "Informe o Comprimento da Quadra" : "");
        setErrorLargura(!largura ? "Informe a Largura da Quadra" : "");

        if (!nome || !valor || Number(valor) <= 0 || !comprimento || !largura) {
            hasError = true;
        }

        if (!hasError)
            handleImageUpload();
        else
            setLoading(false);
    };

    async function handleImageUpload() {
        if (uploadImageRef.current) {
            try {
                await uploadImageRef.current.uploadAllImages();

            } catch (error) {
                console.error('Erro ao carregar imagens', error);
            }
        } else {
            console.error('UploadImage ref não está definida.');
        }
        setLoading(false);
    }

    async function handleLinksImagens(imagensToAdd: string[], imagensToRemove: string[]) {
        setImagensToAdd(imagensToAdd || []);
        setImagensToRemove(imagensToRemove || []);
        setOkHandleLinksImagens(true);
    }

    async function handleRequestBody() {
        let body;
        if (!isEditing)
            body = {
                nome: nome,
                valor: Number(valor),
                largura: Number(largura),
                comprimento: Number(comprimento),
                informacoesAdicionais: informacoes,
                coberta: coberta,
                idkeyEstabelecimento: Number(idEstabelecimento),
                imagensToAdd: imagensToAdd,
                tiposEsporteToAdd: esportesToAdd
            };
        else {
            body = {
                nome: nome,
                valor: Number(valor),
                largura: Number(largura),
                comprimento: Number(comprimento),
                informacoesAdicionais: informacoes,
                coberta: coberta,
                imagensToAdd: imagensToAdd,
                imagensToRemove: imagensToRemove,
                tiposEsporteToAdd: esportesToAdd,
                tipoEsporteToRemove: esportesToRemove
            };
            console.log("body", body);
        }

        gravarQuadra(body);
    }

    async function gravarQuadra(body: any) {
        setLoading(true);
        let method;
        let route;

        if (isEditing) {
            route = `${apiUrl}/estabelecimento/quadra/edit/${idkey}`;
            method = 'PATCH';
        } else {
            route = `${apiUrl}/estabelecimento/quadra/new`
            method = 'POST';
        }

        try {
            const token = await AsyncStorage.getItem('access_token');
            const response = await fetch(route, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (response.ok) {
                if (isEditing)
                    Toast.show({ type: 'success', text1: 'Quadra Alterada com Sucesso' });
                else
                    Toast.show({ type: 'success', text1: 'Cadastrado de Quadra Realizado com Sucesso' });
                router.replace({
                    pathname: '/(quadra)/menu',
                    params: { idEstabelecimento }
                });
            } else {
                console.log(data.message)
                if (isEditing)
                    Toast.show({ type: 'error', text1: 'Falha na Alteração', text2: data.message });
                else
                    Toast.show({ type: 'error', text1: 'Falha no Cadastro', text2: data.message });
            }
        } catch (error) {
            console.error('Erro ao gravar Quadra', error);
        } finally {
            setLoading(false);
        }
    };

    function handleDelete() {
        Alert.alert(
            'Confirmação',
            'Deseja realmente deletar esta quadra?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Deletar',
                    onPress: deletarQuadra,
                },
            ],
            { cancelable: true }
        );
    };

    async function deletarQuadra() {
        setLoading(true);
        let sucesso = false;
        try {
            const access_token = await AsyncStorage.getItem('access_token');
            const response = await fetch(`${apiUrl}/estabelecimento/quadra/remove/${idkey}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                },
            });

            if (response.ok) {
                Toast.show({
                    type: 'success',
                    text1: 'Quadra Deletada com sucesso!',
                });
                sucesso = true;
            }
            else {
                throw new Error('Erro ao Deletar quadra');
            }

        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Erro ao remover a quadra',
                text2: error ? String(error) : ""
            });
        } finally {
            setLoading(false);
            if (sucesso)
                router.back();
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-white" style={{ marginTop: Constants.statusBarHeight }}>
            <SetaVoltar />
            <ScrollView showsVerticalScrollIndicator={false} className="w-full px-3">
                <Text className="text-4xl font-semibold mb-5 mt-2">
                    {`${isEditing ? "Editar" : "Cadastrar"} Quadra`}
                </Text>

                <Input
                    label="Nome da Quadra"
                    ref={nomeInputRef}
                    obrigatorio
                    value={nome}
                    onChangeText={setNome}
                    errorMessage={errorNome}
                    maxLength={30}
                    className='mb-5'
                    returnKeyType="next"
                    onSubmitEditing={() => valorInputRef.current?.focus()}
                />

                <Input
                    label="Valor"
                    ref={valorInputRef}
                    obrigatorio
                    value={valor}
                    onChangeText={setValor}
                    errorMessage={errorValor}
                    className='mb-5'
                    keyboardType='numeric'
                    returnKeyType="next"
                    onSubmitEditing={() => larguraInputRef.current?.focus()}
                />

                <Input
                    label="Largura (metros)"
                    ref={larguraInputRef}
                    obrigatorio
                    value={largura}
                    onChangeText={setLargura}
                    errorMessage={errorLargura}
                    className='mb-5'
                    keyboardType='numeric'
                    returnKeyType="next"
                    onSubmitEditing={() => comprimentoInputRef.current?.focus()}
                />

                <Input
                    label="Comprimento (metros)"
                    ref={comprimentoInputRef}
                    obrigatorio
                    value={comprimento}
                    onChangeText={setComprimento}
                    errorMessage={errorComprimento}
                    className='mb-5'
                    keyboardType='numeric'
                    returnKeyType="next"
                    onSubmitEditing={() => informacoesInputRef.current?.focus()}
                />

                <Input
                    label="Informações Adicionais"
                    ref={informacoesInputRef}
                    value={informacoes}
                    onChangeText={setInformacoes}
                    maxLength={25}
                    className='mb-5'
                />

                <Checkbox
                    label="Quadra coberta"
                    value={coberta}
                    onValueChange={setCoberta}
                />

                {/* Tipos de Esporte */}
                <Text className="text-2xl font-semibold mt-6">Tipos de Esporte:</Text>
                <MultiSelect
                    max={3}
                    opcoes={esportes}
                    initialSelected={esportesSelected}
                    onSelectionChange={handleTipoEsporteChange}
                />

                {/* Imagens */}
                <Text className="text-2xl font-semibold mt-6">Imagens:</Text>
                <UploadImage
                    ref={uploadImageRef}
                    pastaBucket="quadra"
                    multipasImagens={false}
                    imagensExistentes={imagensExistentes}
                    linksImagens={handleLinksImagens}
                    btClassName='mt-1 bg-roxo p-2 rounded-2xl active:bg-roxo/80 mx-4 mt-5 w-[100%]'
                    btClassNameTitle="text-white text-center text-lg"
                />

                {isEditing &&
                    <BotaoTouchableOpacity
                        title="Deletar Quadra"
                        className='bg-red-600 p-2 rounded-2xl active:bg-red-700 mx-1 mb-8 mt-12'
                        classNameTitle="text-white text-center text-lg"
                        onPress={handleDelete}
                    />
                }
            </ScrollView>

            <View style={globalStyles.buttonContainer}>
                <BotaoTouchableOpacity
                    title={`${isEditing ? "Editar" : "Cadastrar"} Quadra`}
                    className='bg-primary p-4 rounded-2xl active:bg-secondary mx-4'
                    classNameTitle="text-white text-center text-xl"
                    onPress={handleSubmit}
                />
            </View>
            {loading && <Loading />}
        </SafeAreaView>
    );
}
