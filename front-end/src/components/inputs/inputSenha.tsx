import { MaterialIcons } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import { SafeAreaView, TextInput, Text, TextInputProps, TouchableOpacity } from 'react-native';

interface InputSenhaProps extends TextInputProps {
    label: string;
    obrigatorio?: boolean;
    errorMessage?: string;
    className?: string;
}

const InputSenha = forwardRef<TextInput, InputSenhaProps>(
    ({ className, label, obrigatorio = false, errorMessage, ...textInputProps }, ref) => {
        const [isPasswordVisible, setPasswordVisible] = useState(false);

        return (
            <SafeAreaView className={`flex-col ${className}`}>
                <Text className='text-lg'>
                    {label} {obrigatorio && <Text className='color-red-600'>*</Text>}
                </Text>
                <SafeAreaView className={`h-14 border rounded-xl items-center flex-row justify-between ${errorMessage ? "border-red-500" : "border-secondary"}`}>
                    <TextInput
                        className='ml-3 text-lg w-[85%]'
                        ref={ref}
                        secureTextEntry={!isPasswordVisible}
                        {...textInputProps}
                    />
                    <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)}>
                        <MaterialIcons
                            name={isPasswordVisible ? 'visibility-off' : 'visibility'}
                            size={24}
                            className='mr-3'
                            color="gray"
                        />
                    </TouchableOpacity>
                </SafeAreaView>

                {errorMessage && <Text className='color-red-600 text-sm'>{errorMessage}</Text>}
            </SafeAreaView>
        );
    }
);

export default InputSenha;