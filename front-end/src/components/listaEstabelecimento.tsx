import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { EstabelecimentoProps } from '../interfaces/estabelecimento';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';  // Para navegação

const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';

interface RenderOptions {
    showImage?: boolean;
    showAvaliacao?: boolean;
    showPreco?: boolean;
    showAcomodacoes?: boolean;
}

interface Props {
    options?: RenderOptions;
}

const ListaEstabelecimento: React.FC<Props> = ({ options = {} }) => {
    const [data, setData] = useState<EstabelecimentoProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const navigation = useNavigation(); // Hook para navegação

    useEffect(() => {
        const fetchEstabelecimentos = async () => {
            try {
                const access_token = await AsyncStorage.getItem('access_token');
                const response = await fetch(`${apiUrl}/estabelecimento/usuario`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Erro ao buscar os dados.');
                }

                const jsonData = await response.json();
                setData(jsonData);
                setLoading(false);
            } catch (err) {
                console.log(err);
                setError('Erro ao carregar os dados.');
                setLoading(false);
            }
        };

        fetchEstabelecimentos();
    }, []);

    const handlePress = async (item: EstabelecimentoProps) => {
        try {
            // Salva o id do estabelecimento no AsyncStorage
            await AsyncStorage.setItem('idEstabelecimento', item.idkey.toString());
            console.log('Id do estabelecimento salvo com sucesso.');
        } catch (error) {
            console.error('Erro ao salvar o id do estabelecimento:', error);
        }
    };

    const renderEstabelecimento = (item: EstabelecimentoProps) => (
        <TouchableOpacity style={styles.card} onPress={() => handlePress(item)} key={item.idkey}>
            {options.showImage && item.imagens && item.imagens.length > 0 && (
                <Image source={{ uri: `${apiUrl}/${item.imagens[0].path}` }} style={styles.image} />
            )}
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.nome}</Text>
                <Text style={styles.endereco}>
                    {item.endereco.logradouro}, {item.endereco.numero} - {item.endereco.bairro}, {item.endereco.cidade} - {item.endereco.estado}
                </Text>
                {options.showAvaliacao && (
                    <Text style={styles.avaliacao}>Avaliação: N/A</Text>
                )}
                {options.showPreco && (
                    <Text style={styles.preco}>Preço: N/A</Text>
                )}
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#FF6600" />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

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
    preco: {
        fontWeight: 'bold',
    },
});

export default ListaEstabelecimento;