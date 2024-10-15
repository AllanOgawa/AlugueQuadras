import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { EstabelecimentoProps } from '../interfaces/estabelecimento';

interface Props {
    data: EstabelecimentoProps[];
    onPress: (estabelecimento: EstabelecimentoProps) => void; // Adicionando onPress como propriedade
}

const ListaEstabelecimento: React.FC<Props> = ({ data, onPress }) => {
    // Renderiza cada estabelecimento da lista
    const renderEstabelecimento = ({ item }: { item: EstabelecimentoProps }) => (
        <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.endereco}>{item.endereco}</Text>
            <Text style={styles.avaliacao}>Avaliação: {item.avaliacao.toFixed(1)} ⭐</Text>
            <FlatList
                data={item.image}
                horizontal
                keyExtractor={(image) => image.id}
                renderItem={({ item: img }) => (
                    <Image source={{ uri: img.image }} style={styles.image} />
                )}
                showsHorizontalScrollIndicator={false}
            />
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderEstabelecimento}
            contentContainerStyle={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        marginHorizontal: 5,
        elevation: 3,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    endereco: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    avaliacao: {
        fontSize: 14,
        marginBottom: 12,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 8,
    },
});

export default ListaEstabelecimento;
