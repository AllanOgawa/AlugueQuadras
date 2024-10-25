import { useEffect, useState, useRef } from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, TextInput, View } from 'react-native';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import Input from '@components/inputs/input';
import BotaoPressable from '@components/botoes/botaoPressable';
import MultiSelect from '@/src/components/IconService';
import { MaterialIcons } from '@expo/vector-icons';
import SetaVoltar from '@/src/components/setaVoltar';
import globalStyles from '@/src/styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const statusBarHeight = Constants.statusBarHeight;

export default function QuadraCadastro() {
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');
    const [comprimento, setComprimento] = useState('');
    const [largura, setLargura] = useState('');
    const [informacoes, setInformacoes] = useState('');
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);  // Tipos de esporte selecionados
    const [sportsOptions, setSportsOptions] = useState([]);  // Tipos de esporte disponíveis

    const [errorNome, setErrorNome] = useState('');
    const [errorValor, setErrorValor] = useState('');
    const [errorComprimento, setErrorComprimento] = useState('');
    const [errorLargura, setErrorLargura] = useState('');

    const nomeInputRef = useRef<TextInput>(null);
    const valorInputRef = useRef<TextInput>(null);
    const comprimentoInputRef = useRef<TextInput>(null);
    const larguraInputRef = useRef<TextInput>(null);
    const InformacoesInputRef = useRef<TextInput>(null);

    const [idEstabelecimento, setIdEstabelecimento] = useState<number | null>(null);


    // Busca tipos de esporte ao carregar o componente
    useEffect(() => {
        const fetchSports = async () => {
            try {
                const access_token = await AsyncStorage.getItem('access_token');
                const response = await fetch(`${Constants.expoConfig?.extra?.apiUrl}/estabelecimento/quadra/tipo-esporte/list`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                    },
                });

                const sports = await response.json();
                setSportsOptions(sports);  // Armazena as opções de esporte no estado
            } catch (error) {
                console.error('Erro ao buscar tipos de esporte:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Erro ao carregar tipos de esporte',
                });
            }
        };
        const fetchEstabelecimentoId = async () => {
            try {
                const id = await AsyncStorage.getItem('idEstabelecimento');
                if (id) {
                    setIdEstabelecimento(parseInt(id, 10)); // Converte o valor de string para número
                    console.log('ID do estabelecimento recuperado:', id);
                } else {
                    console.log('Nenhum ID encontrado.');
                }
            } catch (error) {
                console.error('Erro ao recuperar o ID do estabelecimento:', error);
            }
        };
        fetchSports();
        fetchEstabelecimentoId();
    }, []);


    const handleSelectionChange = (selected: number[]) => {
        setSelectedOptions(selected);
        console.log('Tipos de esporte selecionados:', selected);
    };

    const handleSubmit = async () => {
        let hasError = false;

        if (!idEstabelecimento) {
            Toast.show({
                type: 'error',
                text1: 'Estabelecimento não encontrado',
            })
            return;
        }

        // Validações dos campos
        setErrorNome(!nome ? "O campo Nome é obrigatório." : "");
        setErrorValor(!valor ? "O campo Valor é obrigatório." : "");
        setErrorComprimento(!comprimento ? "O campo Comprimento é obrigatório." : "");
        setErrorLargura(!largura ? "O campo Largura é obrigatório." : "");

        if (!nome || !valor || !comprimento || !largura) {
            hasError = true;
        }

        if (!hasError) {
            const quadraData = {
                nome,
                informacoesAdicionais: informacoes,
                valor: parseFloat(valor),  // Converte para número
                largura: parseFloat(largura),  // Converte para número
                comprimento: parseFloat(comprimento),  // Converte para número
                idkeyEstabelecimento: idEstabelecimento,  // Substitua pelo id real do estabelecimento
                imagensToAdd: [
                    "estabelecimento/imagem1.jpg",  // Substitua pelos paths corretos
                    "estabelecimento/imagem2.png"
                ],
                tiposEsporteToAdd: selectedOptions  // Tipos de esporte selecionados
            };

            console.log('Dados da quadra a serem enviados:', quadraData);

            try {
                const access_token = await AsyncStorage.getItem('access_token');
                const response = await fetch(`${Constants.expoConfig?.extra?.apiUrl}/quadra`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`,
                    },
                    body: JSON.stringify(quadraData),  // Envia os dados como JSON
                });

                if (!response.ok) {
                    throw new Error('Erro ao cadastrar quadra');
                }

                // Exibe mensagem de sucesso
                Toast.show({
                    type: 'success',
                    text1: 'Quadra cadastrada com sucesso',
                });

                // Redireciona após um pequeno intervalo
                setTimeout(() => {
                    router.replace({
                        pathname: '/menu',
                        params: { message: "Cadastro de quadra realizado com sucesso!" }
                    });
                }, 600);
            } catch (error) {
                console.error(error);
                Toast.show({
                    type: 'error',
                    text1: 'Erro ao cadastrar a quadra',
                });
            }
        } else {
            console.log("Erro: Preencha todos os campos obrigatórios.");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white" style={{ marginTop: statusBarHeight }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="w-full px-4">
                    <Text className="text-4xl font-semibold mt-5 mb-5">Cadastrar Quadra</Text>

                    <Input
                        className='mt-5'
                        label="Nome da Quadra:"
                        obrigatorio
                        value={nome}
                        onChangeText={setNome}
                    />
                    <Input
                        className='mt-5'
                        label="Valor por Hora:"
                        obrigatorio
                        keyboardType="numeric"
                        value={valor}
                        onChangeText={setValor}
                    />
                    <Input
                        className='mt-5'
                        label="Comprimento (m):"
                        obrigatorio
                        keyboardType="numeric"
                        value={comprimento}
                        onChangeText={setComprimento}
                    />
                    <Input
                        className='mt-5'
                        label="Largura (m):"
                        obrigatorio
                        keyboardType="numeric"
                        value={largura}
                        onChangeText={setLargura}
                    />
                    <Input
                        className='mt-5'
                        label="Informações adicionais:"
                        value={informacoes}
                        onChangeText={setInformacoes}
                    />
                    <View>
                        <Text className="text-lg mt-4">Selecione os tipos de esporte:</Text>
                        <MultiSelect
                            options={sportsOptions.map(({ idkey, descricao }) => ({
                                id: String(idkey),
                                label: descricao
                            }))}
                            onSelectionChange={(selected: string[]) => handleSelectionChange(selected.map(Number))}  // Convertendo ids para número
                        />
                    </View>
                </View>
            </ScrollView>
            <View style={globalStyles.buttonContainer}>
                <BotaoPressable
                    title={'Cadastrar'}
                    className='bg-primary p-4 rounded-2xl active:bg-secondary mx-4'
                    classNameTitle="text-white text-center text-xl"
                    onPress={handleSubmit}  // Chama a função para enviar os dados
                />
            </View>
        </SafeAreaView>
    );
}
