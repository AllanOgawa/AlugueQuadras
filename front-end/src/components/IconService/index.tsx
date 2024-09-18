import { FlatList, Pressable, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

export interface Option {
	id: string;
	label: string;
}

export interface MultiSelectProps {
	options: Option[];
	onSelectionChange: (selected: string[]) => void;
}

export default function MultiSelect({ options, onSelectionChange }: MultiSelectProps) {
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

	useEffect(() => {
		onSelectionChange(selectedOptions);
	}, [selectedOptions]);

	const toggleOption = (optionId: string) => {
		const newSelectedOptions = selectedOptions.includes(optionId)
			? selectedOptions.filter(id => id !== optionId)
			: [...selectedOptions, optionId];

		setSelectedOptions(newSelectedOptions);
	};

	const renderItem = ({ item }: { item: Option }) => (
		<Pressable
			className="flex flex-row items-center justify-start mb-4"
			onPress={() => toggleOption(item.id)}
		>
			<MaterialIcons
				name={selectedOptions.includes(item.id) ? 'check-box' : 'check-box-outline-blank'}
				size={24}
				color="#828282"
			/>
			<Text
				className="ml-2 text-lg font-medium text-black"
				numberOfLines={1}
			>
				{item.label}
			</Text>
		</Pressable>
	);

	return (
		<FlatList
			data={options}
			renderItem={renderItem}
			horizontal={true}
			keyExtractor={(item) => item.id}
			contentContainerStyle={{ gap: 14, paddingRight: 16, marginTop: 16 }}
			showsVerticalScrollIndicator={false}
		/>
	);
}
