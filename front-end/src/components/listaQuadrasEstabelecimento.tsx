import React, { useState } from 'react';
import { View, Text, Modal, Image, Dimensions, TouchableOpacity, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { QuadraProps } from '@src/interfaces/quadra';
import HorizontalLine from './horizontalLine';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

interface ListaQuadrasEstabelecimentoProps {
    quadras: QuadraProps[];
    onClick: (quadra: QuadraProps) => void;
    loading: boolean;
    error?: string | null;
}

const ListaQuadrasEstabelecimento: React.FC<ListaQuadrasEstabelecimentoProps> = ({ quadras, onClick, loading, error }) => {
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

    if (loading) {
        return <ActivityIndicator size="large" color="#FF6600" />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <View>
            <Text className='font-bold text-xl mb-7'>Quadras ({quadras.length})</Text>
            {quadras.length > 0 ? (
                quadras.map((quadra) => (
                    <View key={quadra.idkey}>
                        <View className='flex flex-row w-full'>
                            <TouchableOpacity className='w-32 h-[120] rounded-2xl justify-self-center'>
                                {/* Renderização da imagem da quadra */}
                                {quadra.imagens && quadra.imagens.length > 0 && (
                                    <Pressable onPress={() => openModal(quadra.imagens[0].path)}>
                                        <Image source={{ uri: quadra.imagens[0].path }} style={styles.quadraImage} />
                                    </Pressable>
                                )}
                            </TouchableOpacity>
                            <View className='ml-3 flex-1'>
                                <Pressable onPress={() => onClick(quadra)}>
                                    <View className="flex-1">
                                        <Text className='text-lg leading-5 font-bold' numberOfLines={2}>
                                            {quadra.nome}
                                        </Text>
                                        <Text className='text-sm leading-4 mt-1 color-gray-600' numberOfLines={2}>
                                            {quadra.tiposEsporte.map((esporte, index) => (
                                                (index === 0 ? '' : ', ') + esporte.descricao
                                            ))}
                                        </Text>
                                    </View>
                                    <Text className='text-lg leading-5' numberOfLines={1}>
                                        {quadra.valor ? `R$ ${quadra.valor}` : 'Valor não disponível'}
                                    </Text>
                                    <Text className='text-sm leading-4 color-gray-600' numberOfLines={1}>
                                        Dimensões: {quadra.largura}m(L) x {quadra.comprimento}m(C)
                                    </Text>
                                    {quadra.informacoesAdicionais && (
                                        <Text className='text-sm leading-4 color-gray-600 mt-1' numberOfLines={2}>
                                            {quadra.informacoesAdicionais}
                                        </Text>
                                    )}
                                </Pressable>
                            </View>
                        </View>
                        <HorizontalLine margin={14} />
                    </View>
                ))
            ) : (
                <Text>Nenhuma quadra encontrada.</Text>
            )}

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeModal}
            >
                <View className='flex-1 justify-center items-center bg-black/90'>
                    <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                        <Ionicons name="close" size={40} color="white" />
                    </TouchableOpacity>
                    {selectedImage && <Image source={{ uri: selectedImage }} style={styles.fullscreenImage} />}
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    quadraImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
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

export default ListaQuadrasEstabelecimento;
