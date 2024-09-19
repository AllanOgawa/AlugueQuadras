import { View, Image } from 'react-native';

interface UserIconProps {
	image: string;
	style?: string; // Parâmetro opcional para a classe de estilo
}

export default function IconUsuario({ image, style }: UserIconProps) {
	return (
		<View className='flex-col items-center justify-center mb-4'>
			<Image
				className={`${style}`} // Adiciona a classe de estilo aqui
				source={{ uri: image }}
			/>
		</View>
	);
}

