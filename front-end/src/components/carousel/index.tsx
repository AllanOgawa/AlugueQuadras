import { Dimensions, View, Pressable, Image } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useEffect, useState } from 'react';
import * as data from '@/db.json';

export interface BannerProps {
    id: string;
    image: string;
}

export default function CarouselComp() {
    const width = Dimensions.get('window').width;
    const [banners, setBanner] = useState<BannerProps[]>([])

    useEffect(() => {
        const testa = data.banner.map(item => {
            const image = "@/src/assets/" + item.image;
            return {
                id: item.id,
                image: item.image
            }
        });
        setBanner(data.banner)
    }, [])

    return (
        <View style={{ flex: 1 }}
            className='rounded-2xl'>
            <Carousel
                loop
                width={width}
                height={width / 2}
                autoPlay={true}
                style={{ borderRadius: 15 }}
                autoPlayInterval={5000}
                data={banners}
                scrollAnimationDuration={1000}
                // onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={({ item }) => (
                    <Pressable
                        className='w-full h-36 md:h-60 rounded-2xl'
                        key={item.id}
                        onPress={() => console.log("Clicou banner " + item.id)}
                    >
                        <Image
                            source={require("@/src/assets/banner2.jpg")}
                            className='w-full h-36 md:h-60 rounded-2xl'
                        >
                        </Image>
                    </Pressable>
                )}
            />
        </View>
    );
}