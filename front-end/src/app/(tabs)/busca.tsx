import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import ListaEstabelecimento from '@/src/components/listaEstabelecimento';
import { MaterialIcons } from '@expo/vector-icons';

const statusBarHeight = Constants.statusBarHeight;

interface SearchBarProps {
    search: string;
    setSearch: (text: string) => void;
}
interface FilterButtonProps {
    title: string;
}

export default function Busca() {
    const [search, setSearch] = useState('');

    function handleEstablishmentPress(estabelecimento: any) {
        console.log('clicado', estabelecimento);
    }

    return (
        <View style={styles.container}>
            <Header />
            <SearchBar search={search} setSearch={setSearch} />
            <ScrollView>
                <ListaEstabelecimento
                    onPress={handleEstablishmentPress}
                    options={{
                        showImage: true,
                        showAvaliacao: true,
                        showPreco: true,
                        showAcomodacoes: true,
                    }} />
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

const FilterButton: React.FC<FilterButtonProps> = ({ title }) => (
    <TouchableOpacity style={styles.filterButton}>
        <Text style={styles.filterText}>{title}</Text>
    </TouchableOpacity>
);

const SearchBar: React.FC<SearchBarProps> = ({ search, setSearch }) => (
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
