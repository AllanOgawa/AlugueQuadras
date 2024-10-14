import React, { useState } from 'react';
import { Button, Image, View, Platform, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { encode as btoa } from 'base-64';
import { MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_URL_BASE } from '@env';


interface UploadImagemProps {
    onImageUpload: (url: string) => void; // Callback para retornar a URL após upload
    presignedUrl: string; // Endpoint do backend para gerar URL presignada
}


const sign = (key: string, message: string) => {
    return CryptoJS.HmacSHA256(message, key).toString(CryptoJS.enc.Hex);
};

// Função para criar a assinatura V4
const getSignatureKey = (key: string, dateStamp: string, regionName: string, serviceName: string) => {
    const kDate = CryptoJS.HmacSHA256(dateStamp, 'AWS4' + key);
    const kRegion = CryptoJS.HmacSHA256(regionName, kDate);
    const kService = CryptoJS.HmacSHA256(serviceName, kRegion);
    const kSigning = CryptoJS.HmacSHA256('aws4_request', kService);
    return kSigning;
};

const UploadImagem: React.FC<UploadImagemProps> = ({
    onImageUpload,
    presignedUrl,
}) => {
    const [image, setImage] = useState<string | null>(null);
    const [uploadUrl, setUploadUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);


    const pickImage = async () => {
        // Solicitar permissões de acesso à galeria
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Precisamos de permissões para acessar sua galeria de fotos!');
                return;
            }
        }

        // Selecionar imagem da galeria
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, // Permite corte/edição
            quality: 1, // Qualidade da imagem
        });

        if (!result.cancelled) {
            setImage(result.assets[0].uri);
            uploadImage(result.assets[0].uri);
        }
    };

    // Obter URL presignada do backend
    const getPresignedUrl = async (uri: string) => {
        try {
            // Obter o conteúdo da imagem como blob
            const response = await fetch(uri);
            const blob = await response.blob();

            // Ler o conteúdo do blob e gerar o hash
            const reader = new FileReader();
            return new Promise((resolve, reject) => {
                reader.onloadend = async () => {
                    const fileContent = reader.result as string;
                    console.log(fileContent)
                    const hash = CryptoJS.SHA256(fileContent).toString(CryptoJS.enc.Hex); // Gerar hash SHA-256

                    const mimeType = blob.type || 'image/jpeg'; // Determinar o tipo MIME da imagem
                    console.log(mimeType)
                    console.log(presignedUrlEndpoint)
                    console.log(hash)
                    // Chamar o backend para obter a URL presignada, usando o hash como nome do arquivo
                    try {
                        const presignedResponse = await axios.post(presignedUrlEndpoint, { fileName: hash, mimeType });
                        console.log(presignedResponse)
                        resolve(presignedResponse.data);
                    } catch (error) {
                        console.error('Erro ao obter URL presignada:', error);
                        reject({});
                    }
                };

                reader.onerror = (error) => reject(error);

                // Ler o blob como uma string base64 para gerar o hash
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Erro ao processar a imagem:', error);
            return {};
        }
    };

    const uploadImage = async (uri: string) => {
        setLoading(true);
        try {
            // Fetch the image as a blob
            const response = await fetch(uri);
            const blob = await response.blob();

            // Timestamp (ISO8601 format)
            const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, ''); // Data sem separadores
            const dateStamp = amzDate.substr(0, 8); // AAAAMMDD

            // Informações necessárias
            const region = 'sa-east-1'; // MinIO não usa regiões por padrão, mas você pode definir a sua
            const service = 's3';
            const method = 'PUT';
            const host = MINIO_URL_BASE; // Substitua pelo host do MinIO
            const canonicalUri = presignedUrl; // Substitua pelo bucket e arquivo alvo

            // Canonical headers
            const canonicalHeaders = `host:${host}\nx-amz-date:${amzDate}\n`;

            // Signed headers
            const signedHeaders = 'host;x-amz-date';

            // Payload hash (empty string for uploading files)
            const payloadHash = CryptoJS.SHA256('').toString();

            // Canonical request
            const canonicalRequest = [
                method,
                canonicalUri,
                '', // Query string, if applicable
                canonicalHeaders,
                signedHeaders,
                payloadHash
            ].join('\n');

            // String to sign
            const algorithm = 'AWS4-HMAC-SHA256';
            const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
            const stringToSign = [
                algorithm,
                amzDate,
                credentialScope,
                CryptoJS.SHA256(canonicalRequest).toString()
            ].join('\n');

            // Gerar a chave de assinatura
            const signingKey = getSignatureKey(MINIO_SECRET_KEY, dateStamp, region, service);

            // Gerar a assinatura
            const signature = CryptoJS.HmacSHA256(stringToSign, signingKey).toString(CryptoJS.enc.Hex);

            // Cabeçalho de autorização
            const authorizationHeader = `${algorithm} Credential=${MINIO_ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

            console.log(authorizationHeader)
            console.log(amzDate)
            console.log(blob)
            console.log({
                method: 'PUT',
                headers: {
                    'Authorization': authorizationHeader, // Cabeçalho de autorização AWS Signature V4
                    'x-amz-date': amzDate, // Timestamp no formato x-amz-date
                    'Content-Type': blob.type, // Tipo de conteúdo
                },
                body: blob,
            })
            // Fazer a requisição PUT com os cabeçalhos assinados
            const uploadResponse = await fetch(MINIO_URL_BASE + presignedUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': authorizationHeader, // Cabeçalho de autorização AWS Signature V4
                    'x-amz-date': amzDate, // Timestamp no formato x-amz-date
                    'Content-Type': blob.type, // Tipo de conteúdo
                },
                body: blob,
            });
            console.log(uploadResponse)

            if (uploadResponse.ok) {
                console.log('Upload bem-sucedido!');
                onImageUpload(presignedUrl); // Chamar o callback com a URL de upload
            } else {
                console.log('Erro no upload:', uploadResponse.status);
            }
        } catch (error) {
            console.error('Erro ao enviar a imagem:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Selecionar Imagem" onPress={pickImage} />

            {loading && <Text>Carregando...</Text>}

            {/* Mostrar a imagem selecionada */}
            {image && <Image source={{ uri: image }} style={styles.image} />}

            {/* Exibir URL gerada após upload */}
            {uploadUrl && <Text>Imagem enviada com sucesso!</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    image: {
        width: 200,
        height: 200,
        marginTop: 10,
    },
});

export default UploadImagem;
