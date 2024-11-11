import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface CheckboxProps {
    label: string;
    value: boolean;
    onValueChange: (newValue: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, value, onValueChange }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onValueChange(!value)}
            activeOpacity={0.7}
        >
            <View style={[styles.checkbox, value && styles.checked]}>
                {value && <MaterialIcons name="check" size={20} color="#fff" />}
            </View>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: Colors.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    checked: {
        backgroundColor: Colors.secondary,
    },
    label: {
        fontSize: 16,
        color: '#333',
    },
});

export default Checkbox;
