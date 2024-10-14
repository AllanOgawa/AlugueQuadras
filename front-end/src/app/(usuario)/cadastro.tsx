import globalStyles from '@/src/styles/globalStyles';
import { SafeAreaView, ScrollView, StatusBar, Text, TextInput, View } from 'react-native';

import Constants from 'expo-constants'
import { useRef, useState } from 'react';
import Input from '@components/inputs/input';
import InputSenha from '@components/inputs/inputSenha';
import BotaoTouchableOpacity from '@components/botoes/botaoTouchableOpacity';
import SetaVoltar from '@components/setaVoltar';
import InputData from '@components/inputs/inputData';
import UploadImagem from '@components/UploadImagem';
import UploadImage from '@components/UploadImagem';

export default function UsuarioCadastro() {
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

    const handleSubmit = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let erroEmail = "";
        let erroCpf = "";

        setErrorNome((!nome) ? "o campo Nome é obrigatório." : "");
        setErrorSenha((!senha) ? "o campo Senha é obrigatório." : "");
        setErrorConfirmarSenha((!confirmarSenha) ? "a confirmação de Senha é obrigatório." : "");
        setErrorUsername((!username) ? "o campo Username é obrigatório" : "");

        if (!email) erroEmail = "o campo Email é obrigatório.";
        else if (!emailRegex.test(email)) erroEmail = "Formato de Email Inválido.";
        setErrorEmail(erroEmail);

        if (!cpf) erroCpf = "o campo CPF é obrigatório.";
        else if (cpf.length < 14) erroCpf = "CPF Inválido.";
        setErrorCpf(erroCpf);

        if (senha.length < 8)
            setErrorSenha("A senha deve ter pelo menos 8 caracteres.");

        if (confirmarSenha !== senha)
            setErrorConfirmarSenha("As senhas não coincidem.");
    };

    const handleCpfChange = (text: string) => {
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

    const handleDateChange = (date: string) => {
        setDtNascimento(date); // Atualiza o estado da data no componente pai
    };

    const handleImageUpload = (url: string) => {
        console.log('Imagem enviada para:', url);
        // Aqui você pode realizar outras ações como salvar a URL no banco de dados
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

                    <UploadImage
                        onImageUpload={handleDateChange}
                    />

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
                        className='mb-5'
                        ref={dtNascimentoInputRef}
                        label="Data de Nascimento:"
                        obrigatorio
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
                    title={'Alugar Quadra'}
                    className='bg-primary p-4 rounded-2xl active:bg-secondary mx-4'
                    classNameTitle="text-white text-center text-xl"
                    onPress={handleSubmit}
                />
            </View>

        </SafeAreaView>
    );
}
