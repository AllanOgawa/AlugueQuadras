import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { EstabelecimentoProps } from '../interfaces/estabelecimento';

interface Props {
    estabelecimentos: EstabelecimentoProps[];  // Lista de estabelecimentos
    onPress: (estabelecimento: EstabelecimentoProps) => void;  // Função para lidar com o clique
    loading: boolean;  // Indica se está carregando
    error?: string | null;  // Mensagem de erro opcional
}

const ListaEstabelecimento: React.FC<Props> = ({ estabelecimentos, onPress, loading, error }) => {
    // Renderiza um estabelecimento individual
    const renderEstabelecimento = (item: EstabelecimentoProps) => (
        <TouchableOpacity style={styles.card} onPress={() => onPress(item)} key={item.idkey}>
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.nome}</Text>
                <Text style={styles.endereco}>
                    {item.endereco.logradouro}, {item.endereco.numero} - {item.endereco.bairro}, {item.endereco.cidade} - {item.endereco.estado}
                </Text>
            </View>
        </TouchableOpacity>
    );

    // Exibe o indicador de carregamento se `loading` for verdadeiro
    if (loading) {
        return <ActivityIndicator size="large" color="#FF6600" />;
    }

    // Exibe uma mensagem de erro, se houver
    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <View>
            {estabelecimentos.length > 0 ? (
                estabelecimentos.map(item => renderEstabelecimento(item))
            ) : (
                <Text style={styles.emptyText}>Nenhum estabelecimento encontrado.</Text>
            )}
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
    emptyText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
        marginTop: 20,
    },
});

export default ListaEstabelecimento;
