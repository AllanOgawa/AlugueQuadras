import TextInputExample from '@/src/components/textInput';
import { View, Text } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

export default function NewCourt() {
    return (
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
        </View>
    );
}
