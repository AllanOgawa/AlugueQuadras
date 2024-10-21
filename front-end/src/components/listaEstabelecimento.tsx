import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { EstabelecimentoProps } from '../interfaces/estabelecimento';
import { MaterialIcons } from '@expo/vector-icons';

interface RenderOptions {
    showImage?: boolean;
    showAvaliacao?: boolean;
    showPreco?: boolean;
    showAcomodacoes?: boolean;
}

interface Props {
    data: EstabelecimentoProps[];
    onPress: (estabelecimento: EstabelecimentoProps) => void;
    options?: RenderOptions; // Nova prop para definir o que exibir
}

const ListaEstabelecimento: React.FC<Props> = ({ data, onPress, options = {} }) => {

    const renderAcomodacoes = (acomodacoes: any[]) => {
        if (!acomodacoes || acomodacoes.length === 0) return null;

        return (
            <View style={styles.acomodacoesContainer}>
                {acomodacoes.map((acomodacao, index) => (
                    <View key={index} style={styles.acomodacaoItem}>
                        {acomodacao.icon && (
                            <MaterialIcons
                                name={acomodacao.icon}
                                size={20}
                                color="#FF6600"
                                style={styles.icon}
                            />
                        )}
                        <Text style={styles.acomodacaoText}>{acomodacao.name}</Text>
                    </View>
                ))}
            </View>
        );
    };

    const renderEstabelecimento = (item: EstabelecimentoProps) => (
        <TouchableOpacity style={styles.card} onPress={() => onPress(item)} key={item.id}>
            {options.showImage && item.image && item.image.length > 0 && (
                <Image source={{ uri: item.image[0].image }} style={styles.image} />
            )}
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.endereco}>{item.endereco}</Text>
                {options.showAvaliacao && (
                    <Text style={styles.avaliacao}>Avaliação: {item.avaliacao.toFixed(1)} ⭐</Text>
                )}
                {options.showPreco && (
                    <Text style={styles.preco}>{item.horario[0].valor}</Text>
                )}
                {options.showAcomodacoes && renderAcomodacoes(item.acomodacoes)}
            </View>
        </TouchableOpacity>
    );

    return (
        <View>
            {data.map(item => renderEstabelecimento(item))}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        flexDirection: 'row',
        padding: 16,
        marginBottom: 16,
        marginHorizontal: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginRight: 16,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF6600',
        marginBottom: 8,
    },
    endereco: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    avaliacao: {
        fontSize: 14,
        marginBottom: 12,
    },
    acomodacoesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    acomodacaoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    icon: {
        marginTop: 2,
        marginRight: 2,
    },
    acomodacaoText: {
        fontSize: 12,
        color: '#666',
    },
    preco: {
        fontWeight: 'bold',
    },
});

export default ListaEstabelecimento;
