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

export default function EditarQuadra() {
    const { quadra: quadraParam, idEstabelecimento } = useLocalSearchParams();
    const [quadraData, setQuadraData] = useState<Partial<QuadraProps>>({});
    const [isCovered, setIsCovered] = useState(false);
    const [errorNome, setErrorNome] = useState('');
    const [errorValor, setErrorValor] = useState('');
    const [errorLargura, setErrorLargura] = useState('');
    const [errorComprimento, setErrorComprimento] = useState('');
    const [loadingEsportes, setLoadingEsportes] = useState(true);
    const [esportes, setEsportes] = useState<{ idkey: number; descricao: string }[]>([]);
    const [selectedEsportes, setSelectedEsportes] = useState<number[]>([]);
    const [originalEsportes, setOriginalEsportes] = useState<number[]>([]);
    const [imagensToAdd, setImagensToAdd] = useState<string[]>([]);
    const [imagensToRemove, setImagensToRemove] = useState<string[]>([]);
    const uploadImageRef = useRef<{ uploadAllImages: () => Promise<string[]> } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (quadraParam) {
            const parsedQuadra = typeof quadraParam === 'string' ? JSON.parse(quadraParam) : quadraParam;
            setQuadraData(parsedQuadra);
            setIsCovered(parsedQuadra.coberta || false);
            setSelectedEsportes(parsedQuadra.tiposEsporte.map(esporte => esporte.idkey));
            setOriginalEsportes(parsedQuadra.tiposEsporte.map(esporte => esporte.idkey));
        }
    }, [quadraParam]);

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
        try {
            const access_token = await AsyncStorage.getItem('access_token');
            const url = `${apiUrl}/estabelecimento/quadra/edit/${quadraData.idkey}`;

            let uploadedImages: string[] = [];
            if (uploadImageRef.current) {
                uploadedImages = await uploadImageRef.current.uploadAllImages();
            }

            const tiposEsporteToRemove = originalEsportes.filter(id => !selectedEsportes.includes(id));
            const tiposEsporteToAdd = selectedEsportes.filter(id => !originalEsportes.includes(id));

            const payload = {
                nome: quadraData.nome,
                informacoesAdicionais: quadraData.informacoesAdicionais,
                valor: Number(quadraData.valor),
                largura: Number(quadraData.largura),
                comprimento: Number(quadraData.comprimento),
                tipoEsporteToAdd: tiposEsporteToAdd,
                tipoEsporteToRemove: tiposEsporteToRemove,
                imagensToAdd: uploadedImages,
                imagensToRemove: imagensToRemove,
                coberta: isCovered,
            };

            console.log('Objeto enviado:', payload);

            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error('Erro ao editar a quadra');
            }

            Toast.show({
                type: 'success',
                text1: 'Quadra editada com sucesso!',
            });
            setTimeout(() => router.back(), 600);
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

    const handleDelete = () => {
        Alert.alert(
            'Confirmação',
            'Deseja realmente remover esta quadra?',
            [
                { text: 'Cancelar', style: 'cancel' },
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
                            setTimeout(() => router.back(), 600);
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
                <Text className="text-4xl font-semibold mb-5">Editar Quadra</Text>

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
                    imagensExistentes={quadraData.imagens || []}
                    linksImagens={(imagensAdd, imagensRemove) => {
                        setImagensToAdd(imagensAdd);
                        setImagensToRemove(imagensRemove);
                    }}
                />

                <BotaoTouchableOpacity
                    title="Salvar Alterações"
                    className="bg-primary p-4 rounded-xl mt-4"
                    classNameTitle="text-white text-center text-lg"
                    onPress={handleSubmit}
                />

                <BotaoTouchableOpacity
                    title="Remover Quadra"
                    className="bg-red-500 p-4 rounded-xl mt-4"
                    classNameTitle="text-white text-center text-lg"
                    onPress={handleDelete}
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
