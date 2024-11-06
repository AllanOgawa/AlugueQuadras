import React, { useState } from 'react';
import { View, Text, Modal, Image, Dimensions, TouchableOpacity, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { QuadraProps } from '@src/interfaces/quadra';
import HorizontalLine from './horizontalLine';
import Ionicons from '@expo/vector-icons/Ionicons';
import ImageQuadra from './image';

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
            <Text style={styles.title}>Quadras ({quadras.length})</Text>
            {quadras.length > 0 ? (
                quadras.map((quadra) => {
                    // Adicionando console.log para ver o objeto quadra completo
                    console.log('Objeto quadra:', quadra);

                    const imageUrl = quadra.imagens && quadra.imagens.length > 0 ? quadra.imagens[0].path : null;
                    console.log('Imagem da quadra:', imageUrl);

                    return (
                        <View key={quadra.idkey}>
                            <View style={styles.quadraContainer}>
                                <TouchableOpacity style={styles.imageContainer}>
                                    {imageUrl ? (
                                        <Pressable onPress={() => openModal(imageUrl)}>
                                            <ImageQuadra image={imageUrl} style={styles.quadraImage} />
                                        </Pressable>
                                    ) : (
                                        <View style={styles.noImageContainer}>
                                            <Text style={styles.noImageText}>Sem imagem</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                                <View style={styles.infoContainer}>
                                    <Pressable onPress={() => onClick(quadra)}>
                                        <View style={styles.textContainer}>
                                            <Text style={styles.quadraName} numberOfLines={2}>
                                                {quadra.nome}
                                            </Text>
                                            <Text style={styles.esportes} numberOfLines={2}>
                                                {quadra.tiposEsporte.map((esporte, index) => (
                                                    (index === 0 ? '' : ', ') + esporte.descricao
                                                ))}
                                            </Text>
                                        </View>
                                        <Text style={styles.valor} numberOfLines={1}>
                                            {quadra.valor ? `R$ ${quadra.valor}` : 'Valor não disponível'}
                                        </Text>
                                        <Text style={styles.dimensoes} numberOfLines={1}>
                                            Dimensões: {quadra.largura}m(L) x {quadra.comprimento}m(C)
                                        </Text>
                                        {quadra.informacoesAdicionais && (
                                            <Text style={styles.informacoesAdicionais} numberOfLines={2}>
                                                {quadra.informacoesAdicionais}
                                            </Text>
                                        )}
                                    </Pressable>
                                </View>
                            </View>
                            <HorizontalLine margin={14} />
                        </View>
                    );
                })
            ) : (
                <Text style={styles.noQuadraText}>Nenhuma quadra encontrada.</Text>
            )}

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
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
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 7,
    },
    quadraContainer: {
        flexDirection: 'row',
        width: '100%',
    },
    imageContainer: {
        width: 120,
        height: 120,
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quadraImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    noImageContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
        borderRadius: 10,
    },
    noImageText: {
        color: '#888',
        fontSize: 14,
    },
    infoContainer: {
        marginLeft: 10,
        flex: 1,
    },
    textContainer: {
        flex: 1,
    },
    quadraName: {
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 20,
    },
    esportes: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
        lineHeight: 18,
    },
    valor: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 4,
    },
    dimensoes: {
        fontSize: 14,
        color: '#666',
        lineHeight: 18,
    },
    informacoesAdicionais: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
        lineHeight: 18,
    },
    noQuadraText: {
        textAlign: 'center',
        color: 'gray',
        fontSize: 14,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        padding: 10,
    },
    fullscreenImage: {
        width: width,
        height: height * 0.8,
        resizeMode: 'contain',
    },
});

export default ListaQuadrasEstabelecimento;
