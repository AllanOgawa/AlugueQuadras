// import React, { useState } from 'react';
// import { Button, Image, View, Platform, StyleSheet, ActivityIndicator, Alert } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import Toast from 'react-native-toast-message';
// import Constants from 'expo-constants';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Loading from './loading';

// const { apiUrl, bucketUrl, userDefaultImage } = Constants.expoConfig.extra;

// interface UploadImageProps {
//     onImageUpload: (url: string) => void;
// }

// const UploadImage: React.FC<UploadImageProps> = ({ onImageUpload }) => {
//     const [loading, setLoading] = useState(false);
//     const [image, setImage] = useState<string | null>(null);

//     const pickImage = async () => {
//         if (Platform.OS !== 'web') {
//             const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//             if (status !== 'granted') {
//                 Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria de fotos!');
//                 return;
//             }
//         }
//         let result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: true,
//             quality: 1,
//         });


//         setLoading(true);
//         if (!result.cancelled) {
//             const token = await getAcessToken(); // Aguarda o accessToken
//             if (token) {
//                 setImage(result.assets[0].uri);
//                 await getUploadUrl(result.assets[0], token); // Passa o token diretamente
//             }
//         }
//     };

//     async function getAcessToken() {
//         try {
//             const value = await AsyncStorage.getItem("access_token");
//             if (value !== null && value !== "") {
//                 return value; // Retorna o token
//             } else {
//                 setLoading(false);
//                 console.error('Erro ao buscar acess_token');
//             }
//         } catch (e) {
//             console.error('Erro ao obter dados', e);
//         }
//         return null; // Retorna nulo caso não tenha token
//     }

//     async function getUploadUrl(result: ImagePicker.ImageInfo, token: string) {
//         let sucesso = false;
//         let accessBucket;
//         try {
//             const response = await fetch(`${apiUrl}/storage/upload-url`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`,
//                 },
//                 body: JSON.stringify({
//                     pathName: "usuario",
//                     fileName: result.fileName,
//                     mimeType: result.mimeType
//                 }),
//             });

//             const data = await response.json();
//             if (response.ok) {
//                 accessBucket = data;
//                 sucesso = true;
//             }
//         } catch (error) {
//             console.error('Erro de rede getUploadUrl', error);
//             Toast.show({
//                 type: 'error',
//                 text1: "Erro de Rede",
//                 text2: String(error),
//             });
//         } finally {
//             if (sucesso) {
//                 UploadImageToBucket(accessBucket, result.uri);
//             } else {
//                 setLoading(false);
//             }
//         }
//     }

//     async function UploadImageToBucket(accessBucket: any, imageUri: string) {
//         let sucesso = false;
//         const uploadedUrl = `${bucketUrl}/public-storage/${accessBucket.fields.key}`; // URL da imagem carregada
//         setLoading(true);
//         try {
//             const formData = new FormData();

//             // Adicionando todos os campos necessários do accessBucket
//             Object.entries(accessBucket.fields).forEach(([key, value]) => {
//                 formData.append(key, value);
//             });

//             // Adicionando o arquivo de imagem
//             formData.append('file', {
//                 uri: imageUri,
//                 name: accessBucket.fields.key.split('/').pop(), // Use o nome do arquivo
//                 type: accessBucket.fields['Content-Type'],
//             });

//             const response = await fetch(`${bucketUrl}/public-storage`, {
//                 method: 'POST',
//                 headers: {},
//                 body: formData,
//             });

//             if (response.ok) {
//                 Alert.alert('Sucesso', 'Imagem enviada com sucesso!');
//                 sucesso = true;
//             } else {
//                 const errorText = await response.text();
//                 console.log(errorText);
//                 Alert.alert('Erro', `Falha no upload: ${response.status}\n${errorText}`);
//             }
//         } catch (error) {
//             console.error('Erro no upload:', error);
//             Toast.show({
//                 type: 'error',
//                 text1: "Erro de Rede",
//                 text2: String(error),
//             });
//         } finally {
//             if (sucesso) {
//                 onImageUpload(uploadedUrl);
//             } else {
//                 onImageUpload("");
//             }
//             setLoading(false);
//         }
//     }

//     return (
//         <View style={styles.container}>
//             <Button title="Selecionar e Upload de Imagem" onPress={pickImage} />
//             {loading && <Loading />}
//             {image && !loading && (
//                 <Image source={{ uri: image }} style={styles.image} />
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 20,
//     },
//     image: {
//         width: 200,
//         height: 200,
//         marginTop: 20,
//     },
// });

// export default UploadImage;
