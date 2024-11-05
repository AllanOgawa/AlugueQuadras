import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { EstabelecimentoProps } from '../interfaces/estabelecimento';
import { MaterialIcons } from '@expo/vector-icons';

interface Props {
    data: EstabelecimentoProps[];
    onPress: (estabelecimento: EstabelecimentoProps) => void;
}

const ListaEstabelecimento: React.FC<Props> = ({ data, onPress }) => {

    const renderAcomodacoes = (acomodacoes: any[]) => {
        if (!acomodacoes || acomodacoes.length === 0) return null;

        return (
            <View>
                <View style={styles.iconsContainer}>
                    {acomodacoes.map((acomodacao, index) => (
                        acomodacao.icon ? ( // Verifique se o ícone existe
                            <MaterialIcons
                                key={index}
                                name={acomodacao.icon}
                                size={20}
                                color="#FF6600"
                                style={styles.icon}
                            />
                        ) : null // Não renderiza nada se o ícone não existir
                    ))}
                </View>
            </View>
        );
    };

    const renderEstabelecimento = (item: EstabelecimentoProps) => (
        <TouchableOpacity style={styles.card} onPress={() => onPress(item)} key={item.id}>
            {item.image && item.image.length > 0 && (
                <Image source={{ uri: item.image[0].image }} style={styles.image} />
            )}
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.endereco}>{item.endereco}</Text>
                <Text style={styles.avaliacao}>Avaliação: {item.avaliacao.toFixed(1)} ⭐</Text>
                <Text style={styles.preco}>{item.horario[0].valor}</Text>
                {renderAcomodacoes(item.acomodacoes)}
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
    acomodacoes: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    iconsContainer: {
        flexDirection: 'row',
        marginTop: 8,
    },
    icon: {
        justifyContent: 'space-between',
        marginRight: 10,
    },
    preco: {
        fontWeight: 'bold'
    }
});

export default ListaEstabelecimento;
