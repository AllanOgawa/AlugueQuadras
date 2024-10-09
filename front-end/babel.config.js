module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      ['module:react-native-dotenv', {
        "moduleName": "@env",
        "path": "minio.env", // O caminho para o seu arquivo de variáveis
        "blocklist": null,
        "allowlist": null,
        "safe": false,
        "allowUndefined": true,
      }]
    ],
  };
};