import React, { useEffect, useRef, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Alert, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuadraProps } from '@/src/interfaces/quadra';
import UploadImage from '@components/UploadImagem';
import SetaVoltar from '@/src/components/setaVoltar';
import Toast from 'react-native-toast-message';
import BotaoTouchableOpacity from '@components/botoes/botaoTouchableOpacity';
import Constants from 'expo-constants';
import Input from '@/src/components/inputs/input';
import Checkbox from '@/src/components/checkbox';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';

export default function CadastroQuadra() {
    const [errorNome, setErrorNome] = useState('');
    const [errorValor, setErrorValor] = useState('');
    const [errorLargura, setErrorLargura] = useState('');
    const [errorComprimento, setErrorComprimento] = useState('');
    const [isCovered, setIsCovered] = useState(false);
    const [imagensToAdd, setImagensToAdd] = useState<string[]>([]);
    const [imagensToRemove, setImagensToRemove] = useState<string[]>([]);
    const [loadingEsportes, setLoadingEsportes] = useState(true);
    const [esportes, setEsportes] = useState<{ idkey: number; descricao: string }[]>([]);
    const uploadImageRef = useRef<{ uploadAllImages: () => Promise<string[]> } | null>(null);
    const [imagensExistentes, setImagensExistentes] = useState<string[]>([]);
    const [okHandleLinksImagens, setOkHandleLinksImagens] = useState(false);

    const { idEstabelecimento } = useLocalSearchParams();
    const [quadraData, setQuadraData] = useState<Partial<QuadraProps>>({
        nome: '',
        informacoesAdicionais: '',
        valor: 0,
        largura: 0,
        comprimento: 0,
        coberta: false,
        imagens: []
    });
    const [selectedEsportes, setSelectedEsportes] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (field: keyof QuadraProps, value: string) => {
        setQuadraData((prevData) => ({ ...prevData, [field]: value }));
    };

    const handleSelectEsporte = (idkey: number) => {
        if (selectedEsportes.includes(idkey)) {
            setSelectedEsportes(selectedEsportes.filter((id) => id !== idkey));
        } else {
            setSelectedEsportes([...selectedEsportes, idkey]);
        }
    };

    async function handleImageUpload() {
        if (uploadImageRef.current) {
            try {
                const uploadedImages = await uploadImageRef.current.uploadAllImages();
                setImagensToAdd(uploadedImages);
                return uploadedImages;
            } catch (error) {
                console.error('Erro ao carregar imagens', error);
            }
        } else {
            console.error('UploadImage ref não está definida.');
        }
        return [];
    }

    async function handleLinksImagens(imagensToAdd: string[], imagensToRemove: string[]) {
        setImagensToAdd(imagensToAdd || []);
        setImagensToRemove(imagensToRemove || []);
        setOkHandleLinksImagens(true);
    }

    useEffect(() => {
        const fetchEsportes = async () => {
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
                    text2: error.message,
                });
            } finally {
                setLoadingEsportes(false);
            }
        };

        fetchEsportes();
    }, [idEstabelecimento]);

    const handleSubmit = async () => {
        if (!quadraData.nome) {
            setErrorNome('Campo obrigatório');
            return;
        } else {
            setErrorNome('');
        }

        if (!quadraData.valor) {
            setErrorValor('Campo obrigatório');
            return;
        } else {
            setErrorValor('');
        }

        if (!quadraData.largura) {
            setErrorLargura('Campo obrigatório');
            return;
        } else {
            setErrorLargura('');
        }

        if (!quadraData.comprimento) {
            setErrorComprimento('Campo obrigatório');
            return;
        } else {
            setErrorComprimento('');
        }

        setLoading(true);
        console.log(imagensToAdd)
        try {
            const access_token = await AsyncStorage.getItem('access_token');
            const url = `${apiUrl}/estabelecimento/quadra/new`;

            let uploadedImages: string[] = [];
            if (uploadImageRef.current) {
                uploadedImages = await uploadImageRef.current.uploadAllImages() || []; // Adicione || [] para garantir que seja um array
                console.log('Imagens enviadas:', uploadedImages);
            }

            const payload = {
                nome: quadraData.nome,
                informacoesAdicionais: quadraData.informacoesAdicionais,
                valor: Number(quadraData.valor),
                largura: Number(quadraData.largura),
                comprimento: Number(quadraData.comprimento),
                idkeyEstabelecimento: Number(idEstabelecimento),
                coberta: isCovered,
                tiposEsporteToAdd: selectedEsportes,
                imagensToAdd: uploadedImages, // Certifique-se de que este campo é um array, mesmo que vazio
            };

            console.log('Objeto enviado:', payload);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error('Erro ao cadastrar a quadra');
            }

            Toast.show({
                type: 'success',
                text1: 'Quadra cadastrada com sucesso!',
            });
            setTimeout(() => router.replace({
                pathname: '/(quadra)/menu',
                params: { idEstabelecimento },
            }), 600);
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


    return (
        <SafeAreaView className="flex-1 bg-white" style={{ marginTop: Constants.statusBarHeight }}>
            <SetaVoltar />
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Text className="text-4xl font-semibold mb-5">Cadastrar Quadra</Text>

                <Input
                    className='mb-5'
                    label="Nome da Quadra"
                    obrigatorio
                    errorMessage={errorNome}
                    value={quadraData.nome}
                    onChangeText={(text) => handleInputChange('nome', text)}
                />

                <Input
                    className='mb-5'
                    label="Informações Adicionais"
                    value={quadraData.informacoesAdicionais}
                    onChangeText={(text) => handleInputChange('informacoesAdicionais', text)}
                />

                <Input
                    className='mb-5'
                    label="Valor"
                    errorMessage={errorValor}
                    value={quadraData.valor?.toString()}
                    onChangeText={(text) => handleInputChange('valor', text)}
                    keyboardType='numeric'
                />

                <Input
                    className='mb-5'
                    label="Largura"
                    errorMessage={errorLargura}
                    value={quadraData.largura?.toString()}
                    onChangeText={(text) => handleInputChange('largura', text)}
                    keyboardType='numeric'
                />

                <Input
                    className='mb-5'
                    label="Comprimento"
                    errorMessage={errorComprimento}
                    value={quadraData.comprimento?.toString()}
                    onChangeText={(text) => handleInputChange('comprimento', text)}
                    keyboardType='numeric'
                />

                <Checkbox
                    label="Quadra coberta"
                    value={isCovered}
                    onValueChange={setIsCovered}
                />

                <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 10 }}>
                    Selecione os tipos de esporte:
                </Text>

                {loadingEsportes ? (
                    <ActivityIndicator size="large" color="#FF6600" />
                ) : (
                    esportes.map((esporte) => (
                        <TouchableOpacity key={esporte.idkey} style={styles.checkboxContainer} onPress={() => handleSelectEsporte(esporte.idkey)}>
                            <View style={[styles.checkbox, selectedEsportes.includes(esporte.idkey) && styles.checkboxSelected]}>
                                {selectedEsportes.includes(esporte.idkey) && <Text style={styles.checkmark}>✓</Text>}
                            </View>
                            <Text style={styles.label}>{esporte.descricao}</Text>
                        </TouchableOpacity>
                    ))
                )}

                <UploadImage
                    ref={uploadImageRef}
                    pastaBucket="quadra"
                    multipasImagens={true}
                    imagensExistentes={imagensExistentes}
                    linksImagens={handleLinksImagens}
                    btClassName='mt-1 bg-roxo p-2 rounded-2xl active:bg-roxo/80 mx-4 w-[100%]'
                    btClassNameTitle="text-white text-center text-lg"
                />

                <BotaoTouchableOpacity
                    title="Cadastrar Quadra"
                    className="bg-primary p-4 rounded-xl mt-4"
                    classNameTitle="text-white text-center text-lg"
                    onPress={handleSubmit}
                />

                {loading && <ActivityIndicator size="large" color="#FF6600" style={{ marginTop: 16 }} />}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#FF6600',
        borderRadius: 4,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxSelected: {
        backgroundColor: '#FF6600',
    },
    checkmark: {
        color: 'white',
        fontSize: 16,
    },
    label: {
        fontSize: 16,
    },
});
