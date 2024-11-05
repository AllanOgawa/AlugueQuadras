import { Pressable, Text, View } from 'react-native';
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

	return (
		<View style={{ gap: 14, paddingRight: 16, marginTop: 16 }}>
			{options.map((item) => (
				<Pressable
					key={item.id}
					className="flex flex-row items-center justify-start mb-4"
					onPress={() => toggleOption(item.id)}
				>
					<MaterialIcons
						name={selectedOptions.includes(item.id) ? 'check-box' : 'check-box-outline-blank'}
						size={24}
						color="#828282"
					/>
					<Text
						className="ml-2 text-lg font-normal"
						numberOfLines={1}
					>
						{item.label}
					</Text>
				</Pressable>
			))}
		</View>
	);
}
