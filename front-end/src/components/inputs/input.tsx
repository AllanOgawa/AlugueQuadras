import { forwardRef } from 'react';
import { SafeAreaView, TextInput, Text, TextInputProps } from 'react-native';


interface InputProps extends TextInputProps {
    label: string;
    obrigatorio?: boolean;
    errorMessage?: string;
    className?: string;
}

const Input = forwardRef<TextInput, InputProps>(
    ({ className, label, obrigatorio = false, errorMessage, ...textInputProps }, ref) => {

        return (
            <SafeAreaView className={`flex-col ${className}`}>
                <Text className='text-lg'>
                    {label} {obrigatorio && <Text className='color-red-500'>*</Text>}
                </Text>
                <TextInput
                    className={`h-14 rounded-xl border pl-3 text-lg ${errorMessage ? "border-red-500" : "border-secondary"}`}
                    ref={ref}
                    {...textInputProps}
                />

                {errorMessage && <Text className='color-red-600 text-sm'>{errorMessage}</Text>}
            </SafeAreaView>
        );
    }
);

export default Input;