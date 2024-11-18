import 'dotenv/config';

export default {
  expo: {
    name: "AlugueQuadras",
    slug: "AlugueQuadras",
    version: "1.0.0",
    orientation: "portrait",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    extra: {
      apiUrl: process.env.API_URL_BACKEND,
      bucketUrl: process.env.API_URL_BUCKET,
      userDefaultImage: process.env.USER_DEFAULT_IMAGE,
      googleMapsApiKey: process.env.API_GOOGLE_MAPS
    },
    splash: {
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#ffffff"
      },
      config: {
        googleMaps: {
          apiKey: process.env.API_GOOGLE // Usando a variável de ambiente
        }
      }
    },
    web: {
      bundler: "metro",
      output: "static"
    },
    plugins: [
      "expo-router"
    ],
    experiments: {
      typedRoutes: true
    }
  }
};
