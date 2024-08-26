import { Pressable, Text, Image } from 'react-native';
import { Courtprops } from '..';
import { router } from 'expo-router';

export function CourtItem({ item }: { item: Courtprops }) {
 return (
   <Pressable 
    className='flex flex-col items-center justify-center'
    onPress={() => router.push('/(tabs)/reserva')}
    >
    <Image
      source={{ uri: item.image}}
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
}