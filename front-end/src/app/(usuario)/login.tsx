import { SafeAreaView, ScrollView, StatusBar, Text, TextInput, View } from 'react-native';

import Constants from 'expo-constants'
import { useRef, useState } from 'react';
import Input from '@components/inputs/input';
import InputSenha from '@components/inputs/inputSenha';
import SetaVoltar from '@components/setaVoltar';
import BotaoPressable from '@components/botoes/botaoPressable';
import { router } from 'expo-router';

export default function UsuarioLogin() {
    const [username, setUsername] = useState('');
    const [senha, setSenha] = useState('');
    const [errorUsername, setErrorUsername] = useState('');
    const [errorSenha, setErrorSenha] = useState('');

    const usernameInputRef = useRef<TextInput>(null);
    const senhaInputRef = useRef<TextInput>(null);

    const handleSubmit = () => {
        setErrorSenha((!senha) ? "o campo Senha é obrigatório." : "");
        setErrorUsername((!username) ? "o campo Username/Email é obrigatório" : "");
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
                        errorMessage={errorUsername}
                        keyboardType="email-address"
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
                    onPress={handleSubmit}
                />
                <BotaoPressable
                    title={'Registrar'}
                    className='bg-roxo p-4 rounded-2xl active:bg-roxo/80 mx-4 mt-4'
                    classNameTitle='text-white text-center text-xl'
                    onPress={() => { router.push('/(usuario)/cadastro') }}
                />
            </ScrollView>

        </SafeAreaView>
    );
}
