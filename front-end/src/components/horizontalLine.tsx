import { View } from 'react-native';

export default function HorizontalLine({ margin, color = "bg-gray-300" }: { margin: number, color?: string }) {
    return <View className={`${color} w-full h-[1px]`} style={{ marginVertical: margin }} />;
}