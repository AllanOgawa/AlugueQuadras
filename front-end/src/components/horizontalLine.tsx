import { View, ViewStyle } from 'react-native';

export default function HorizontalLine({ margin }: { margin: number }) {
    return <View className='bg-gray-300 w-full h-[1px]' style={{ marginVertical: margin }} />;
}