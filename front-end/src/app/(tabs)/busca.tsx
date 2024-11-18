import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Constants from 'expo-constants';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import ListaEstabelecimentoBusca from '@/src/components/listaEstabelecimentoBusca';
import { EstabelecimentoProps } from '@/src/interfaces/estabelecimento';
import { router, useLocalSearchParams } from 'expo-router';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';
const statusBarHeight = Constants.statusBarHeight;

export default function Busca() {
    const { tipoEsporteSelecionado } = useLocalSearchParams();
    const [search, setSearch] = useState('');
    const [estabelecimentos, setEstabelecimentos] = useState<EstabelecimentoProps[]>([]);
    const [filteredEstabelecimentos, setFilteredEstabelecimentos] = useState<EstabelecimentoProps[]>([]);
    const [tipoEsportes, setTipoEsportes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

    async function fetchEstabelecimentos() {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/estabelecimento/list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setEstabelecimentos(data);
            setFilteredEstabelecimentos(data);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Não foi possível carregar os estabelecimentos.',
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchFilteredEstabelecimentos = async (filterId: number) => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/estabelecimento/tipo-esporte/${filterId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json();

            if (response.status !== 200 || !Array.isArray(data)) {
                setFilteredEstabelecimentos([]);
            } else {
                setFilteredEstabelecimentos(data);
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Ocorreu um erro inesperado.',
            });
        } finally {
            setLoading(false);
        }
    };

    async function fetchTipoEsportes() {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/estabelecimento/quadra/tipo-esporte/list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            setTipoEsportes(data);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Não foi possível carregar os estabelecimentos.',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const results = estabelecimentos.filter((estabelecimento) =>
            estabelecimento.nome.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredEstabelecimentos(results);
    }, [search, estabelecimentos]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchEstabelecimentos().then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        if (typeof tipoEsporteSelecionado == "string") {
            fetchFilteredEstabelecimentos(JSON.parse(tipoEsporteSelecionado).idkey);
            setSelectedFilter(JSON.parse(tipoEsporteSelecionado).descricao);
        } else {
            setSelectedFilter(null);
            setFilteredEstabelecimentos(estabelecimentos);
        }
    }, [tipoEsporteSelecionado]);

    useEffect(() => {
        fetchEstabelecimentos();
        fetchTipoEsportes();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <MaterialIcons name="location-pin" size={20} color="#FF6600" />
                <Text style={styles.locationText}>Localização atual</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
                    {tipoEsportes.map((filter) => {
                        const isActive = selectedFilter === filter.descricao;
                        const backgroundColor = isActive ? '#FF6600' : '#B0B0B0';
                        return (
                            <TouchableOpacity
                                key={filter.idkey}
                                style={[styles.filterButton, { backgroundColor }]}
                                onPress={() => {
                                    const newFilter = selectedFilter === filter.descricao ? null : filter.descricao;
                                    setSelectedFilter(newFilter);
                                    if (newFilter) {
                                        fetchFilteredEstabelecimentos(filter.idkey);
                                    }
                                    if (newFilter == null) {
                                        setFilteredEstabelecimentos(estabelecimentos);
                                    }
                                }}
                            >
                                <Text style={styles.filterText}>{filter.descricao}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
            <View style={styles.searchContainer}>
                <MaterialIcons name="search" size={20} color="#666" style={styles.icon} />
                <TextInput
                    style={styles.searchBar}
                    placeholder="Buscar"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <ListaEstabelecimentoBusca
                    estabelecimentos={filteredEstabelecimentos}
                    loading={loading}
                    onPress={(estabelecimento) => router.navigate({
                        pathname: '/(estabelecimento)/detalhes',
                        params: { idEstabelecimento: estabelecimento.idkey }
                    })}
                />
            </ScrollView>
        </View>
    );
};

// Estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: statusBarHeight + 10,
    },
    locationText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    filterButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
    },
    filterText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 20,
        marginHorizontal: 16,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    searchBar: {
        flex: 1,
        height: 40,
        paddingLeft: 10,
    },
    icon: {
        marginRight: 10,
    },
});
