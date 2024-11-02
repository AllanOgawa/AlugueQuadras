import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import * as data from '@/db.json';
import { EstabelecimentoProps } from '@/src/interfaces/estabelecimento';
import ListaEstabelecimento from '@/src/components/listaEstabelecimento';
import { MaterialIcons } from '@expo/vector-icons';

const statusBarHeight = Constants.statusBarHeight;

export default function Busca() {
    const [estabelecimentos, setEstabelecimentos] = useState<EstabelecimentoProps[]>([]);
    const [search, setSearch] = useState('');

    // Carregar os estabelecimentos do arquivo JSON
    useEffect(() => {
        if (data.estabelecimento && data.estabelecimento.length > 0) {
            setEstabelecimentos(data.estabelecimento);
        }
    }, []);

    // Filtrar estabelecimentos com base na pesquisa
    const filteredEstabelecimentos = estabelecimentos.filter(estabelecimento =>
        estabelecimento.name.toLowerCase().includes(search.toLowerCase())
    );

    function handleEstablishmentPress(estabelecimento: EstabelecimentoProps): void {
        console.log('clicado', estabelecimento);
    }

    return (
        <View style={styles.container}>
            {/* Cabeçalho e filtros */}
            <Header />
            {/* Barra de busca */}
            <SearchBar search={search} setSearch={setSearch} />
            {/* Lista de estabelecimentos */}
            <ScrollView>
                <ListaEstabelecimento data={filteredEstabelecimentos} onPress={handleEstablishmentPress} />
            </ScrollView>
        </View>
    );
}

const Header = () => (
    <View style={styles.header}>
        <MaterialIcons name='location-pin' size={20} color={"#FF6600"} />
        <Text style={styles.locationText}> Localização atual</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
            {['Beach Tennis', 'Voleibol', 'Tênis', 'Coberto'].map((filter, index) => (
                <FilterButton key={index} title={filter} />
            ))}
        </ScrollView>
    </View>
);

const FilterButton = ({ title }) => (
    <TouchableOpacity style={styles.filterButton}>
        <Text style={styles.filterText}>{title}</Text>
    </TouchableOpacity>
);

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
        paddingLeft: 10, // Adiciona um pequeno espaço à esquerda
    },
    icon: {
        marginRight: 10, // Espaço entre o ícone e o TextInput
    },
});

