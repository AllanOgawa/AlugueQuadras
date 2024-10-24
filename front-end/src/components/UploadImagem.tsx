import { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Pressable, Image, View, Platform, StyleSheet, Alert, ScrollView, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from './loading';

const { apiUrl, bucketUrl } = Constants.expoConfig.extra;

interface UploadImageProps {
    linksImagens: (imagensToAdd: string[], imagensToRemove: string[]) => void;
    multipasImagens?: boolean;
    pastaBucket: string;
    btClassName: string;
    btClassNameTitle: string;
    imagensExistentes: string[];
}

const UploadImage = forwardRef(({
    linksImagens,
    multipasImagens = true,
    pastaBucket,
    btClassName,
    btClassNameTitle,
    imagensExistentes = []
}: UploadImageProps, ref) => {

    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<{ uri: string; mime: string; novo: boolean }[]>([]);
    const [imagesToAdd, setImagesToAdd] = useState<{ uri: string; mime: string; novo: boolean }[]>([]);
    const [imagesToRemove, setImagesToRemove] = useState<{ uri: string; mime: string; novo: boolean }[]>([]);
    const MAX_IMAGES = 5; // Definir o limite máximo de 5 imagens

    useImperativeHandle(ref, () => ({
        uploadAllImages: async () => {
            await uploadAllImages();
        },
    }));

    useEffect(() => {
        setImages(imagensExistentes.map(image => ({ uri: image, novo: false, mime: "image" })));
    }, [imagensExistentes]);

    useEffect(() => {
        setImagesToAdd(images.filter(image => image.novo));
    }, [images]);

    const pickImage = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria de fotos!');
                return;
            }
        }

        // Verifica se já atingiu o número máximo de imagens
        if (multipasImagens && images.length >= MAX_IMAGES) {
            Alert.alert('Limite atingido', `Você só pode selecionar até ${MAX_IMAGES} imagens.`);
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
            allowsMultipleSelection: multipasImagens,
            selectionLimit: multipasImagens ? MAX_IMAGES - images.length : 1, // Controla o limite baseado nas imagens já selecionadas
        });

        if (!result.canceled) {
            const selectedImages = result.assets.map(asset => ({
                novo: true,
                uri: asset.uri,
                mime: asset.mimeType || 'image/jpeg' // Usando asset.type para o mimeType
            }));

            if (multipasImagens) {
                setImages(prevImages => {
                    const totalSelectedImages = prevImages.length + selectedImages.length;
                    if (totalSelectedImages > MAX_IMAGES) {
                        Alert.alert('Limite atingido', `Você só pode adicionar mais ${MAX_IMAGES - prevImages.length} imagem(ns).`);
                        return [...prevImages, ...selectedImages.slice(0, MAX_IMAGES - prevImages.length)];
                    } else {
                        return [...prevImages, ...selectedImages];
                    }
                });
            } else {
                if (images && images[0] && !images[0].novo)
                    setImagesToRemove(images);

                setImages(selectedImages.slice(0, 1));
            }
        }
    };

    const removeImage = (index: number) => {
        const imageToRemove = images.find((_, i) => i == index);
        if (imageToRemove && !imageToRemove.novo) {
            setImagesToRemove(prevImages => {
                return [...prevImages, imageToRemove];
            })
        }
        setImages(images.filter((_, i) => i !== index));
    };

    async function getAccessToken() {
        try {
            const value = await AsyncStorage.getItem("access_token");
            return value || null;
        } catch (e) {
            console.error('Erro ao obter dados', e);
            return null;
        }
    }

    async function uploadAllImages() {
        setLoading(true);
        const token = await getAccessToken();
        const imagensParaAdicionar = [];
        if (!token) {
            Alert.alert('Erro', 'Token de acesso não encontrado.');
            setLoading(false);
            return;
        }
        for (const image of imagesToAdd) {
            const accessBucket = await getUploadUrl(image.uri, token, image.mime);
            if (accessBucket) {
                imagensParaAdicionar.push(await uploadImageToBucket(accessBucket, image));
            }
        }
        linksImagens(imagensParaAdicionar, imagesToRemove.map(image => image.uri));
        setLoading(false);
    }

    async function getUploadUrl(imageUri: string, token: string, mimeType: string) {
        let sucesso = false;
        let accessBucket;
        try {
            const response = await fetch(`${apiUrl}/storage/upload-url`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    pathName: pastaBucket,
                    fileName: imageUri.split('/').pop(),
                    mimeType,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                accessBucket = data;
                sucesso = true;
            }
        } catch (error) {
            console.error('Erro de rede getUploadUrl', error);
            Toast.show({
                type: 'error',
                text1: "Erro de Rede",
                text2: String(error),
            });
        }
        return sucesso ? accessBucket : null;
    }

    async function uploadImageToBucket(accessBucket: any, image: { uri: string; mime: string }) {
        let sucesso = false;
        const uploadedUrl = `public-storage/${accessBucket.fields.key}`;
        try {
            const formData = new FormData();

            Object.entries(accessBucket.fields).forEach(([key, value]) => {
                formData.append(key, value);
            });

            formData.append('file', {
                uri: image.uri,
                name: accessBucket.fields.key.split('/').pop(),
                type: image.mime,
            } as any);

            const response = await fetch(`${bucketUrl}/public-storage`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log('Imagem enviada com sucesso!');
                sucesso = true;
            } else {
                const errorText = await response.text();
                console.log(`Falha no upload: ${response.status}\n${errorText}`);
            }
        } catch (error) {
            console.error('Erro no upload:', error);
            Toast.show({
                type: 'error',
                text1: "Erro de Rede",
                text2: String(error),
            });
        } finally {
            if (sucesso) {
                return uploadedUrl;
            }
            return;
        }
    }

    return (
        <View style={styles.container}>
            <View className={btClassName}>
                <Pressable onPress={pickImage}>
                    <Text className={btClassNameTitle}>Selecionar Image{multipasImagens ? 'ns' : 'm'}</Text>
                </Pressable>

            </View>

            {loading && <Loading />}

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={true}
                style={styles.scrollView}
                contentContainerStyle={styles.imageContainer}
            >
                {images.map((image, index) => (
                    <View key={index} style={styles.imageWrapper}>
                        <Image source={{ uri: (image.novo) ? image.uri : `${bucketUrl}/${image.uri}` }} style={styles.image} />
                        <Pressable style={styles.removeButton} className='bg-primary' onPress={() => removeImage(index)}>
                            <Text style={styles.removeButtonText}>×</Text>
                        </Pressable>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    scrollView: {
        width: '100%',
        padding: 2,
        marginTop: 5
    },
    uploadButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 20,
    },
    uploadText: {
        color: 'white',
        fontWeight: 'bold',
    },
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexGrow: 1, // Garante que o conteúdo do ScrollView ocupe o espaço disponível
    },
    imageWrapper: {
        position: 'relative',
        marginRight: 15,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 10,
    },
    removeButton: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 25,
        height: 25,
        borderRadius: 12.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
        lineHeight: 25,
    },
});


export default UploadImage;
