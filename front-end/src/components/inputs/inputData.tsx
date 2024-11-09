import React, { useState } from 'react';
import { SafeAreaView, TextInput, Text, TextInputProps, View, Platform, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { forwardRef } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons'; // Ícone de calendário

interface DateInputProps extends TextInputProps {
    label: string;
    obrigatorio?: boolean;
    errorMessage?: string;
    className?: string;
    onDateChange: (date: string) => void; // Callback para passar a data
}

const DateInput = forwardRef<TextInput, DateInputProps>(
    ({ className, label, obrigatorio = false, errorMessage, onDateChange, ...textInputProps }, ref) => {
        const [date, setDate] = useState<Date | undefined>(undefined);
        const [inputValue, setInputValue] = useState<string>(''); // Valor manualmente digitado
        const [showPicker, setShowPicker] = useState(false);

        const handleDateChange = (event: any, selectedDate?: Date) => {
            setShowPicker(false); // Esconde o picker após a seleção
            if (selectedDate) {
                setDate(selectedDate);
                const formattedDate = selectedDate.toLocaleDateString('pt-BR');
                setInputValue(formattedDate); // Atualiza o valor do TextInput
                onDateChange(formattedDate); // Passa a data formatada para o componente pai
            }
        };

        const handleInputChange = (text: string) => {
            let cleaned = text.replace(/\D/g, '');

            if (cleaned.length >= 5) {
                cleaned = cleaned.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');
            } else if (cleaned.length >= 3) {
                cleaned = cleaned.replace(/(\d{2})(\d{0,2})/, '$1/$2');
            }
            setInputValue(cleaned);
            onDateChange(cleaned);
        };

        return (
            <SafeAreaView className={`flex-col ${className}`}>
                <Text className='text-lg'>
                    {label} {obrigatorio && <Text className='color-red-500'>*</Text>}
                </Text>

                <SafeAreaView className={`h-14 border rounded-xl items-center flex-row justify-between ${errorMessage ? "border-red-500" : "border-secondary"}`}>
                    <TextInput
                        className='ml-3 text-lg w-[85%]'
                        ref={ref}
                        value={inputValue} // O valor é o que o usuário digitou ou selecionou
                        onChangeText={handleInputChange} // Permite editar manualmente
                        placeholder="dd/mm/aaaa" // Placeholder para o formato de data
                        keyboardType="numeric" // Teclado numérico para facilitar a inserção de datas
                        {...textInputProps}
                    />
                    <Pressable onPress={() => setShowPicker(true)}>
                        <Ionicons
                            name="calendar-outline"
                            size={24}
                            className='mr-3'
                            color="gray"
                        />
                    </Pressable>
                </SafeAreaView>

                {errorMessage && <Text className='color-red-600 text-sm'>{errorMessage}</Text>}

                {showPicker && (
                    <DateTimePicker
                        value={date || new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'inline' : 'default'}
                        onChange={handleDateChange}
                    />
                )}
            </SafeAreaView>
        );
    }
);

export default DateInput;
