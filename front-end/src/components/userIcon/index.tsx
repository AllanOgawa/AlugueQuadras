import React, { useState, useEffect } from 'react';
import { View, Image, Text } from 'react-native';
import * as data from '@/db.json';

export interface UserIconProps {
	image: string;
}

export default function UserIcon({ image }: UserIconProps) {
	return (
		<View className='flex-col items-center justify-center mb-4'>
			<Image
				className='w-24 h-24 rounded-full border-2 border-black'
				source={{ uri: image }}
			/>
		</View>
	);
}


