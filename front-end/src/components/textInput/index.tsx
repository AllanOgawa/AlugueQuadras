import React from 'react';
import { SafeAreaView, StyleSheet, TextInput, Text } from 'react-native';

type keyboardType =
    | 'numbers-and-punctuation'
    | 'default'
    | 'ascii-capable'
    | 'email-address'

interface TextInputProps {
    title: string;
    hint: string;
}

export default function TextInputExample({ title, hint }: TextInputProps) {
    const [text, onChangeText] = React.useState('');

    return (
        <SafeAreaView className='flex-col'>
            <Text className='top-3 ml-3 text-xl'>{title}</Text>
            <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                value={text}
                placeholder={hint}
                keyboardType='default'
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 13,
        borderWidth: 1,
        padding: 10,
        borderColor: "#FF7300",
        tintColor: "##9399a3",
        borderRadius: 15
    },
});