import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useState, useEffect } from 'react';
import { LocationCourtProps } from '@src/interfaces/locationCourt';



export default function LocationEstabelecimento({ latitude, longitude, markerTitle, endereco }: LocationCourtProps) {
    const [location, setLocation] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLocation({
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.009,
                longitudeDelta: 0.009,
            });
            setLoading(false);
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
        <View>
            <View className='rounded-2xl justify-center items-center'>
                <MapView
                    style={styles.map}
                    initialRegion={location}
                    showsUserLocation={true}
                    loadingEnabled={true}
                >
                    {location && (
                        <Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude
                            }}
                            title={markerTitle}
                        />
                    )}
                </MapView>
            </View>

            <Text className='mt-3 color-gray-600'>
                {endereco}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: 225
    }
});
