import { FlatList, Pressable, Text, Image, SafeAreaView } from 'react-native';
import { useEffect, useState } from 'react'
import { router } from 'expo-router';
import * as data from '@/db.json'

export interface CourtProps {
	id: string;
	local: string;
	image: string;
}

export default function LastCourt() {
	const [court, setCourts] = useState<CourtProps[]>([])

	useEffect(() => {
		setCourts(data.reservas)
	}, [])

	const renderItem = ({ item }: { item: CourtProps }) => (
		<Pressable
			className='flex flex-col items-center justify-center'
			onPress={() => router.push('/(tabs)/reserva')}
		>
			<Image
				source={{ uri: item.image }}
				className='w-24 h-24 rounded-full justify-self-center'
			/>
			<Text
				className='text-sm mt-2 w-20 text-center font-bold leading-4 text-black'
				numberOfLines={2}
			>
				{item.local}
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