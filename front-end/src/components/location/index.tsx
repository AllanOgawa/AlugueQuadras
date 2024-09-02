import * as Location from 'expo-location';

export async function ObterLocalizacao() {
  // Solicitar permissões de localização
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.log('Permissão para acessar localização não permitida');
    return null;
  }

  // Obter a localização atual
  let currentLocation = await Location.getCurrentPositionAsync({});
  
  if (currentLocation && currentLocation.coords) {
    const { latitude, longitude } = currentLocation.coords;
    
    // Obter o nome da cidade (opcional)
    let reverseGeocode = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    
    const city =  reverseGeocode[0]?.city || reverseGeocode[0]?.district || "Cidade não identificada"
    
    return {
      latitude,
      longitude,
      city,
    };
  } else {
    console.log('Não foi possível obter a localização.');
    return null;
  }
}