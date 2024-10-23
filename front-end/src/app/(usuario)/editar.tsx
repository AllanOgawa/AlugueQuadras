import globalStyles from '@/src/styles/globalStyles';
import { SafeAreaView, ScrollView, StatusBar, Text, TextInput, View } from 'react-native';
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
// import UploadImage from '@/src/components/UploadImagem';
import UploadImage from '@/src/components/UploadMultiplasImagens';

const { apiUrl, bucketUrl } = Constants.expoConfig.extra;

export default function UsuarioEditar() {
    const [loading, setLoading] = useState(false);
    const [nome, setNome] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [dtNascimento, setDtNascimento] = useState('');
    const [imagem, setImagem] = useState('');

    const context = useContext(UsuarioContext);
    if (!context) {
        throw new Error("YourComponent must be used within an ArrayProvider");
    }
    const { usuario, setUsuario } = context;
    const [errorNome, setErrorNome] = useState('');
    const [errorUsername, setErrorUsername] = useState('');
    const nomeInputRef = useRef<TextInput>(null);
    const usernameInputRef = useRef<TextInput>(null);


    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const uploadImageRef = useRef<{ uploadAllImages: () => Promise<void> } | null>(null);

    const handleImageUpload = (url: string) => {
        if (url) {
            setImageUrls(prev => [...prev, url]);
            console.log('Imagem carregada:', url);
        }
    };

    const handleUploadAll = async () => {
        if (uploadImageRef.current) {
            await uploadImageRef.current.uploadAllImages();
        } else {
            console.error('UploadImage ref não está definida.');
        }
    };


    useEffect(() => {
        if (usuario != null && usuario[0] !== null) {
            if (usuario[0].nome) {
                setNome(usuario[0].nome);
            }
            if (usuario[0].username) {
                setUsername(usuario[0].username);
            }
            if (usuario[0].email) {
                setEmail(usuario[0].email);
            }
            if (usuario[0].cpf) {
                setCpf(usuario[0].cpf);
            }
            if (usuario[0].dataNascimento) {
                setDtNascimento(transformarData(usuario[0].dataNascimento));
            }
            if (usuario[0].imagens && usuario[0].imagens[0].path) {
                setImagem(usuario[0].imagens[0].path);
            }
        }
        setLoading(false);
    }, [usuario]);


    function handleSubmit() {
        let isValid = true;

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
        handleUploadAll()
        if (isValid) cadastrar();
    };

    function transformarData(data: string) {
        const [ano, mes, dia] = data.split("-");
        return `${dia}/${mes}/${ano}`;
    }

    async function storeData(access_token: string) {
        try {
            await AsyncStorage.setItem("access_token", access_token);
            console.log('Dados armazenados no localStorage com sucesso');
        } catch (e) {
            console.error('Erro ao salvar dados', e);
        }
    };


    async function cadastrar() {
        // const dataNascimento = transformarData(dtNascimento);
        let success = false;
        // setLoading(true);

        // try {
        //     const response = await fetch(`${apiUrl}/auth/register`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             nome: nome,
        //             username: username,
        //             email: email,
        //             cpf: cpf,
        //             dataNascimento: dataNascimento,
        //             senha: senha,
        //             imagensToAdd: ["public-storage/usuario/usuario.png"]
        //         }),
        //     });

        //     const data = await response.json();

        //     if (response.ok) {
        //         console.log(data)
        //         Toast.show({
        //             type: 'success',
        //             text1: "Cadastro Realizado com Sucesso",
        //             text2: "Bem-vindo ao AlugueQuadras!",
        //         });
        //         success = true;
        //     } else {
        //         console.error('Erro no cadastro', data);
        //         Toast.show({
        //             type: 'error',
        //             text1: "Cadastro Falhou",
        //             text2: data.message,
        //         });
        //     }
        // } catch (error) {
        //     console.error('Erro de rede', error);
        //     Toast.show({
        //         type: 'error',
        //         text1: "Erro de Rede",
        //         text2: String(error),
        //     });
        // } finally {
        //     if (success) {
        //         login();
        //     }
        // }
    }

    async function login() {
        // try {
        //     const response = await fetch(`${apiUrl}/auth/login`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             login: username,
        //             senha: senha,
        //         }),
        //     });

        //     const data = await response.json();

        //     if (response.ok) {
        //         storeData(data.access_token)
        //         console.log(data);
        //         Toast.show({
        //             type: 'success',
        //             text1: "Login Bem-Sucedido",
        //         });
        //         router.replace({
        //             pathname: '/(tabs)/inicio',
        //             params: { userData: JSON.stringify(data) },
        //         });
        //     } else {
        //         console.error('Erro no login', data);
        //         Toast.show({
        //             type: 'error',
        //             text1: "Login Falhou",
        //             text2: data.message,
        //         });
        //     }
        // } catch (error) {
        //     console.error('Erro de rede', error);
        //     Toast.show({
        //         type: 'error',
        //         text1: "Erro de Rede",
        //         text2: String(error),
        //     });
        // } finally {
        //     setLoading(false);
        // }
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
                    <Text className="text-4xl font-semibold mt-10 mb-5">Editar conta</Text>
                    <UploadImage onImageUpload={handleImageUpload} ref={uploadImageRef} />
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
                </View>
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
