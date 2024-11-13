import { FlatList, Pressable, Text, Image, SafeAreaView, View } from 'react-native';
import { useEffect, useState } from 'react'
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import Loading from './loading';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || '';
const bucketUrl = Constants.expoConfig?.extra?.bucketUrl || '';

export default function MaisVisitados() {
	const [estabelecimentos, setEstabelecimentos] = useState<[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		getEstabelecimentos();
	}, [])

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
			console.error('Erro ao buscar estabelecimentos:', error);
		} finally {
			setLoading(false);
		}
	}

	const renderItem = ({ item }: { item: any }) => (
		<Pressable key={item.idkey}
			className='flex flex-col items-center justify-center'
			onPress={() => router.push({
				pathname: '/(estabelecimento)/detalhes',
				params: { idEstabelecimento: item.idkey },
			})}
		>
			{item.imagens.length > 0 ? <Image
				source={{ uri: `${bucketUrl}/${item.imagens[0].path}` }}
				className='w-24 h-24 rounded-full justify-self-center'
			/> :
				<Image
					source={{ uri: `${bucketUrl}/public-storage/outros/semImagem.jpg` }}
					className='w-24 h-24 rounded-full justify-self-center'
				/>
			}
			<Text
				className='text-sm mt-2 w-20 text-center font-bold leading-4 text-black'
				numberOfLines={2}
			>
				{item.nome}
			</Text>
		</Pressable>
	);

	return (
		<SafeAreaView>
			<Text className="text-xl font-semibold mt-3">Estabelecimentos mais Visitados</Text>
			{estabelecimentos && estabelecimentos.length > 0 ?
				<FlatList
					data={estabelecimentos}
					renderItem={renderItem}
					horizontal={true}
					contentContainerStyle={{ gap: 14, paddingRight: 16, marginTop: 16 }}
					showsHorizontalScrollIndicator={false}
					className='h-40'
				/>
				:
				<View>
					<Text>Nenhum estabelecimento encontrado</Text>
				</View>
			}
			{loading && <Loading />}
		</SafeAreaView>
	);
}