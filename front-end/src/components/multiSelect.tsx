import { Pressable, Text, View, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

export interface Option {
    idkey: number;
    descricao: string;
    icone?: string;
}

export interface MultiSelectProps {
    opcoes: Option[];
    initialSelected: number[];
    onSelectionChange: (toAdd: number[], toRemove: number[]) => void;
    max: number;
}

export default function MultiSelect({ opcoes, initialSelected, max, onSelectionChange }: MultiSelectProps) {
    const [selectedOptions, setSelectedOptions] = useState<number[]>(initialSelected);

    useEffect(() => {
        setSelectedOptions(initialSelected);
    }, [initialSelected]);

    useEffect(() => {
        const toAdd = selectedOptions.filter(idkey => !initialSelected.includes(idkey));
        const toRemove = initialSelected.filter(idkey => !selectedOptions.includes(idkey));
        onSelectionChange(toAdd, toRemove);
    }, [selectedOptions]);

    const toggleOption = (optionId: number) => {
        setSelectedOptions((prevSelected) => {
            if (prevSelected.includes(optionId)) {
                return prevSelected.filter(idkey => idkey !== optionId);
            } else {
                if (prevSelected.length < max) {
                    return [...prevSelected, optionId];
                } else {
                    Alert.alert(`Limite de ${max} opções atingido`);
                    return prevSelected;
                }
            }
        });
    };

    return (
        <View style={{ gap: 14, paddingRight: 16, marginTop: 16 }}>
            {opcoes.map((item) => (
                <Pressable
                    key={item.idkey}
                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, paddingHorizontal: 12 }}
                    onPress={() => toggleOption(item.idkey)}
                >
                    <MaterialIcons
                        name={selectedOptions.includes(item.idkey) ? 'check-box' : 'check-box-outline-blank'}
                        size={24}
                        color={Colors.secondary}
                    />
                    <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: 'normal' }} numberOfLines={1}>
                        {item.descricao}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}
