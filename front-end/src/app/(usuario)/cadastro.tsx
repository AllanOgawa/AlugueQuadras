import globalStyles from '@/src/styles/globalStyles';
import { SafeAreaView, ScrollView, StatusBar, Text, TextInput, View } from 'react-native';
import { useContext, useRef, useState } from 'react';
import Constants from 'expo-constants'
import SetaVoltar from '@components/setaVoltar';
import Loading from '@components/loading';
import Input from '@components/inputs/input';
import InputSenha from '@components/inputs/inputSenha';
import InputData from '@components/inputs/inputData';
import BotaoTouchableOpacity from '@components/botoes/botaoTouchableOpacity';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { UsuarioContext } from '@context/usuarioContext';

const { apiUrl, userDefaultImage } = Constants.expoConfig.extra;

export default function UsuarioCadastro() {
    const [loading, setLoading] = useState(false);
    const [nome, setNome] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [dtNascimento, setDtNascimento] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    const [errorNome, setErrorNome] = useState('');
    const [errorUsername, setErrorUsername] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorCpf, setErrorCpf] = useState('');
    const [errorDtNascimento, setErrorDtNascimento] = useState('');
    const [errorSenha, setErrorSenha] = useState('');
    const [errorConfirmarSenha, setErrorConfirmarSenha] = useState('');

    const nomeInputRef = useRef<TextInput>(null);
    const usernameInputRef = useRef<TextInput>(null);
    const emailInputRef = useRef<TextInput>(null);
    const cpfInputRef = useRef<TextInput>(null);
    const dtNascimentoInputRef = useRef<TextInput>(null);
    const senhaInputRef = useRef<TextInput>(null);
    const confirmarSenhaInputRef = useRef<TextInput>(null);

    const context = useContext(UsuarioContext);
    if (!context) {
        throw new Error("YourComponent must be used within an ArrayProvider");
    }
    const { usuario, setUsuario } = context;

    function handleSubmit() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let isValid = true;

        setErrorNome("");
        setErrorUsername("");
        setErrorEmail("");
        setErrorCpf("");
        setErrorDtNascimento("");
        setErrorSenha("");
        setErrorConfirmarSenha("");

        if (!nome) {
            setErrorNome("o campo Nome é obrigatório.");
            isValid = false;
        }
        if (!username) {
            setErrorUsername("o campo Username é obrigatório.");
            isValid = false;
        }
        if (username && username.length < 6) {
            setErrorUsername("o campo Username deve ter pelo menos 6 caracteres.");
            isValid = false;
        }
        if (!emailRegex.test(email)) {
            setErrorEmail("Formato de Email Inválido.");
            isValid = false;
        }
        if (!email) {
            setErrorEmail("o campo Email é obrigatório.");
            isValid = false;
        }
        if (cpf.length < 14) {
            setErrorCpf("CPF Inválido.");
            isValid = false;
        }
        if (!cpf) {
            setErrorCpf("o campo CPF é obrigatório.");
            isValid = false;
        }
        if (!dtNascimento) {
            setErrorDtNascimento("o campo Data de Nascimento é obrigatório.");
            isValid = false;
        }
        if (dtNascimento) {
            const [dia, mes, ano] = dtNascimento.split('/');
            if (Number(dia) > 31 || Number(dia) < 1) {
                setErrorDtNascimento("verifique o Dia da data de nascimento.");
                isValid = false;
            } else
                if (Number(mes) > 12 || Number(mes) < 1) {
                    setErrorDtNascimento("verifique o Mês da data de nascimento.");
                    isValid = false;
                } else
                    if (Number(ano) > (new Date().getFullYear() - 13) || Number(ano) < 1900) {
                        setErrorDtNascimento("verifique o Ano da data de nascimento.");
                        isValid = false;
                    }
        }
        if (senha.length < 8) {
            setErrorSenha("a senha deve ter pelo menos 8 caracteres.");
            isValid = false;
        }
        if (!senha) {
            setErrorSenha("o campo Senha é obrigatório.");
            isValid = false;
        }
        if (confirmarSenha !== senha) {
            setErrorConfirmarSenha("as senhas não coincidem.");
            isValid = false;
        }
        if (!confirmarSenha) {
            setErrorConfirmarSenha("a confirmação de Senha é obrigatório.");
            isValid = false;
        }

        if (isValid) cadastrar();
    };

    function handleCpfChange(text: string) {
        let formattedCpf = text.replace(/\D/g, ''); //remove ponto e hífen
        if (formattedCpf.length > 14)
            formattedCpf = formattedCpf.substring(0, 14);
        else if (formattedCpf.length > 9)
            formattedCpf = formattedCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
        else if (formattedCpf.length > 6)
            formattedCpf = formattedCpf.replace(/(\d{3})(\d{3})(\d)/, '$1.$2.$3');
        else if (formattedCpf.length > 3)
            formattedCpf = formattedCpf.replace(/(\d{3})(\d)/, '$1.$2');
        setCpf(formattedCpf);
    };

    function handleDateChange(date: string) {
        setDtNascimento(date);
    };

    function transformarData(data: string) {
        const [dia, mes, ano] = data.split('/');
        return `${ano}-${mes}-${dia}`;
    }

    async function setAccessToken(access_token: string) {
        try {
            await AsyncStorage.setItem("access_token", access_token);
            console.log('Dados armazenados no localStorage com sucesso');
        } catch (e) {
            console.error('Erro ao salvar dados', e);
        }
    };

    async function cadastrar() {
        const dataNascimento = transformarData(dtNascimento);
        let success = false;
        setLoading(true);

        try {
            const response = await fetch(`${apiUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: nome,
                    username: username,
                    email: email,
                    cpf: cpf,
                    dataNascimento: dataNascimento,
                    senha: senha,
                    imagensToAdd: [userDefaultImage]
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data)
                Toast.show({
                    type: 'success',
                    text1: "Cadastro Realizado com Sucesso",
                    text2: "Bem-vindo ao AlugueQuadras!",
                });
                success = true;
            } else {
                console.error('Erro no cadastro', data);
                Toast.show({
                    type: 'error',
                    text1: "Cadastro Falhou",
                    text2: data.message,
                });
            }
        } catch (error) {
            console.error('Erro de rede', error);
            Toast.show({
                type: 'error',
                text1: "Erro de Rede",
                text2: String(error),
            });
        } finally {
            setLoading(false);
            if (success) {
                login();
            }
        }
    }

    async function login() {
        setLoading(true);
        let accessToken = "";
        try {
            const response = await fetch(`${apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: username,
                    senha: senha,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                accessToken = data.access_token;
                setAccessToken(data.access_token);
            } else {
                console.error('Erro no login', data);
                Toast.show({
                    type: 'error',
                    text1: "Login Falhou",
                    text2: data.message,
                });
            }
        } catch (error) {
            console.error('Erro de rede', error);
            Toast.show({
                type: 'error',
                text1: "Erro de Rede",
                text2: String(error),
            });
        } finally {
            setLoading(false);
            if (accessToken != "") {
                getProfile(accessToken);
            }
        }
    };

    async function getProfile(accessToken: string) {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/auth/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                Toast.show({
                    type: 'success',
                    text1: "Login Bem-Sucedido",
                });
                setUsuario([data]);
                router.replace('/(tabs)/inicio');
            }
        } catch (error) {
            console.error('Erro de rede', error);
            Toast.show({
                type: 'error',
                text1: "Erro de Rede",
                text2: String(error),
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className='flex-1 bg-white' style={{ marginTop: Constants.statusBarHeight }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <SetaVoltar />
            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="w-full px-4">
                    <Text className="text-4xl font-semibold mt-10 mb-5">Criar conta</Text>

                    <Input
                        className='mb-5'
                        ref={nomeInputRef}
                        label="Nome Completo:"
                        obrigatorio
                        errorMessage={errorNome}
                        value={nome}
                        onChangeText={setNome}
                        autoComplete="name"
                        returnKeyType="next"
                        onSubmitEditing={() => usernameInputRef.current?.focus()}
                    />
                    <Input
                        className='mb-5'
                        ref={usernameInputRef}
                        label="Username:"
                        obrigatorio
                        errorMessage={errorUsername}
                        value={username}
                        onChangeText={setUsername}
                        autoComplete="name"
                        returnKeyType="next"
                        onSubmitEditing={() => emailInputRef.current?.focus()}
                    />
                    <Input
                        className='mb-5'
                        ref={emailInputRef}
                        label="Email:"
                        obrigatorio
                        errorMessage={errorEmail}
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        autoComplete="email"
                        returnKeyType="next"
                        onSubmitEditing={() => cpfInputRef.current?.focus()}
                    />
                    <Input
                        className='mb-5'
                        ref={cpfInputRef}
                        label="CPF:"
                        obrigatorio
                        errorMessage={errorCpf}
                        keyboardType="numeric"
                        value={cpf}
                        maxLength={14}
                        onChangeText={handleCpfChange}
                        autoComplete="off"
                        returnKeyType="next"
                        onSubmitEditing={() => dtNascimentoInputRef.current?.focus()}
                    />
                    <InputData
                        ref={dtNascimentoInputRef}
                        label="Data de Nascimento:"
                        className='mb-5'
                        obrigatorio={true}
                        errorMessage={errorDtNascimento}
                        maxLength={10}
                        returnKeyType="next"
                        onDateChange={handleDateChange}
                        onSubmitEditing={() => senhaInputRef.current?.focus()}
                    />
                    <InputSenha
                        ref={senhaInputRef}
                        label="Senha:"
                        obrigatorio
                        errorMessage={errorSenha}
                        value={senha}
                        onChangeText={setSenha}
                        autoComplete="password"
                        returnKeyType="next"
                        onSubmitEditing={() => confirmarSenhaInputRef.current?.focus()}
                    />
                    <Text className='mb-5 text-sm color-gray-600'>
                        A senha deve ter pelo menos 8 caracteres.
                    </Text>
                    <InputSenha
                        className='mb-5'
                        ref={confirmarSenhaInputRef}
                        label="Confirme sua Senha:"
                        obrigatorio
                        errorMessage={errorConfirmarSenha}
                        value={confirmarSenha}
                        onChangeText={setConfirmarSenha}
                        autoComplete="password"
                        returnKeyType="done"
                        onSubmitEditing={handleSubmit}
                    />
                </View>
            </ScrollView>

            <View style={globalStyles.buttonContainer}>
                <BotaoTouchableOpacity
                    title={'Cadastrar'}
                    className='bg-primary p-4 rounded-2xl active:bg-secondary mx-4'
                    classNameTitle="text-white text-center text-xl"
                    onPress={handleSubmit}
                />
            </View>
            {loading && <Loading />}
        </SafeAreaView>
    );
}
