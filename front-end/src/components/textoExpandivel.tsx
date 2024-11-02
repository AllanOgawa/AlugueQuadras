import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface TextoExpandivelProps {
    className: string;
    text: string;
    numberOfLines: number;
    numberOfChar: number;
}

export default function TextoExpandivel({ className, text, numberOfLines, numberOfChar }: TextoExpandivelProps) {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const isTruncated = text.length > 100;

    return (
        <View>
            <Text className={className} numberOfLines={expanded ? 0 : numberOfLines}>
                {expanded || !isTruncated ? text : text.slice(0, numberOfChar).trim() + '... '}

                {!expanded && isTruncated && (
                    <Text className={`color-secondary font-bold ${className}`} onPress={toggleExpand}>
                        Ver Mais
                    </Text>
                )}
            </Text>

            {expanded && (
                <TouchableOpacity onPress={toggleExpand}>
                    <Text className={`color-secondary font-bold ${className}`} >Ver Menos</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}