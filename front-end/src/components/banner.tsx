import { Dimensions, Pressable, Image, SafeAreaView } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useEffect, useState } from 'react';
import * as data from '@/db.json';
import { ImagemProps } from '@src/interfaces/image';


export default function Banner() {
    const width = Dimensions.get('window').width;
    const [banners, setBanner] = useState<ImagemProps[]>([])

    useEffect(() => {
        setBanner(data.banner)
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
                renderItem={({ item }: { item: ImagemProps }) => (
                    <Pressable
                        className='w-full h-48 rounded-2xl'
                        key={item.id}
                        onPress={() => console.log("Clicou banner " + item.id)}
                    >
                        <Image
                            source={{ uri: item.image }}
                            className='w-[92.5%] h-48 rounded-2xl'
                        >
                        </Image>
                    </Pressable>
                )
                }
            />
        </SafeAreaView>
    );
}