import { Dimensions, View, Image, SafeAreaView } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useEffect, useState } from 'react';
import Constants from 'expo-constants';

const bucketUrl = Constants.expoConfig?.extra?.bucketUrl || '';

export default function Banner() {
    const width = Dimensions.get('window').width;
    const [banners, setBanner] = useState<string[]>([])

    useEffect(() => {
        setBanner([
            `${bucketUrl}/public-storage/outros/banner2.png`,
            `${bucketUrl}/public-storage/outros/banner5.png`,
            `${bucketUrl}/public-storage/outros/banner3.png`,
            `${bucketUrl}/public-storage/outros/banner4.png`,
        ])
    }, [])

    return (
        <SafeAreaView className='w-full h-48 md:h-60 rounded-2xl mt-5 mb-4'>
            <Carousel
                loop
                width={width}
                autoPlay={true}
                style={{ borderRadius: 15 }}
                autoPlayInterval={8000}
                data={banners}
                scrollAnimationDuration={1000}
                renderItem={({ item, index }: { item: string, index: number }) => (
                    <View
                        className='w-full h-48 rounded-2xl'
                        key={index}
                    >
                        <Image
                            source={{ uri: item }}
                            className='w-[92.5%] h-48 rounded-2xl'
                        >
                        </Image>
                    </View>
                )
                }
            />
        </SafeAreaView>
    );
}