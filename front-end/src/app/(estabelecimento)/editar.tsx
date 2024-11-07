import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Alert, StatusBar } from 'react-native';
import Constants from 'expo-constants';
import Input from '@components/inputs/input';
import BotaoTouchableOpacity from '@components/botoes/botaoTouchableOpacity';
import UploadImage from '@components/UploadImagem';
import globalStyles from '@/src/styles/globalStyles';
import { EstabelecimentoProps, EnderecoProps } from '@/src/interfaces/estabelecimento';

const statusBarHeight = Constants.statusBarHeight;

export default function EditarEstabelecimento({ route }) {
    const { estabelecimento } = route.params;
    const [estabelecimentoData, setEstabelecimentoData] = useState(estabelecimento);
    const [enderecoData, setEnderecoData] = useState(estabelecimento.endereco);
    const [imagensToAdd, setImagensToAdd] = useState<string[]>([]);
    const [imagensToRemove, setImagensToRemove] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (field, value) => {
        setEstabelecimentoData(prev => ({ ...prev, [field]: value }));
    };

    const handleEnderecoChange = (field, value) => {
        setEnderecoData(prev => ({ ...prev, [field]: value }));
    };

    const handleEdit = async () => {
        setLoading(true);
        try {
            const payload = {
                ...estabelecimentoData,
                endereco: enderecoData,
                imagensToAdd,
                imagensToRemove,
            };
            await editarEstabelecimento(payload); // Chamada para API
        } catch (error) {
            console.error('Erro na edição:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async () => {
        Alert.alert('Confirmação', 'Deseja realmente remover o estabelecimento?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Remover',
                onPress: async () => {
                    setLoading(true);
                    try {
                        await removerEstabelecimento(estabelecimentoData.idkey); // Chamada para API
                    } catch (error) {
                        console.error('Erro na remoção:', error);
                    } finally {
                        setLoading(false);
                    }
                },
            },
        ]);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', marginTop: statusBarHeight }}>
            <StatusBar barStyle="dark-content" />
            <ScrollView>
                <View style={globalStyles.container}>
                    <Text style={globalStyles.title}>Editar Estabelecimento</Text>
                    <Input label="Nome" value={estabelecimentoData.nome} onChangeText={value => handleInputChange('nome', value)} />
                    {/* ... outros campos */}
                    <UploadImage
                        onUploadComplete={setImagensToAdd}
                        existingImages={estabelecimentoData.imagens}
                        onRemove={setImagensToRemove}
                    />
                    <BotaoTouchableOpacity title="Salvar Alterações" onPress={handleEdit} />
                    <BotaoTouchableOpacity title="Remover Estabelecimento" onPress={handleRemove} style={{ backgroundColor: 'red' }} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
