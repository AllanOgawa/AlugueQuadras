import globalStyles from '@/src/styles/globalStyles';
import { Alert, SafeAreaView, ScrollView, StatusBar, Text, TextInput, View } from 'react-native';
import { useRef, useState } from 'react';
import Constants from 'expo-constants'
import SetaVoltar from '@components/setaVoltar';
import Loading from '@components/loading';
import InputSenha from '@components/inputs/inputSenha';
import BotaoTouchableOpacity from '@components/botoes/botaoTouchableOpacity';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import HorizontalLine from '@/src/components/horizontalLine';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';

export default function UsuarioCadastro() {
    const { email } = useLocalSearchParams();

    const [loading, setLoading] = useState(false);
    const [senhaAtual, setSenhaAtual] = useState('');
    const [senhaNova, setSenhaNova] = useState('');
    const [confirmarSenhaNova, setConfirmarSenhaNova] = useState('');

    const [errorSenhaAtual, setErrorSenhaAtual] = useState('');
    const [errorSenhaNova, setErrorSenhaNova] = useState('');
    const [errorConfirmarSenhaNova, setErrorConfirmarSenhaNova] = useState('');

    const senhaAtualInputRef = useRef<TextInput>(null);
    const senhaNovaInputRef = useRef<TextInput>(null);
    const confirmarSenhaNovaInputRef = useRef<TextInput>(null);

    function handleSubmit() {
        let isValid = true;

        setErrorSenhaAtual("");
        setErrorSenhaNova("");
        setErrorConfirmarSenhaNova("");

        if (!senhaAtual) {
            setErrorSenhaAtual("o campo Senha é obrigatório.");
            isValid = false;
        }
        if (senhaNova.length < 8) {
            setErrorSenhaNova("a senha deve ter pelo menos 8 caracteres.");
            isValid = false;
        }
        if (senhaAtual == senhaNova) {
            setErrorSenhaNova("o campo de Nova Senha possui o mesmo valor do campo de Senha Atual.");
            isValid = false;
        }
        if (!senhaNova) {
            setErrorSenhaNova("o campo Senha é obrigatório.");
            isValid = false;
        }
        if (confirmarSenhaNova !== senhaNova) {
            setErrorConfirmarSenhaNova("as senhas não coincidem.");
            isValid = false;
        }
        if (!confirmarSenhaNova) {
            setErrorConfirmarSenhaNova("a confirmação de Senha é obrigatório.");
            isValid = false;
        }

        if (isValid) getAcessToken();
    };

    async function getAcessToken() {
        try {
            const value = await AsyncStorage.getItem("access_token");
            if (value !== null && value !== "") {
                alterarSenha(value);
            } else {
                setLoading(false);
            }
        } catch (e) {
            console.log('Erro ao obter dados', e);
        }
    };

    async function setAccessToken(access_token: string) {
        try {
            await AsyncStorage.setItem("access_token", access_token);
        } catch (e) {
            console.log('Erro ao salvar dados', e);
        }
    };

    async function alterarSenha(accessToken: string) {
        let success = false;
        setLoading(true);

        try {
            const response = await fetch(`${apiUrl}/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    senhaAtual: senhaAtual,
                    senhaNova: senhaNova
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Toast.show({
                    type: 'success',
                    text1: "Senha Alterada com Sucesso",
                });
                success = true;
            } else {
                Alert.alert(
                    "Alteração de Senha Falhou",
                    data.message
                );
            }
        } catch (error) {
            Alert.alert(
                "Erro de Rede",
                String(error)
            );
        } finally {
            setLoading(false);
            if (success) {
                login();
            }
        }
    }

    async function login() {
        setLoading(true);

        let success = false;
        try {
            const response = await fetch(`${apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: email,
                    senha: senhaNova,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setAccessToken(data.access_token);
                success = true;
            } else {
                Alert.alert(
                    "Login Falhou",
                    data.message
                );
            }
        } catch (error) {
            Alert.alert(
                "Erro de Rede",
                String(error)
            );
        } finally {
            setLoading(false);
            if (success) {
                router.back();
            }
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
                    <Text className="text-4xl font-semibold mt-10 mb-5">Alterar Senha</Text>

                    <InputSenha
                        className=''
                        ref={senhaAtualInputRef}
                        label="Senha Atual:"
                        obrigatorio
                        errorMessage={errorSenhaAtual}
                        value={senhaAtual}
                        onChangeText={setSenhaAtual}
                        autoComplete="password"
                        returnKeyType="next"
                        onSubmitEditing={() => senhaNovaInputRef.current?.focus()}
                    />

                    <HorizontalLine margin={28} />

                    <InputSenha
                        className='mb-5'
                        ref={senhaNovaInputRef}
                        label="Nova Senha:"
                        obrigatorio
                        errorMessage={errorSenhaNova}
                        value={senhaNova}
                        onChangeText={setSenhaNova}
                        autoComplete="password"
                        returnKeyType="next"
                        onSubmitEditing={() => confirmarSenhaNovaInputRef.current?.focus()}
                    />

                    <InputSenha
                        className='mb-5'
                        ref={confirmarSenhaNovaInputRef}
                        label="Confirme sua Nova Senha:"
                        obrigatorio
                        errorMessage={errorConfirmarSenhaNova}
                        value={confirmarSenhaNova}
                        onChangeText={setConfirmarSenhaNova}
                        autoComplete="password"
                        returnKeyType="done"
                        onSubmitEditing={handleSubmit}
                    />
                </View>
            </ScrollView>

            <View style={globalStyles.buttonContainer}>
                <BotaoTouchableOpacity
                    title={'Alterar Senha'}
                    className='bg-primary p-4 rounded-2xl active:bg-secondary mx-4'
                    classNameTitle="text-white text-center text-xl"
                    onPress={handleSubmit}
                />
            </View>
            {loading && <Loading />}
        </SafeAreaView>
    );
}
