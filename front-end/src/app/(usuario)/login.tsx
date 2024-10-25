import { SafeAreaView, ScrollView, StatusBar, Text, TextInput, View } from 'react-native';
import { useContext, useRef, useState } from 'react';
import Constants from 'expo-constants'
import { router } from 'expo-router';
import Input from '@components/inputs/input';
import InputSenha from '@components/inputs/inputSenha';
import SetaVoltar from '@components/setaVoltar';
import BotaoPressable from '@components/botoes/botaoPressable';
import Loading from '@components/loading';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UsuarioContext } from '@context/usuarioContext';

const { apiUrl } = Constants.expoConfig.extra;

export default function UsuarioLogin() {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [senha, setSenha] = useState('');
    const [errorUsername, setErrorUsername] = useState('');
    const [errorSenha, setErrorSenha] = useState('');

    const usernameInputRef = useRef<TextInput>(null);
    const senhaInputRef = useRef<TextInput>(null);

    const context = useContext(UsuarioContext);
    if (!context) {
        throw new Error("YourComponent must be used within an ArrayProvider");
    }
    const { usuario, setUsuario } = context;

    async function setAccessToken(access_token: string) {
        try {
            await AsyncStorage.setItem("access_token", access_token);
            console.log('Dados armazenados no localStorage com sucesso');
        } catch (e) {
            console.error('Erro ao salvar dados', e);
        }
    };

    async function handleSubmit() {
        setLoading(true);
        setErrorUsername('');
        setErrorSenha('');

        let accessToken = "";
        let isValid = true;
        if (!username) {
            setErrorUsername("O campo Username/Email é obrigatório");
            isValid = false;
        }
        if (!senha) {
            setErrorSenha("O campo Senha é obrigatório.");
            isValid = false;
        }

        if (!isValid) return;

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
                setAccessToken(data.access_token);
                accessToken = data.access_token;
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
            if (accessToken != "") {
                getProfile(accessToken)
            }
            setLoading(false);
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
                    <Text className="text-4xl font-semibold mt-10 mb-5">Entrar</Text>

                    <Input
                        className='mb-5 mt-7'
                        ref={usernameInputRef}
                        label="Username/Email:"
                        obrigatorio
                        keyboardType="email-address"
                        errorMessage={errorUsername}
                        value={username}
                        onChangeText={setUsername}
                        autoComplete="email"
                        returnKeyType="next"
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
                        onSubmitEditing={handleSubmit}
                    />
                </View>

                <BotaoPressable
                    title={'Login'}
                    className='bg-primary p-4 rounded-2xl active:bg-secondary mx-4 mt-20'
                    classNameTitle='text-white text-center text-xl'
                    // onPress={handleSubmit}
                    onPress={handleSubmit}
                />
                <BotaoPressable
                    title={'Registrar'}
                    className='bg-roxo p-4 rounded-2xl active:bg-roxo/80 mx-4 mt-4'
                    classNameTitle='text-white text-center text-xl'
                    onPress={() => { router.push('/(usuario)/cadastro') }}
                />
            </ScrollView>
            {loading && <Loading />}
        </SafeAreaView>
    );
}
