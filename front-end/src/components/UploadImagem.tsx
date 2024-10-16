import React, { useState } from 'react';
import { Button, Image, View, Platform, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CryptoJS from 'crypto-js';
import { Buffer } from 'buffer';

interface UploadImageProps {
    onImageUpload: (url: string) => void; // Callback para lidar com a URL da imagem
}

const UploadImage: React.FC<UploadImageProps> = ({ onImageUpload }) => {
    const [image, setImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const region = 'sa-east-1';
    const service = 's3';
    const endpoint = 's3.aluguequadras.com.br';
    const bucket = 'storage';
    const host = `${endpoint}/${bucket}`;

    // Função para selecionar imagem
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
        });

        if (!result.cancelled) {
            setImage(result.assets[0].uri);
            // Iniciar upload
            await uploadImage(result);
        }
    };

    // Função para gerar assinatura AWS Signature v4
    const generateSignature = (method, path, queryParams, headers, body) => {
        const algorithm = 'AWS4-HMAC-SHA256';
        const serviceName = service;
        const requestDate = headers['x-amz-date']; // Formato: YYYYMMDD'T'HHMMSS'Z'
        const dateStamp = requestDate.substring(0, 8); // YYYYMMDD

        // ************* PASSO 1: Criar a Chave de Assinatura *************
        const kDate = CryptoJS.HmacSHA256(dateStamp, 'AWS4' + secretKey);
        const kRegion = CryptoJS.HmacSHA256(region, kDate);
        const kService = CryptoJS.HmacSHA256(serviceName, kRegion);
        const kSigning = CryptoJS.HmacSHA256('aws4_request', kService);

        // ************* PASSO 2: Criar a String Canônica *************
        const canonicalURI = path;
        const canonicalQueryString = queryParams
            ? Object.keys(queryParams)
                .sort()
                .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
                .join('&') : '';

        const sortedHeaders = Object.keys(headers).map(key => key.toLowerCase()).sort();
        const canonicalHeaders = sortedHeaders
            .map((key) => `${key}:${headers[key]}\n`)
            .join('');

        const signedHeaders = sortedHeaders.join(';');

        const payloadHash = CryptoJS.SHA256(body || '').toString(CryptoJS.enc.Hex);

        const canonicalRequest = [
            method,
            canonicalURI,
            canonicalQueryString,
            canonicalHeaders,
            signedHeaders,
            payloadHash
        ].join('\n');

        // ************* PASSO 3: Criar a String para Assinar *************
        const credentialScope = `${dateStamp}/${region}/${serviceName}/aws4_request`;
        const hashCanonicalRequest = CryptoJS.SHA256(canonicalRequest).toString(CryptoJS.enc.Hex);
        const stringToSign = [
            algorithm,
            requestDate,
            credentialScope,
            hashCanonicalRequest
        ].join('\n');

        // ************* PASSO 4: Calcular a Assinatura *************
        const signature = CryptoJS.HmacSHA256(stringToSign, kSigning).toString(CryptoJS.enc.Hex);

        // ************* PASSO 5: Criar o Cabeçalho de Autorização *************
        const authorizationHeader = `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

        return authorizationHeader;
    };


    // Função para fazer upload da imagem
    // Função para fazer upload da imagem
    const uploadImage = async (result: ImagePicker.ImageInfo) => {
        setUploading(true);
        try {
            const fileName = result.assets[0].uri.split('/').pop();
            const mimeType = result.assets[0].type || 'image/jpeg'; // Ajuste conforme necessário

            const response = await fetch(result.assets[0].uri);
            const blob = await response.blob();

            // Obter ArrayBuffer do blob
            const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result instanceof ArrayBuffer) {
                        resolve(reader.result);
                    } else {
                        reject(new Error("Não foi possível converter o blob em ArrayBuffer."));
                    }
                };
                reader.onerror = reject;
                reader.readAsArrayBuffer(blob);
            });

            const body = Buffer.from(arrayBuffer).toString('base64'); // Necessário para hashing

            const now = new Date();
            const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, ''); // YYYYMMDD'T'HHMMSS'Z'
            const dateStamp = amzDate.substring(0, 8); // YYYYMMDD

            // Remover a barra no início
            const objectPath = `${bucket}/${fileName}`;

            let headers = {
                'Authorization': "",
                'Host': host,
                'x-amz-date': amzDate,
                'Content-Type': mimeType,
                'x-amz-content-sha256': CryptoJS.SHA256(body).toString(CryptoJS.enc.Hex),
            };

            const method = 'PUT';
            const path = objectPath;
            const queryParams = {};

            // Gerar assinatura
            const authorization = generateSignature(method, path, queryParams, headers, body);
            headers['Authorization'] = authorization;

            console.log(`https://${host}/${fileName}`);
            console.log("method", method);
            console.log("headers", headers);
            console.log("blob", blob);

            const uploadResponse = await fetch(`https://${host}/${fileName}`, {
                method: method,
                headers: headers,
                body: blob, // Usar blob diretamente
            });

            console.log(uploadResponse);
            if (uploadResponse.ok) {
                const uploadedUrl = `https://${host}/${fileName}`;
                Alert.alert('Sucesso', 'Imagem enviada com sucesso!');
                onImageUpload(uploadedUrl); // Chamar a função callback com a URL da imagem
            } else {
                const errorText = await uploadResponse.text();
                Alert.alert('Erro', `Falha no upload: ${uploadResponse.status}\n${errorText}`);
            }
        } catch (error) {
            console.error('Erro no upload:', error);
            Alert.alert('Erro', 'Ocorreu um erro durante o upload.');
        } finally {
            setUploading(false);
        }
    };


    return (
        <View style={styles.container}>
            <Button title="Selecionar e Upload de Imagem" onPress={pickImage} />
            {uploading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}
            {image && !uploading && (
                <Image source={{ uri: image }} style={styles.image} />
            )}
        </View>
    );
};

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
