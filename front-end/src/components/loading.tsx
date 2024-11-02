
import { View, ActivityIndicator } from 'react-native';

export default function Loading() {
    return (
        <View className='
        absolute 
        top-0 
        left-0 
        right-0 
        bottom-0 
        justify-center 
        items-center 
        bg-black/30'>
            <ActivityIndicator size="large" className="color-primary" />
        </View>
    );
}
