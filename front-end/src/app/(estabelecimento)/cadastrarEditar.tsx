import { Alert, SafeAreaView, ScrollView, StatusBar, Text, TextInput, View } from 'react-native';
import Constants from 'expo-constants';
import { useState, useEffect, useRef } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import Input from '@components/inputs/input';
import BotaoTouchableOpacity from '@components/botoes/botaoTouchableOpacity';
import SetaVoltar from '@/src/components/setaVoltar';
import Loading from '@/src/components/loading';
import globalStyles from '@/src/styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import MultiSelect from '@/src/components/multiSelect';
import { AcomodacoesProps } from '@/src/interfaces/acomodacoes';
import UploadImage from '@/src/components/uploadImagem';
import axios from 'axios';
import HorarioFuncionamento, { HorarioFuncionamentoRef } from '@/src/components/horarioFuncionamento';
import { HorarioProps } from '@/src/interfaces/horario';

const statusBarHeight = Constants.statusBarHeight;

const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';
const googleMapsApiKey = Constants.expoConfig?.extra?.googleMapsApiKey || '';

export default function EstabelecimentoCadastro() {
    const { estabelecimento } = useLocalSearchParams(); // Recupera o parâmetro da rota
    const [isEditing, setIsEditing] = useState(false); // Verifica se é edição ou cadastro

    const [idkey, setIdkey] = useState(null); // Para armazenar o ID
    const [loading, setLoading] = useState(true);

    // estabelecimento
    const [nome, setNome] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [telefone, setTelefone] = useState('');
    const [razaoSocial, setRazaoSocial] = useState('');
    const [email, setEmail] = useState('');
    const [alvara, setAlvara] = useState('');
    const [sobre, setSobre] = useState('');

    // endereco
    const [cep, setCep] = useState('');
    const [estado, setEstado] = useState('');
    const [cidade, setCidade] = useState('');
    const [bairro, setBairro] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    //acomodacoes
    const [acomodacoes, setAcomodacoes] = useState<AcomodacoesProps[]>([]);
    const [acomodacoesSelected, setAcomodacoesSelected] = useState<number[]>([]);
    const [acomodacoesToAdd, setAcomodacoesToAdd] = useState<number[]>([]);
    const [acomodacoesToRemove, setAcomodacoesToRemove] = useState<number[]>([]);

    //horario funcionamento
    const [horarios, setHorarios] = useState<HorarioProps[]>([]);
    const [horarioSelecionados, setHorarioSelecionados] = useState<HorarioProps[]>([]);

    //imagens
    const [imagensExistentes, setImagensExistentes] = useState<string[]>([]);
    const [imagensToAdd, setImagensToAdd] = useState<string[]>([]);
    const [imagensToRemove, setImagensToRemove] = useState<string[]>([]);
    const [okHandleLinksImagens, setOkHandleLinksImagens] = useState(false);

    // validação de errors
    const [errorNome, setErrorNome] = useState('');
    const [errorCnpj, setErrorCnpj] = useState('');
    const [errorTelefone, setErrorTelefone] = useState('');
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
    const alvaraInputRef = useRef<TextInput>(null);
    const sobreInputRef = useRef<TextInput>(null);
    const cepInputRef = useRef<TextInput>(null);
    const estadoInputRef = useRef<TextInput>(null);
    const cidadeInputRef = useRef<TextInput>(null);
    const bairroInputRef = useRef<TextInput>(null);
    const logradouroInputRef = useRef<TextInput>(null);
    const numeroInputRef = useRef<TextInput>(null);
    const complementoInputRef = useRef<TextInput>(null);
    const horarioFuncionamentoRef = useRef<HorarioFuncionamentoRef>(null);
    const uploadImageRef = useRef<{ uploadAllImages: () => Promise<void> } | null>(null);

    useEffect(() => {
        setLoading(true);
        try {
            if (typeof estabelecimento === 'string') {
                const parsedEstabelecimento = (JSON.parse(estabelecimento));
                if (estabelecimento) {
                    setIdkey(parsedEstabelecimento.idkey || null);
                    setNome(parsedEstabelecimento.nome || '');
                    setSobre(parsedEstabelecimento.sobre || '');
                    setCnpj(parsedEstabelecimento.cnpj || '');
                    setTelefone(parsedEstabelecimento.telefone || '');
                    setRazaoSocial(parsedEstabelecimento.razaoSocial || '');
                    setEmail(parsedEstabelecimento.email || '');
                    setAlvara(parsedEstabelecimento.alvara || '');

                    if (parsedEstabelecimento.endereco) {
                        setCep(parsedEstabelecimento.endereco.cep || '');
                        setEstado(parsedEstabelecimento.endereco.estado || '');
                        setCidade(parsedEstabelecimento.endereco.cidade || '');
                        setBairro(parsedEstabelecimento.endereco.bairro || '');
                        setLogradouro(parsedEstabelecimento.endereco.logradouro || '');
                        setNumero(parsedEstabelecimento.endereco.numero || '');
                        setComplemento(parsedEstabelecimento.endereco.complemento || '');
                    }

                    if (parsedEstabelecimento.acomodacoes) {
                        const acomodacoes = parsedEstabelecimento.acomodacoes.map((item: any) => item.idkey);
                        setAcomodacoesSelected(acomodacoes);
                    }
                    if (parsedEstabelecimento.horariosFuncionamento) {
                        const horariosConvertidos = parsedEstabelecimento.horariosFuncionamento.map((horario: any) => ({
                            ...horario,
                            horaAbertura: converterHorario(horario.horaAbertura),
                            horaFechamento: converterHorario(horario.horaFechamento),
                        }));
                        setHorarioSelecionados(horariosConvertidos);
                    }
                    if (parsedEstabelecimento.imagens && parsedEstabelecimento.imagens.length > 0) {
                        setImagensExistentes(parsedEstabelecimento.imagens.map((img: { path: string }) => img.path));
                    }
                    setIsEditing(true); // Está no modo de edição
                } else {
                    setIsEditing(false); // Está no modo de cadastro
                }
            }
        } catch (error) {
            console.log("Erro ao parsear estabelecimento:", error);
        } finally {
            setLoading(false);
            fetchAcomodacoes();
        }
    }, [estabelecimento]);

    async function fetchAcomodacoes() {
        setLoading(true);
        try {
            const access_token = await AsyncStorage.getItem('access_token');
            if (!access_token) {
                throw new Error('Token de acesso não disponível');
            }

            const response = await fetch(`${apiUrl}/estabelecimento/acomodacao/list`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar as Acomodações');
            }

            const data = await response.json();
            setAcomodacoes(data);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Erro ao carregar as Acomodações',
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

    function removePontuacao(value: string) {
        return value.replace(/\D/g, '');
    }

    function converterHorario(horaCompleta: string) {
        const [horas, minutos] = horaCompleta.split(':');
        return `${horas}:${minutos}`;
    };

    function handleAcomodacoesChange(toAdd: number[], toRemove: number[]) {
        setAcomodacoesToAdd(toAdd);
        setAcomodacoesToRemove(toRemove);
    };

    function handleTelefoneChange(value: string) {
        setTelefone(value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1'));
    }

    function handleCNPJChange(value: string) {
        setCnpj(value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1'));
    };

    function handleCEPChange(value: string) {
        setCep(value
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{3})\d+?$/, '$1'));
        if (removePontuacao(value).length == 8) {
            buscaCep(removePontuacao(value));
        }
    };

    async function buscaCep(cep: string) {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`).then()
            const data = await response.json();
            if (response.ok) {
                setEstado(data.uf);
                setCidade(data.localidade);
                setBairro(data.bairro);
                setLogradouro(data.logradouro);
            }
        } catch (error) {
            console.log('Erro ao buscar coordenadas:', error);
        }
    }

    function handleSubmit() {
        let hasError = false;
        setOkHandleLinksImagens(false);
        setLoading(true);

        setErrorNome(!nome ? "O campo Nome é obrigatório." : "");
        setErrorCnpj(!cnpj ? "O campo CNPJ é obrigatório." : "");
        setErrorTelefone(!telefone ? "O campo Telefone é obrigatório." : "");
        setErrorRazaoSocial(!razaoSocial ? "O campo Razão Social é obrigatório." : "");
        setErrorEmail(!email ? "O campo Email é obrigatório." : "");
        setErrorAlvara(!alvara ? "O campo Alvará é obrigatório" : "");

        setErrorCep(!cep ? "Informe um CEP" : "");
        setErrorEstado(!estado ? "Informe o Estado" : "");
        setErrorCidade(!cidade ? "Informe a Cidade" : "");
        setErrorBairro(!bairro ? "Informe o Bairro" : "");
        setErrorLogradouro(!logradouro ? "Informe o Logradouro" : "");
        setErrorNumero(!numero ? "Informe o numero do Endereço" : "");

        if (!nome || !cnpj || !telefone || !razaoSocial || !email || !alvara ||
            !cep || !estado || !cidade || !bairro || !logradouro || !numero) {
            hasError = true;
        }

        if (!hasError)
            handleSalvarHorarios();
        else
            setLoading(false);
    };

    function handleSalvarHorarios() {
        setLoading(true);
        let sucesso = false;
        try {
            if (horarioFuncionamentoRef.current) {
                const horarios = horarioFuncionamentoRef.current.getHorarios();
                setHorarios(horarios);
                sucesso = true;
            }
        } catch (error: any) {
            Alert.alert('Erro', error.message);
        } finally {
            setLoading(false);
            if (sucesso)
                handleLocalizacao();
        }
    };

    async function handleLocalizacao() {
        setLoading(true);
        let sucesso = false;
        try {
            const address = `${logradouro}, ${numero}, ${cidade}, ${estado}, Brasil, ${cep}`;
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleMapsApiKey}`
            );
            if (response.data.status === 'OK') {
                const { lat, lng } = response.data.results[0].geometry.location;
                setLatitude(String(lat));
                setLongitude(String(lng));
                sucesso = true;
            } else {
                Alert.alert(`Erro ao encontrar endereço: ${response.data.status}`);
            }
        } catch (error) {
            console.log('Erro ao buscar coordenadas:', error);
        } finally {
            setLoading(false);
            if (sucesso)
                handleImageUpload();
        }
    }

    async function handleImageUpload() {
        if (uploadImageRef.current) {
            try {
                await uploadImageRef.current.uploadAllImages();

            } catch (error) {
                console.log('Erro ao carregar imagens', error);
            }
        } else {
            console.log('UploadImage ref não está definida.');
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
                cnpj: removePontuacao(cnpj),
                razaoSocial: razaoSocial,
                telefone: telefone,
                email: email,
                alvara: alvara,
                sobre: sobre,
                endereco: {
                    logradouro: logradouro,
                    numero: numero,
                    bairro: bairro,
                    cidade: cidade,
                    estado: estado,
                    cep: removePontuacao(cep),
                    complemento: complemento,
                    latitude: latitude,
                    longitude: longitude
                },
                imagensToAdd: imagensToAdd,
                acomodacoesToAdd: acomodacoesToAdd,
                horariosFuncionamento: horarios
            };
        else {
            body = {
                nome: nome,
                telefone: telefone,
                email: email,
                alvara: alvara,
                sobre: sobre,
                endereco: {
                    logradouro: logradouro,
                    numero: numero,
                    bairro: bairro,
                    cidade: cidade,
                    estado: estado,
                    cep: removePontuacao(cep),
                    complemento: complemento,
                    latitude: latitude,
                    longitude: longitude
                },
                imagensToAdd: imagensToAdd,
                imagensToRemove: imagensToRemove,
                acomodacoesToAdd: acomodacoesToAdd,
                acomodacoesToRemove: acomodacoesToRemove,
                horariosFuncionamento: horarios
            };
        }

        gravarEstabelecimento(body);
    }

    async function gravarEstabelecimento(body: any) {
        setLoading(true);
        let method;
        let route;

        if (isEditing) {
            route = `${apiUrl}/estabelecimento/edit/${idkey}`;
            method = 'PATCH';
        } else {
            route = `${apiUrl}/estabelecimento/new`
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
                    Toast.show({ type: 'success', text1: 'Estabelecimento Alterado com Sucesso' });
                else
                    Toast.show({ type: 'success', text1: 'Cadastrado de Estabelecimento Realizado com Sucesso' });
                router.navigate('/menu');
            } else {
                if (isEditing)
                    Toast.show({ type: 'error', text1: 'Falha na Alteração', text2: data.message });
                else
                    Toast.show({ type: 'error', text1: 'Falha no Cadastro', text2: data.message });
            }
        } catch (error) {
            console.log('Erro ao gravar Estabelecimento', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-white" style={{ marginTop: statusBarHeight }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <SetaVoltar />
            <ScrollView showsVerticalScrollIndicator={false} className="w-full px-3">
                <Text className="text-4xl font-semibold mt-5 mb-5">
                    {isEditing ? "Editar Estabelecimento" : "Cadastro Estabelecimento"}
                </Text>
                {/* Informações Operacionais */}
                <Input
                    label="Nome do Estabelecimento"
                    ref={nomeInputRef}
                    obrigatorio
                    value={nome}
                    onChangeText={setNome}
                    errorMessage={errorNome}
                    className='mt-5'
                    returnKeyType="next"
                    onSubmitEditing={() => cnpjInputRef.current?.focus()}
                />
                <Input
                    label="CNPJ"
                    ref={cnpjInputRef}
                    obrigatorio
                    editable={!isEditing}
                    value={cnpj}
                    onChangeText={handleCNPJChange}
                    errorMessage={errorCnpj}
                    keyboardType="numeric"
                    maxLength={18}
                    className='mt-5'
                    returnKeyType="next"
                    onSubmitEditing={() => telefoneInputRef.current?.focus()}
                />
                <Input
                    label="Telefone"
                    ref={telefoneInputRef}
                    obrigatorio
                    value={telefone}
                    onChangeText={handleTelefoneChange}
                    errorMessage={errorTelefone}
                    keyboardType="phone-pad"
                    className='mt-5'
                    returnKeyType="next"
                    onSubmitEditing={() => razaoSocialInputRef.current?.focus()}
                />
                <Input
                    label="Razão Social"
                    ref={razaoSocialInputRef}
                    obrigatorio
                    editable={!isEditing}
                    value={razaoSocial}
                    onChangeText={setRazaoSocial}
                    errorMessage={errorRazaoSocial}
                    className='mt-5'
                    returnKeyType="next"
                    onSubmitEditing={() => emailInputRef.current?.focus()}
                />
                <Input
                    label="Email"
                    ref={emailInputRef}
                    obrigatorio
                    value={email}
                    onChangeText={setEmail}
                    errorMessage={errorEmail}
                    keyboardType="email-address"
                    className='mt-5'
                    returnKeyType="next"
                    onSubmitEditing={() => alvaraInputRef.current?.focus()}
                />
                <Input
                    label="Alvará de Funcionamento"
                    ref={alvaraInputRef}
                    obrigatorio
                    value={alvara}
                    onChangeText={setAlvara}
                    errorMessage={errorAlvara}
                    className='mt-5'
                    returnKeyType="next"
                    onSubmitEditing={() => sobreInputRef.current?.focus()}
                />

                <Input
                    label="Sobre Nós"
                    ref={sobreInputRef}
                    multiline
                    maxLength={300}
                    numberOfLines={8}
                    value={sobre}
                    onChangeText={setSobre}
                    className='mt-5'
                    returnKeyType="next"
                    onSubmitEditing={() => cepInputRef.current?.focus()}
                />

                {/* Endereço */}
                <Text className="text-2xl font-semibold mt-6">Endereço:</Text>
                <Input
                    label="CEP"
                    ref={cepInputRef}
                    obrigatorio
                    value={cep}
                    onChangeText={handleCEPChange}
                    errorMessage={errorCep}
                    keyboardType="numeric"
                    className='mt-5'
                    returnKeyType="next"
                    onSubmitEditing={() => estadoInputRef.current?.focus()}
                />
                <Input
                    label="Estado"
                    ref={estadoInputRef}
                    obrigatorio
                    value={estado}
                    onChangeText={setEstado}
                    errorMessage={errorEstado}
                    maxLength={2}
                    className='mt-5'
                    returnKeyType="next"
                    onSubmitEditing={() => cidadeInputRef.current?.focus()}
                />
                <Input
                    label="Cidade"
                    ref={cidadeInputRef}
                    obrigatorio
                    value={cidade}
                    onChangeText={setCidade}
                    errorMessage={errorCidade}
                    className='mt-5'
                    returnKeyType="next"
                    onSubmitEditing={() => bairroInputRef.current?.focus()}
                />
                <Input
                    label="Bairro"
                    ref={bairroInputRef}
                    obrigatorio
                    value={bairro}
                    onChangeText={setBairro}
                    errorMessage={errorBairro}
                    className='mt-5'
                    returnKeyType="next"
                    onSubmitEditing={() => logradouroInputRef.current?.focus()}
                />
                <Input
                    label="Logradouro"
                    ref={logradouroInputRef}
                    obrigatorio
                    value={logradouro}
                    onChangeText={setLogradouro}
                    errorMessage={errorLogradouro}
                    className='mt-5'
                    returnKeyType="next"
                    onSubmitEditing={() => numeroInputRef.current?.focus()}
                />
                <Input
                    label="Número"
                    ref={numeroInputRef}
                    obrigatorio
                    value={numero}
                    onChangeText={setNumero}
                    errorMessage={errorNumero}
                    keyboardType="numeric"
                    className='mt-5'
                    returnKeyType="next"
                    onSubmitEditing={() => complementoInputRef.current?.focus()}
                />
                <Input
                    label="Complemento"
                    ref={complementoInputRef}
                    value={complemento}
                    onChangeText={setComplemento}
                    className='mt-5'
                />

                {/* Acomodações */}
                <Text className="text-2xl font-semibold mt-6">Acomodações:</Text>
                <MultiSelect
                    max={5}
                    opcoes={acomodacoes}
                    initialSelected={acomodacoesSelected}
                    onSelectionChange={handleAcomodacoesChange}
                />

                {/* Horário de Funcionamento */}
                <Text className="text-2xl font-semibold mt-6">Horário de Funcionamento:</Text>
                <HorarioFuncionamento
                    ref={horarioFuncionamentoRef}
                    horariosPreenchidos={horarioSelecionados}
                />

                {/* Imagens */}
                <Text className="text-2xl font-semibold mt-6">Imagens:</Text>
                <UploadImage
                    ref={uploadImageRef}
                    pastaBucket="estabelecimento"
                    multipasImagens={true}
                    imagensExistentes={imagensExistentes}
                    linksImagens={handleLinksImagens}
                    btClassName='mt-1 bg-roxo p-2 rounded-2xl active:bg-roxo/80 mx-4 mt-4 mb-10 w-[100%]'
                    btClassNameTitle="text-white text-center text-lg"
                />
            </ScrollView>
            <View style={globalStyles.buttonContainer}>
                <BotaoTouchableOpacity
                    title={isEditing ? 'Salvar Alterações' : 'Cadastrar'}
                    className='bg-primary p-4 rounded-2xl active:bg-secondary mx-4'
                    classNameTitle="text-white text-center text-xl"
                    onPress={handleSubmit}
                />
            </View>
            {loading && <Loading />}
        </SafeAreaView>
    );
}