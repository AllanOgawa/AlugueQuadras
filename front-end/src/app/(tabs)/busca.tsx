import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Constants from 'expo-constants';
import ListaEstabelecimento from '@/src/components/listaEstabelecimento';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';
const statusBarHeight = Constants.statusBarHeight;

export default function Busca() {
    const [search, setSearch] = useState('');
    const [estabelecimentos, setEstabelecimentos] = useState([]);
    const [filteredEstabelecimentos, setFilteredEstabelecimentos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

    // Função para buscar todos os estabelecimentos
    const fetchEstabelecimentos = async () => {
        setLoading(true);
        try {
            const access_token = await AsyncStorage.getItem('access_token');
            const response = await fetch(`${apiUrl}/estabelecimento/usuario`, {
                headers: { 'Authorization': `Bearer ${access_token}` },
            });
            const data = await response.json();
            setEstabelecimentos(data);
            setFilteredEstabelecimentos(data);
        } catch (error) {
            console.error('Erro ao buscar estabelecimentos:', error);
        } finally {
            setLoading(false);
        }
    };

    // Atualiza os resultados conforme a pesquisa ou filtro
    useEffect(() => {
        const results = estabelecimentos.filter((estabelecimento) =>
            estabelecimento.nome.toLowerCase().includes(search.toLowerCase()) &&
            (!selectedFilter || estabelecimento.tipo.includes(selectedFilter))
        );
        setFilteredEstabelecimentos(results);
    }, [search, selectedFilter, estabelecimentos]);

    // Função para puxar e atualizar ao arrastar para baixo
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchEstabelecimentos().then(() => setRefreshing(false));
    }, []);

    // Carregar estabelecimentos na montagem do componente
    useEffect(() => {
        fetchEstabelecimentos();
    }, []);

    const handleEstablishmentPress = (estabelecimento) => {
        console.log('clicado', estabelecimento);
    };

    return (
        <View style={styles.container}>
            <Header />
            <SearchBar search={search} setSearch={setSearch} />
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                <ListaEstabelecimento
                    estabelecimentos={filteredEstabelecimentos}
                    onPress={handleEstablishmentPress}
                    loading={loading}
                />
            </ScrollView>
        </View>
    );
}

function setSelectedFilter(arg0: (prev: any) => string | null): void {
    Toast.show({
        type: 'error',
        text1: 'Função não implementada',
        text2: 'Erro ao selecionar filtro',
        swipeable: true,
        visibilityTime: 1000,
    });
}

const Header = () => (
    <View style={styles.header}>
        <MaterialIcons name='location-pin' size={20} color="#FF6600" />
        <Text style={styles.locationText}> Localização atual</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
            {['Beach Tennis', 'Voleibol', 'Tênis', 'Coberto'].map((filter) => (
                <FilterButton key={filter} title={filter} />
            ))}
        </ScrollView>
    </View>
);

const FilterButton: React.FC<{ title: string }> = ({ title }) => (
    <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setSelectedFilter((prev) => (prev === title ? null : title))}
    >
        <Text style={styles.filterText}>{title}</Text>
    </TouchableOpacity>
);

const SearchBar: React.FC<{ search: string; setSearch: (text: string) => void }> = ({ search, setSearch }) => (
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
        backgroundColor: '#FF6600',
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


