import globalStyles from '@/src/styles/globalStyles';
import { Alert, SafeAreaView, ScrollView, StatusBar, Text, TextInput, View } from 'react-native';
import { useContext, useEffect, useRef, useState } from 'react';
import Constants from 'expo-constants'
import SetaVoltar from '@components/setaVoltar';
import Loading from '@components/loading';
import Input from '@components/inputs/input';
import BotaoTouchableOpacity from '@components/botoes/botaoTouchableOpacity';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { UsuarioContext } from '@context/usuarioContext';
import UploadImage from '@/src/components/uploadImagem';
import BotaoPressable from '@/src/components/botoes/botaoPressable';
import HorizontalLine from '@/src/components/horizontalLine';

const { apiUrl, bucketUrl } = Constants.expoConfig.extra;

export default function UsuarioEditar() {
    const [loading, setLoading] = useState(false);
    const [nome, setNome] = useState('');
    const [username, setUsername] = useState('');
    const [usernameAnterior, setUsernameAnterior] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [dtNascimento, setDtNascimento] = useState('');
    const [errorNome, setErrorNome] = useState('');
    const [errorUsername, setErrorUsername] = useState('');
    const [imagensExistentes, setImagensExistentes] = useState<string[]>([]);
    const [imagensToAdd, setImagensToAdd] = useState<string[]>([]);
    const [imagensToRemove, setImagensToRemove] = useState<string[]>([]);
    const [okHandleLinksImagens, setOkHandleLinksImagens] = useState(false);
    const [accessToken, setAccessToken] = useState('');

    const context = useContext(UsuarioContext);
    if (!context) {
        throw new Error("YourComponent must be used within an ArrayProvider");
    }
    const { usuario, setUsuario } = context;

    const nomeInputRef = useRef<TextInput>(null);
    const usernameInputRef = useRef<TextInput>(null);
    const uploadImageRef = useRef<{ uploadAllImages: () => Promise<void> } | null>(null);

    useEffect(() => {
        if (usuario != null && usuario[0] !== null) {
            if (usuario[0].nome)
                setNome(usuario[0].nome);
            if (usuario[0].username) {
                setUsername(usuario[0].username);
                setUsernameAnterior(usuario[0].username);
            }
            if (usuario[0].email)
                setEmail(usuario[0].email);
            if (usuario[0].cpf)
                setCpf(usuario[0].cpf);
            if (usuario[0].dataNascimento)
                setDtNascimento(transformarData(usuario[0].dataNascimento));
            if (usuario[0].imagens && usuario[0].imagens.length > 0)
                setImagensExistentes(usuario[0].imagens.map((img: { path: string }) => img.path));
        }
        setLoading(false);
    }, [usuario]);

    useEffect(() => {
        if (okHandleLinksImagens) editarUsuario();
    }, [okHandleLinksImagens]);


    function transformarData(data: string) {
        const [ano, mes, dia] = data.split("-");
        return `${dia}/${mes}/${ano}`;
    }

    function handleSubmit() {
        let isValid = true;

        setOkHandleLinksImagens(false);
        setLoading(true);
        setErrorNome("");
        setErrorUsername("");

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

        if (isValid) getAcessToken();
        else setLoading(false);
    };

    async function getAcessToken() {
        try {
            const value = await AsyncStorage.getItem("access_token");
            if (value !== null && value !== "") {
                setAccessToken(value);
                handleImageUpload();
            } else {
                setLoading(false);
            }
        } catch (e) {
            console.error('Erro ao obter dados', e);
        }
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

    async function editarUsuario() {
        let body;
        if (username == usernameAnterior) {
            body = {
                nome: nome,
                imagensToAdd: imagensToAdd,
                imagensToRemove: imagensToRemove
            }
        } else {
            body = {
                nome: nome,
                username: username,
                imagensToAdd: imagensToAdd,
                imagensToRemove: imagensToRemove
            }
        }
        try {
            const response = await fetch(`${apiUrl}/auth/profile/edit`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (response.ok) {
                Toast.show({
                    type: 'success',
                    text1: "Alteração de Conta Realizado com Sucesso",
                });
                router.replace('/(tabs)/perfil');
                setUsuario([data]);
            } else {
                Alert.alert(
                    "Alteração de Conta Falhou",
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
        }
    }

    return (
        <SafeAreaView className='flex-1 bg-white' style={{ marginTop: Constants.statusBarHeight }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <SetaVoltar />
            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="w-full px-4">
                    <Text className="text-4xl font-semibold mt-10 mb-5">Editar conta</Text>
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
                    />
                    <Input
                        className='mb-5'
                        label="Email:"
                        value={email}
                        editable={false}
                    />
                    <Input
                        className='mb-5'
                        label="CPF:"
                        value={cpf}
                        editable={false}
                    />
                    <Input
                        className='mb-5'
                        label="Data de Nascimento:"
                        value={dtNascimento}
                        editable={false}
                    />
                    <Input
                        className='mb-1'
                        label="Senha:"
                        value={"********"}
                        editable={false}
                    />
                    <BotaoPressable
                        title={'Alterar Senha'}
                        className='mb-5 bg-secondary p-2 rounded-2xl active:bg-secondary/50 w-[100%]'
                        classNameTitle="text-white text-center text-lg"
                        onPress={() => router.push({
                            pathname: '/(usuario)/editarSenha',
                            params: { email: email },
                        })} />

                    <HorizontalLine margin={14} />

                    <Text className='text-lg'>
                        Imagem:
                    </Text>

                    <UploadImage
                        ref={uploadImageRef}
                        pastaBucket="usuario"
                        multipasImagens={false}
                        imagensExistentes={imagensExistentes}
                        linksImagens={handleLinksImagens}
                        btClassName='mt-1 bg-roxo p-2 rounded-2xl active:bg-roxo/80 mx-4 w-[100%]'
                        btClassNameTitle="text-white text-center text-lg"
                    />
                </View>

                <View className='px-4'>
                    <HorizontalLine margin={28} />
                </View>

                <BotaoPressable
                    title={'Deletar Conta'}
                    className='mt-10 bg-red-600 p-4 rounded-2xl active:bg-red-700 mx-4'
                    classNameTitle="text-white text-center text-xl"
                    onPress={() => { console.log("Deletar Usuario") }} />
            </ScrollView>

            <View style={globalStyles.buttonContainer}>
                <BotaoTouchableOpacity
                    title={'Salvar Alterações'}
                    className='bg-primary p-4 rounded-2xl active:bg-secondary mx-4'
                    classNameTitle="text-white text-center text-xl"
                    onPress={handleSubmit}
                />
            </View>
            {loading && <Loading />}
        </SafeAreaView>
    );
}
