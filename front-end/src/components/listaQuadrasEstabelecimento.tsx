import { useState } from 'react';
import { View, Text, Modal, Image, Dimensions, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { QuadraProps } from '@src/interfaces/quadra';
import HorizontalLine from './horizontalLine';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

export default function ListaQuadrasEstabelecimento({ quadras, onClick }: { quadras: QuadraProps[], onClick: (quadra: QuadraProps) => void }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const openModal = (uri: string) => {
        setSelectedImage(uri);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedImage(null);
    };

    return (
        <View>
            <Text className='font-bold text-xl mb-7'>Quadras ({quadras.length})</Text>
            {quadras.map((quadra) => (
                <View key={quadra.id}>
                    <View className='flex flex-row w-full'>
                        <TouchableOpacity className='w-32 h-[120] rounded-2xl justify-self-center' onPress={() => openModal(quadra.image)}>
                            <Image
                                source={{ uri: quadra.image }}
                                className='w-[7.6rem] h-[7.6rem] rounded-2xl'
                            />
                        </TouchableOpacity>
                        <View className='ml-3 flex-1'>
                            <Pressable onPress={() => onClick(quadra)}>
                                <View className="flex-1">
                                    <Text className='text-lg leading-5 font-bold' numberOfLines={2}>
                                        {quadra.name}
                                    </Text>
                                    <Text className='text-sm leading-4 mt-1 color-gray-600' numberOfLines={2} >
                                        {quadra.esportes.map((esporte, index) => (
                                            (index == 0) ? esporte.name : `, ${esporte.name}`
                                        ))}
                                    </Text>
                                </View>
                                <Text className='text-lg leading-5' numberOfLines={1} >
                                    {quadra.valor}
                                </Text>
                                <Text className='text-sm leading-4 color-gray-600' numberOfLines={1} >
                                    Dimensões: {quadra.largura}m(L) x {quadra.comprimento}m(C)
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                    <HorizontalLine margin={14} />
                </View>
            ))}

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeModal}
            >
                <View className='flex-1 justify-center items-center bg-black/90'>
                    <Image source={{ uri: selectedImage ?? '' }} style={styles.fullscreenImage} />
                    <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                        <Ionicons name="close" size={40} color="white" />
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    fullscreenImage: {
        width: width,
        height: height * 0.8,
        resizeMode: 'contain',
    },
    closeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 10,
        borderRadius: 16,
    },
});
