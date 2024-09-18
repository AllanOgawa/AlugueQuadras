import React, { useState, useEffect } from 'react';
import { View, Image, Text } from 'react-native';
import * as data from '@/db.json';

interface UserIconProps {
	image: string;
	style?: string; // Parâmetro opcional para a classe de estilo
}

export default function UserIcon({ image, style }: UserIconProps) {
	return (
		<View className='flex-col items-center justify-center mb-4'>
			<Image
				className={`${style}`} // Adiciona a classe de estilo aqui
				source={{ uri: image }}
			/>
		</View>
	);
}

