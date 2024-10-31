import { SafeAreaView, StatusBar, Text, View, Pressable } from 'react-native';
import { useState } from 'react';
import Constants from 'expo-constants'
import { router } from 'expo-router';
import SetaVoltar from '@components/setaVoltar';
import BotaoPressable from '@components/botoes/botaoPressable';
import Loading from '@components/loading';
import HorizontalLine from '@/src/components/horizontalLine';
import IconUsuario from '@/src/components/iconUsuario';

const { bucketUrl } = Constants.expoConfig.extra;

export default function UsuarioLogin() {
    const [loading, setLoading] = useState(false);

    return (
        <SafeAreaView className='flex-1 bg-white' style={{ marginTop: Constants.statusBarHeight }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <SetaVoltar />
            <View className='flex-1 bg-gray-200'>
                <View className='bg-white pb-4'>
                    <Text className="text-3xl font-semibold mt-5 text-center">ALUGUEQUADRAS LTDA</Text>

                    <View className=' px-4'>
                        <HorizontalLine margin={7} />
                    </View>
                    <Text className="text-3xl mt-1 text-center">R$80,00</Text>

                </View>

                <Text className='pl-4 text-xl font-semibold mt-12 color-gray-400'>Como você prefere pagar?</Text>

                <View className='bg-roxo rounded-2xl active:bg-roxo/80 m-4 h-20 '>
                    <IconUsuario image={`${bucketUrl}/public-storage/outros/qrcode.png`} style="w-14 h-14 rounded-full border-2 border-black" />
                    <Text className='text-white text-center text-xl font-bold'>Pagar com a minha conta</Text>

                </View>

                <BotaoPressable
                    title={'CARTÃO DE CRÉDITO'}
                    className='bg-roxo p-4 rounded-2xl active:bg-roxo/80 mx-4 mt-4'
                    classNameTitle='text-white text-center text-xl font-bold'
                    onPress={() => { }}
                />
                <BotaoPressable
                    title={'CARTÃO DE DÉBITO'}
                    className='bg-roxo p-4 rounded-2xl active:bg-roxo/80 mx-4 mt-4'
                    classNameTitle='text-white text-center text-xl font-bold'
                    onPress={() => { }}
                />
            </View>
            {loading && <Loading />}
        </SafeAreaView>
    );
}
