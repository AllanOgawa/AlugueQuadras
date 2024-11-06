import { View, Image } from 'react-native';

interface ImageProps {
    image: string;
    style?: string; // Parâmetro opcional para a classe de estilo
}

export default function ImageShow({ image, style }: ImageProps) {
    console.log('Imagem da quadra:', image);
    return (
        <View className='flex-col items-center justify-center'>
            <Image
                className={`${style}`} // Adiciona a classe de estilo aqui
                source={{ uri: image }}
            />
        </View>
    );
}

