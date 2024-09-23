import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ExpandableTextProps {
    text: string;
    numberOfLines: number;
    numberOfChar: number;
}

export default function ExpandableText({ text, numberOfLines, numberOfChar }: ExpandableTextProps) {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const isTruncated = text.length > 100;

    return (
        <View>
            <Text className='text-lg' numberOfLines={expanded ? 0 : numberOfLines}>
                {expanded || !isTruncated ? text : text.slice(0, numberOfChar).trim() + '... '}

                {!expanded && isTruncated && (
                    <Text className='color-gray-400 font-bold' onPress={toggleExpand}>
                        Ver Mais
                    </Text>
                )}
            </Text>

            {expanded && (
                <TouchableOpacity onPress={toggleExpand}>
                    <Text className='color-gray-400 font-bold'>Ver Menos</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}