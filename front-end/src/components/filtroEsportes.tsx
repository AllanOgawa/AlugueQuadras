import globalStyles from '@src/styles/globalStyles';
import { Pressable, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'
import Loading from './loading';
import { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';

export default function FiltroEsportes() {
  const [loading, setLoading] = useState(false);
  const [tipoEsportes, setTipoEsportes] = useState<any[]>([]);

  useEffect(() => {
    fetchTipoEsportes();
  }, []);

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

  return (
    <View className='w-full mt-2 mb-4'>
      <View className='flex-row justify-between'>
        <Pressable
          style={globalStyles.box2}
          className='h-20 w-[49%] rounded-2xl bg-primary
          flex-row items-center justify-between px-1'
          key="0"
          onPress={() => router.navigate({
            pathname: '/(tabs)/busca',
            params: {
              tipoEsporteSelecionado: JSON.stringify(tipoEsportes[0])
            },
          })}
        >
          {tipoEsportes[0] && (
            <>
              <Text className='text-white text-xl ml-1 font-bold'>{tipoEsportes[0].descricao}</Text>
              <MaterialIcons name="sports-basketball" size={40} color="white" />
            </>
          )}
        </Pressable>

        <Pressable
          style={globalStyles.box2}
          className='h-20 w-[49%] rounded-2xl bg-primary 
          flex-row items-center justify-between px-1'
          key="1"
          onPress={() => router.navigate({
            pathname: '/(tabs)/busca',
            params: {
              tipoEsporteSelecionado: JSON.stringify(tipoEsportes[1])
            },
          })}
        >
          {tipoEsportes[1] && (
            <>
              <Text className='text-white text-xl ml-1 font-bold'>{tipoEsportes[1].descricao}</Text>
              <MaterialIcons name="sports-soccer" size={40} color="white" />
            </>
          )}
        </Pressable>

      </View>

      <View className='flex-row justify-between mt-3'>

        <Pressable
          style={globalStyles.box2}
          className='h-20 w-[49%] rounded-2xl bg-primary 
          flex-row items-center justify-between px-1'
          key="2"
          onPress={() => router.navigate({
            pathname: '/(tabs)/busca',
            params: {
              tipoEsporteSelecionado: JSON.stringify(tipoEsportes[2])
            },
          })}
        >
          {tipoEsportes[2] && (
            <>
              <Text className='text-white text-xl ml-1 font-bold'>{tipoEsportes[2].descricao}</Text>
              <MaterialIcons name="sports-volleyball" size={40} color="white" />
            </>
          )}
        </Pressable>

        <Pressable
          style={globalStyles.box2}
          className='h-20 w-[49%] rounded-2xl bg-primary 
          flex-row items-center justify-between px-1'
          key="3"
          onPress={() => router.navigate({
            pathname: '/(tabs)/busca',
            params: {
              tipoEsporteSelecionado: JSON.stringify(tipoEsportes[3])
            },
          })}
        >
          {tipoEsportes[3] && (
            <>
              <Text className='text-white text-xl ml-1 font-bold'>{tipoEsportes[3].descricao}</Text>
              <MaterialIcons name="sports-tennis" size={40} color="white" />
            </>
          )}
        </Pressable>

      </View>

      <View className='mt-3'>
        <Pressable
          style={[
            globalStyles.box2,
            { backgroundColor: '#22002d' }
          ]}
          className="w-full h-12 rounded-2xl flex-row items-center justify-center px-1"
          key="4"
          onPress={() => router.navigate({
            pathname: '/(tabs)/busca',
            params: {
              tipoEsporteSelecionado: JSON.stringify("")
            },
          })}
        >
          <Text className="text-white text-xl font-bold">Mais Quadras</Text>
          <MaterialIcons name="sports-handball" size={23} color="white" />
        </Pressable>
      </View>
      {loading && <Loading />}
    </View>
  );
}