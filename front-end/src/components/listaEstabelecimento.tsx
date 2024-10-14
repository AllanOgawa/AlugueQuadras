import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';

interface Estabelecimento {
    id: string;
    name: string;
    endereco: string;
    avaliacao: number;
    image: { id: string; name: string; image: string }[];
}

interface Props {
    data: Estabelecimento[];
}

const ListaEstabelecimento: React.FC<Props> = ({ data }) => {
    // Renderiza cada estabelecimento da lista
    const renderEstabelecimento = ({ item }: { item: Estabelecimento }) => (
        <View style={styles.card}>
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
        </View>
    );

    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item.id}
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