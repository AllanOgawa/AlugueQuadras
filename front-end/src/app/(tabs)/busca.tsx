import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Constants from 'expo-constants';
import ListaEstabelecimento from '@/src/components/listaEstabelecimento';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import ListaEstabelecimentoDetalhes from '@/src/components/listaEstabelecimentoDetalhes';
import ListaEstabelecimentoBusca from '@/src/components/listaEstabelecimentosBusca';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';
const statusBarHeight = Constants.statusBarHeight;

const Busca = () => {
    // Estados
    const [search, setSearch] = useState(''); // Termo de busca
    const [estabelecimentos, setEstabelecimentos] = useState([]); // Lista de todos os estabelecimentos
    const [filteredEstabelecimentos, setFilteredEstabelecimentos] = useState([]); // Lista filtrada
    const [loading, setLoading] = useState(false); // Indica se os dados estão carregando
    const [refreshing, setRefreshing] = useState(false); // Indica se a lista está sendo atualizada
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null); // Filtro selecionado

    // Função para buscar estabelecimentos da API
    const fetchEstabelecimentos = async () => {
        setLoading(true);
        try {
            const access_token = await AsyncStorage.getItem('access_token');
            const response = await fetch(`${apiUrl}/estabelecimento/list`, {
                headers: { Authorization: `Bearer ${access_token}` },
            });
            const data = await response.json();
            setEstabelecimentos(data);
            setFilteredEstabelecimentos(data);
        } catch (error) {
            console.error('Erro ao buscar estabelecimentos:', error);
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Não foi possível carregar os estabelecimentos.',
            });
        } finally {
            setLoading(false);
        }
    };

    // Função para buscar estabelecimentos filtrados
    const fetchFilteredEstabelecimentos = async (filterId: string) => {
        setLoading(true);
        try {
            const access_token = await AsyncStorage.getItem('access_token');
            const response = await fetch(`${apiUrl}/estabelecimento/tipo-esporte/${filterId}`, {
                headers: { Authorization: `Bearer ${access_token}` },
            });
            const data = await response.json();

            if (response.status !== 200 || !Array.isArray(data)) {
                Toast.show({
                    type: 'error',
                    text1: 'Erro',
                    text2: 'Nenhum estabelecimento encontrado para este filtro.',
                });
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

    // Filtro baseado no termo de busca
    useEffect(() => {
        const results = estabelecimentos.filter((estabelecimento) =>
            estabelecimento.nome.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredEstabelecimentos(results);
    }, [search, estabelecimentos]);

    // Atualização da lista ao puxar para baixo
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchEstabelecimentos().then(() => setRefreshing(false));
    }, []);

    // Carregar estabelecimentos na montagem do componente
    useEffect(() => {
        fetchEstabelecimentos();
    }, []);

    // Manipular clique em um estabelecimento
    const handleEstablishmentPress = (estabelecimento) => {
        console.log('Estabelecimento clicado:', estabelecimento);
    };

    return (
        <View style={styles.container}>
            <Header
                setSelectedFilter={setSelectedFilter}
                selectedFilter={selectedFilter}
                fetchFilteredEstabelecimentos={fetchFilteredEstabelecimentos}
            />
            <SearchBar search={search} setSearch={setSearch} />
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <ListaEstabelecimentoBusca
                    estabelecimentos={filteredEstabelecimentos}
                    onPress={handleEstablishmentPress}
                    loading={loading}
                />
            </ScrollView>
        </View>
    );
};

// Componente de Cabeçalho com filtros
const Header = ({ setSelectedFilter, selectedFilter, fetchFilteredEstabelecimentos }) => {
    const filters = [
        { id: '12', title: 'Beach Tennis' },
        { id: '3', title: 'Voleibol' },
        { id: '4', title: 'Tênis' },
        { id: '2', title: 'Futebol' },
    ];

    return (
        <View style={styles.header}>
            <MaterialIcons name="location-pin" size={20} color="#FF6600" />
            <Text style={styles.locationText}>Localização atual</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
                {filters.map((filter) => (
                    <FilterButton
                        key={filter.id}
                        title={filter.title}
                        id={filter.id}
                        setSelectedFilter={setSelectedFilter}
                        selectedFilter={selectedFilter}
                        fetchFilteredEstabelecimentos={fetchFilteredEstabelecimentos}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

// Botão de Filtro
const FilterButton = ({ title, id, setSelectedFilter, selectedFilter, fetchFilteredEstabelecimentos }) => {
    const isActive = selectedFilter === title;
    const backgroundColor = isActive ? '#FF6600' : '#B0B0B0';

    return (
        <TouchableOpacity
            style={[styles.filterButton, { backgroundColor }]}
            onPress={() => {
                const newFilter = selectedFilter === title ? null : title;
                setSelectedFilter(newFilter);
                if (newFilter) {
                    fetchFilteredEstabelecimentos(id);
                }
            }}
        >
            <Text style={styles.filterText}>{title}</Text>
        </TouchableOpacity>
    );
};

// Barra de Pesquisa
const SearchBar = ({ search, setSearch }) => (
    <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#666" style={styles.icon} />
        <TextInput
            style={styles.searchBar}
            placeholder="Buscar"
            value={search}
            onChangeText={setSearch}
        />
    </View>
);

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

export default Busca;
