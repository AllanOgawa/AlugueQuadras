import { View, Image } from 'react-native';

export interface UserIconProps {
	image: string;
}

export default function UserIcon({ image }: UserIconProps) {
	return (
		<View className='flex-col items-center justify-center mb-4'>
			<Image
				className='w-24 h-24 rounded-full border-2 border-black'
				source={{ uri: image }}
			/>
		</View>
	);
}

