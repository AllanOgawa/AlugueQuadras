import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { ObterLocalizacao } from '@components/obterLocalizacao';
import Constants from 'expo-constants';
import { EstabelecimentoProps } from '@/src/interfaces/estabelecimento';
import { Colors } from '@/src/constants/Colors';

const statusBarHeight = Constants.statusBarHeight;
const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';
const bucketUrl = Constants.expoConfig?.extra?.bucketUrl || '';

export default function Mapa() {
  const [location, setLocation] = useState({
    latitude: -23.4273,
    longitude: -51.9375,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [estabelecimentos, setEstabelecimentos] = useState<EstabelecimentoProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEstabelecimentos();
  }, [])

  useEffect(() => {
    setLoading(true);
    (async () => {
      const locationData = await ObterLocalizacao();
      if (locationData) {
        setLocation({
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setLoading(false);
      }
    })();
  }, []);

  async function getEstabelecimentos() {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/estabelecimento/search`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const responseJson = await response.json();
      const data = responseJson.data || [];

      if (!response.ok) throw new Error('Erro ao buscar estabelecimentos');
      setEstabelecimentos(data);
    } catch (error) {
      console.log('Erro ao buscar estabelecimentos:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View className='rounded-2xl flex-1 justify-center items-center'>
        <ActivityIndicator size="large" className='color-primary' />
      </View>
    );
  }

  return (
    <View className='flex-1 justify-center items-center' style={{ marginTop: statusBarHeight + 1 }}>
      <MapView
        style={styles.map}
        initialRegion={location}
      >
        {estabelecimentos.map((estabelecimento) => (
          <Marker
            key={estabelecimento.idkey}
            coordinate={{ latitude: Number(estabelecimento.endereco.latitude), longitude: Number(estabelecimento.endereco.longitude) }}
          >

            <Callout onPress={() => router.push({
              pathname: '/(estabelecimento)/detalhes',
              params: {
                idEstabelecimento: estabelecimento.idkey
              },
            })}>
              <View style={styles.callout}>
                <Text style={styles.title}>{estabelecimento.nome}</Text>
                <Text style={{ fontSize: 12 }}>
                  {estabelecimento.endereco.logradouro}, {estabelecimento.endereco.numero} - {estabelecimento.endereco.bairro}, {estabelecimento.endereco.cidade} - {estabelecimento.endereco.estado.toUpperCase()}.
                </Text>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Ver Detalhes</Text>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  callout: {
    width: 200,
    padding: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
