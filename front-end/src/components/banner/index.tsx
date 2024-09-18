import { Dimensions, Pressable, Image, SafeAreaView } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useEffect, useState } from 'react';
import * as data from '@/db.json';

export interface BannerProps {
    id: string;
    name: string;
    image: string;
}

export default function Banner() {
    const width = Dimensions.get('window').width;
    const [banners, setBanner] = useState<BannerProps[]>([])

    useEffect(() => {
        setBanner(data.banner)
    }, [])

    return (
        <SafeAreaView className='w-full h-36 md:h-60 rounded-2xl mt-5 mb-4'>
            <Carousel
                loop
                width={width - 30}
                autoPlay={true}
                style={{ borderRadius: 15 }}
                autoPlayInterval={8000}
                data={banners}
                scrollAnimationDuration={1000}
                renderItem={({ item }) => {
                    return (
                        <Pressable
                            className='w-full h-36 rounded-2xl'
                            key={item.id}
                            onPress={() => console.log("Clicou banner " + item.id)}
                        >
                            <Image
                                source={{ uri: item.image }}
                                className='w-full h-36 rounded-2xl'
                            >
                            </Image>
                        </Pressable>
                    )
                }}
            />
        </SafeAreaView>
    );
}