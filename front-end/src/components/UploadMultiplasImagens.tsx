import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Button, Image, View, Platform, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from './loading';

const { apiUrl, bucketUrl } = Constants.expoConfig.extra;

interface UploadImageProps {
    onImageUpload: (url: string) => void;
}

const UploadImage = forwardRef(({ onImageUpload }: UploadImageProps, ref) => {
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<{ uri: string; mime: string }[]>([]); // Mudando para armazenar URI e MIME

    // Expondo a função uploadAllImages para o pai
    useImperativeHandle(ref, () => ({
        uploadAllImages: async () => {
            await uploadAllImages();
        }
    }));

    const pickImage = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria de fotos!');
                return;
            }
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            selectionLimit: 0, // Permite selecionar múltiplas imagens
        });

        if (!result.canceled) {
            const selectedImages = result.assets.map(asset => ({
                uri: asset.uri,
                mime: asset.mime || 'image/jpeg' // Define um MIME padrão se não estiver disponível
            }));
            setImages(prevImages => [...prevImages, ...selectedImages]);
        }
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
        if (!token) {
            Alert.alert('Erro', 'Token de acesso não encontrado.');
            setLoading(false);
            return;
        }

        for (const image of images) { // Alterado para usar o novo formato de imagem
            const accessBucket = await getUploadUrl(image.uri, token, image.mime); // Passando o MIME
            if (accessBucket) {
                await uploadImageToBucket(accessBucket, image); // Passando o objeto de imagem
            }
        }
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
                    pathName: "usuario",
                    fileName: imageUri.split('/').pop(),
                    mimeType, // Usando o MIME dinâmico
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
                type: image.mime, // Usando o MIME dinâmico
            });

            const response = await fetch(`${bucketUrl}/public-storage`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                Alert.alert('Sucesso', 'Imagem enviada com sucesso!');
                sucesso = true;
            } else {
                const errorText = await response.text();
                console.log(errorText);
                Alert.alert('Erro', `Falha no upload: ${response.status}\n${errorText}`);
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
                onImageUpload(uploadedUrl);
            } else {
                onImageUpload("");
            }
        }
    }

    return (
        <View style={styles.container}>
            <Button title="Selecionar Imagens" onPress={pickImage} />
            {loading && <Loading />}
            {images.map((image, index) => (
                <Image key={index} source={{ uri: image.uri }} style={styles.image} />
            ))}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    image: {
        width: 200,
        height: 200,
        marginTop: 20,
    },
});

export default UploadImage;
