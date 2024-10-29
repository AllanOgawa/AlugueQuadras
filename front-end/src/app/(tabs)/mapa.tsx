import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useState, useEffect } from 'react';

import { ObterLocalizacao } from '@components/obterLocalizacao';
import Constants from 'expo-constants';

const statusBarHeight = Constants.statusBarHeight;

export default function Mapa() {
  const [location, setLocation] = useState({
    latitude: -23.4273,
    longitude: -51.9375,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude
            }}
            title='você está aqui'
          />
        )}
      </MapView>

    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
});
