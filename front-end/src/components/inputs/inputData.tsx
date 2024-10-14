import React, { useState } from 'react';
import { View, Text, Button, Platform, SafeAreaView } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import BotaoPressable from '../botoes/botaoPressable';

interface DatePickerProps {
    label: string;
    mode?: 'date' | 'time' | 'datetime';
    onDateChange: (date: Date) => void;
    initialDate?: Date;
    obrigatorio?: boolean;
    errorMessage?: string;
    className?: string;
}

const InputData: React.FC<DatePickerProps> = ({
    label,
    mode = 'date',
    onDateChange,
    initialDate = new Date(),
    errorMessage,
    obrigatorio = false,
    className = "",
}) => {
    const [date, setDate] = useState<Date>(initialDate);
    const [show, setShow] = useState<boolean>(false);

    const showDatepicker = () => {
        setShow(true);
    };

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios'); // Para iOS, o DatePicker fica aberto
        setDate(currentDate);
        onDateChange(currentDate); // Chamando a função de callback passando a data selecionada
    };

    return (
        <SafeAreaView className={`flex-col ${className}`}>
            <Text className='text-lg'>
                {label} {obrigatorio && <Text className='color-red-500'>*</Text>}
            </Text>

            <View className='flex-row justify-between'>
                <View className={`w-[35%] h-14 rounded-xl border justify-center items-center  ${errorMessage ? "border-red-500" : "border-secondary"}`}>
                    <Text className='text-lg'>
                        {date.toLocaleDateString()}
                    </Text>
                </View>

                <BotaoPressable title={'Selecionar Data'} style={' h-14 bg-primary p-4 rounded-2xl active:bg-secondary w-[63%]'} onPress={showDatepicker} />
                {show && (
                    <DateTimePicker
                        value={date}
                        mode={mode}
                        display="default"
                        onChange={onChange}
                    />
                )}
            </View>

            {errorMessage && <Text className='color-red-600 text-sm'>{errorMessage}</Text>}
        </SafeAreaView>
    );
};

export default InputData;
