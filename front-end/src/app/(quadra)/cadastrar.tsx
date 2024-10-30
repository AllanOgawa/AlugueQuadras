import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, SafeAreaView, ScrollView, Button, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuadraProps } from '@/src/interfaces/quadra';
import UploadImage from '@components/UploadImagem';
import { CardConfig } from '@components/cardConfig';
import Constants from 'expo-constants';
import SetaVoltar from '@/src/components/setaVoltar';
import Toast from 'react-native-toast-message';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';

export default function CadastroEdicaoQuadra() {
    const { quadra: quadraParam } = useLocalSearchParams();
    const [quadraData, setQuadraData] = useState<Partial<QuadraProps>>({
        nome: '',
        informacoesAdicionais: '',
        valor: '',
        largura: '',
        comprimento: '',
        tiposEsporte: [],
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
        setLoading(true);
        try {
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
                    // imagensToAdd: quadraData.imagens?.map((img) => img.path), // Paths das imagens
                    tiposEsporteToAdd: quadraData.tiposEsporte?.map((esporte) => esporte.idkey), // IDs dos esportes
                    imagensToAdd: [
                        "estabelecimento/imagem1.jpg",
                        "estabelecimento/imagem2.png"
                    ],
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

    return (
        <SafeAreaView style={{ flex: 1, paddingTop: 20 }}>
            <SetaVoltar />
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
                    {isEditing ? 'Editar Quadra' : 'Cadastrar Quadra'}
                </Text>
                <TextInput
                    placeholder="Nome da Quadra"
                    value={quadraData.nome}
                    onChangeText={(text) => handleInputChange('nome', text)}
                    style={{ marginBottom: 16, borderBottomWidth: 1, padding: 8 }}
                />
                <TextInput
                    placeholder="Informações Adicionais"
                    value={quadraData.informacoesAdicionais}
                    onChangeText={(text) => handleInputChange('informacoesAdicionais', text)}
                    style={{ marginBottom: 16, borderBottomWidth: 1, padding: 8 }}
                />
                <TextInput
                    placeholder="Valor"
                    value={quadraData.valor}
                    onChangeText={(text) => handleInputChange('valor', text)}
                    style={{ marginBottom: 16, borderBottomWidth: 1, padding: 8 }}
                    keyboardType="numeric"
                />
                <TextInput
                    placeholder="Largura"
                    value={quadraData.largura}
                    onChangeText={(text) => handleInputChange('largura', text)}
                    style={{ marginBottom: 16, borderBottomWidth: 1, padding: 8 }}
                    keyboardType="numeric"
                />
                <TextInput
                    placeholder="Comprimento"
                    value={quadraData.comprimento}
                    onChangeText={(text) => handleInputChange('comprimento', text)}
                    style={{ marginBottom: 16, borderBottomWidth: 1, padding: 8 }}
                    keyboardType="numeric"
                />

                <Button title={isEditing ? 'Salvar Alterações' : 'Cadastrar Quadra'} onPress={handleSubmit} />
                {loading && <ActivityIndicator size="large" color="#FF6600" style={{ marginTop: 16 }} />}
            </ScrollView>
        </SafeAreaView>
    );
}
