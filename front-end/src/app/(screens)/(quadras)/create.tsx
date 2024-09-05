import ArrowBack from '@/src/components/arrowBack';
import CustomButton from '@/src/components/buttom';
import TextInputExample from '@/src/components/textInput';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';

export default function NewCourt() {

    return (
        <SafeAreaView>
            <ScrollView>
                <View>
                    <Text className='text-4xl font-semibold ml-2 mt-4'>Registar Local</Text>
                    <Text className='text-3xl font-medium ml-3 mt-5'>Informações Gerais</Text>
                    <TextInputExample
                        title={'CNPJ'}
                        hint={'Ex: CNPJ'}
                    />
                    <TextInputExample
                        title='Nome do responsável'
                        hint={'Ex: Nome do Responsável'}
                    />
                    <TextInputExample
                        title='Telefone para contato'
                        hint={'(99) 99999-9999'}
                    />
                    <TextInputExample
                        title='Nome do local'
                        hint={'Ex: Quadra legal'}
                    />

                    <View className='mx-4 mt-2'>
                        <Text className='text-xl'>Registro de funcionamento (Alvará)</Text>
                        <View className='bg-gray-500 rounded-xl items-center py-4 mt-4'>
                            <Text className='text-white font-bold'>Upload</Text>
                        </View>
                    </View>

                    <View className='bg-gray-400 rounded-xl justify-center items-center mx-10 py-4 mt-4 flex-row'>
                        <MaterialIcons name='upload' size={20} className='px-2' />
                        <Text className='text-white font-bold'>Alvara.pdf</Text>
                    </View>
                </View>
            </ScrollView>

            <CustomButton title={'Proximo'} onPress={() => router.push('/notification')} style={'bg-orange-500 p-4 rounded-2xl active:bg-orange-400 mx-4 mt-10'} />
        </SafeAreaView>
    );
}
