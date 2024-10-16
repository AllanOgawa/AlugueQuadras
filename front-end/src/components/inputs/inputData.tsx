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
            // Permite que o usuário digite manualmente a data
            let cleaned = text.replace(/\D/g, '');

            // Formata o texto no padrão dd/mm/aaaa
            if (cleaned.length >= 5) {
                cleaned = cleaned.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');
            } else if (cleaned.length >= 3) {
                cleaned = cleaned.replace(/(\d{2})(\d{0,2})/, '$1/$2');
            }

            setInputValue(cleaned);
            onDateChange(cleaned); // Passa o valor manualmente inserido para o componente pai
        };

        return (
            <SafeAreaView className={`flex-col ${className}`}>
                <Text className='text-lg'>
                    {label} {obrigatorio && <Text className='color-red-500'>*</Text>}
                </Text>
                <View className='flex-row items-center'>
                    <TextInput
                        className={`flex-1 h-14 rounded-xl border pl-3 text-lg ${errorMessage ? "border-red-500" : "border-secondary"}`}
                        ref={ref}
                        value={inputValue} // O valor é o que o usuário digitou ou selecionou
                        onChangeText={handleInputChange} // Permite editar manualmente
                        placeholder="dd/mm/aaaa" // Placeholder para o formato de data
                        keyboardType="numeric" // Teclado numérico para facilitar a inserção de datas
                        {...textInputProps}
                    />
                    <Pressable onPress={() => setShowPicker(true)} className='ml-2 p-2'>
                        <Ionicons name="calendar-outline" size={24} color="black" />
                    </Pressable>
                </View>

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
