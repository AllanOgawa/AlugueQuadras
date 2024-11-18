import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Pressable, Modal, Dimensions } from 'react-native';
import { EstabelecimentoProps } from '../interfaces/estabelecimento';
import Constants from 'expo-constants';
import HorizontalLine from './horizontalLine';
import { Ionicons } from '@expo/vector-icons';
import Loading from './loading';
import { QuadraProps } from '../interfaces/quadra';
import Estabelecimento from '../app/(estabelecimento)/detalhes';

const { width, height } = Dimensions.get('window');
const bucketUrl = Constants.expoConfig?.extra?.bucketUrl || '';

interface Props {
    estabelecimentos: EstabelecimentoProps[];
    onPress: (estabelecimento: EstabelecimentoProps) => void;
    loading: boolean;
    error?: string | null;
}

const ListaEstabelecimentoBusca: React.FC<Props> = ({ estabelecimentos, onPress, loading, error }) => {
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



    function formatarValorQuadras(quadras: QuadraProps[]): string {
        const valores = quadras.map(quadra => Number(quadra.valor));
        const menorValor = Math.min(...valores);
        const maiorValor = Math.max(...valores);

        if (menorValor === maiorValor) {
            return `R$ ${menorValor.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`;
        }
        return `R$ ${menorValor.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })} - R$ ${maiorValor.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    }

    function getTipoEsportes(quadras: QuadraProps[]): string {
        const allDescriptions = quadras.flatMap(quadra => quadra.tiposEsporte.map(esporte => esporte.descricao));
        const uniqueDescriptions = Array.from(new Set(allDescriptions)); // Remove repetições
        return uniqueDescriptions.join(', '); // Junta as descrições com vírgula e espaço
    }

    const renderEstabelecimento = (estabelecimento: EstabelecimentoProps) => (
        <View key={estabelecimento.idkey}>
            <Pressable onPress={() => onPress(estabelecimento)} className='flex flex-row w-full'>
                <TouchableOpacity className='w-32 h-[120] rounded-2xl justify-self-center' onPress={() => openModal(estabelecimento.imagens.length > 0 ? `${bucketUrl}/${estabelecimento.imagens[0].path}` : `${bucketUrl}/public-storage/outros/semImagem.jpg`)}>
                    {estabelecimento.imagens.length > 0 ? <Image
                        source={{ uri: `${bucketUrl}/${estabelecimento.imagens[0].path}` }}
                        className='w-[7.6rem] h-[7.6rem] rounded-2xl'
                    /> :
                        <Image
                            source={{ uri: `${bucketUrl}/public-storage/outros/semImagem.jpg` }}
                            className='w-[7.6rem] h-[7.6rem] rounded-2xl'
                        />
                    }
                </TouchableOpacity>
                <View className='ml-3 flex-1'>
                    <View className="flex-1">
                        <Text className='text-lg leading-5 font-bold' numberOfLines={2}>
                            {estabelecimento.nome}
                        </Text>
                        <Text className='text-base leading-4 mt-1 color-gray-600' numberOfLines={2}>
                            {estabelecimento.endereco.logradouro}, {estabelecimento.endereco.numero} - {estabelecimento.endereco.bairro}, {estabelecimento.endereco.cidade} - {(estabelecimento.endereco.estado).toLocaleUpperCase()}
                        </Text>
                    </View>
                    <View >
                        <Text className='text-lg font-bold' numberOfLines={2}>
                            {estabelecimento.quadras ? formatarValorQuadras(estabelecimento.quadras) : ""}
                        </Text>
                        <Text className='text-base leading-4 color-gray-600' numberOfLines={2}>
                            {estabelecimento.quadras ? getTipoEsportes(estabelecimento.quadras) : ""}
                        </Text>
                    </View>
                </View>
            </Pressable>
            <HorizontalLine margin={14} />
        </View>
    );

    return (
        <View className='p-4'>
            {estabelecimentos.length > 0 ? (
                estabelecimentos.map(item => renderEstabelecimento(item))
            ) : (
                <Text className='text-center color-gray-600 text-2xl mt-6'>Nenhum estabelecimento encontrado.</Text>
            )}
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
            {loading && <Loading />}
        </View>
    );
};

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

export default ListaEstabelecimentoBusca;