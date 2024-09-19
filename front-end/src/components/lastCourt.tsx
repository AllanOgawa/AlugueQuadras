import { FlatList, Pressable, Text, Image, SafeAreaView } from 'react-native';
import { useEffect, useState } from 'react'
import { router } from 'expo-router';
import * as data from '@/db.json'
import { EstabelecimentoProps } from '@src/interfaces/estabelecimento';

export default function LastCourt() {
	const [court, setCourts] = useState<EstabelecimentoProps[]>([])

	useEffect(() => {
		setCourts(data.estabelecimento)
	}, [])

	const renderItem = ({ item }: { item: EstabelecimentoProps }) => (
		<Pressable
			className='flex flex-col items-center justify-center'
			onPress={() => router.push(`../estabelecimento/${item.id}`)}
		>
			<Image
				source={{ uri: item.image[0].image }}
				className='w-24 h-24 rounded-full justify-self-center'
			/>
			<Text
				className='text-sm mt-2 w-20 text-center font-bold leading-4 text-black'
				numberOfLines={2}
			>
				{item.name}
			</Text>
		</Pressable>
	);

	return (
		<SafeAreaView>
			<Text className="text-xl font-semibold mt-3">Ultimas Quadras Visitadas</Text>
			<FlatList
				data={court}
				renderItem={renderItem}
				horizontal={true}
				contentContainerStyle={{ gap: 14, paddingRight: 16, marginTop: 16 }}
				showsHorizontalScrollIndicator={false}
				className='h-40'
			/>
		</SafeAreaView>
	);
}