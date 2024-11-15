import { useState, useRef } from 'react';
import {
    View, ScrollView, Image, Dimensions, StyleSheet, Text, Modal, TouchableOpacity, Animated,
    Pressable
} from 'react-native';
import { ImagemProps } from '@src/interfaces/image';
import Ionicons from '@expo/vector-icons/Ionicons';
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window');

const bucketUrl = Constants.expoConfig?.extra?.bucketUrl || '';

export default function CarouselQuadra({ imagemQuadra }: { imagemQuadra: ImagemProps[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const scrollX = useRef(new Animated.Value(0)).current;

    const handleScroll = (event: any) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / width);
        setCurrentIndex(index);
    };

    const openModal = (index: number) => {
        setCurrentIndex(index);
        setIsModalVisible(true);
    };

    return (
        <View className='flex-1 justify-center items-center'>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false, listener: handleScroll }
                )}
                scrollEventThrottle={16}
            >
                {imagemQuadra.map((item, index) => (
                    <Pressable key={index} onPress={() => openModal(index)}>
                        <View className='justify-center items-center' style={{ width: width }}>
                            <Image source={{ uri: `${bucketUrl}/${item.path}` }} resizeMode="cover" className='w-full h-64' />
                            <View className="flex-row absolute bottom-0 self-center">
                                {imagemQuadra.map((_, i) => {
                                    const opacity = scrollX.interpolate({
                                        inputRange: [
                                            (i - 1) * width,
                                            i * width,
                                            (i + 1) * width,
                                        ],
                                        outputRange: [0.3, 1, 0.3],
                                        extrapolate: 'clamp',
                                    });
                                    return (
                                        <Animated.View
                                            key={i}
                                            style={{ opacity }}
                                            className='h-2 w-2 rounded-full bg-white m-1'
                                        />
                                    );
                                })}
                            </View>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>

            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View className='flex-1 justify-center items-center bg-black/90'>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: false, listener: handleScroll }
                        )}
                        scrollEventThrottle={16}
                    >
                        {imagemQuadra.map((item, index) => (
                            <View key={index} style={{ width: width }} className='justify-center items-center'>
                                <Image source={{ uri: `${bucketUrl}/${item.path}` }} style={styles.fullscreenImage} />
                            </View>
                        ))}
                    </ScrollView>

                    {/* Fechar Modal */}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setIsModalVisible(false)}
                    >
                        <Ionicons name="close" size={40} color="white" />
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};


const styles = StyleSheet.create({
    fullscreenImage: {
        width: width,
        height: height * 0.8,
        resizeMode: 'contain',
    },
    closeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 10,
        borderRadius: 16,
    },
});