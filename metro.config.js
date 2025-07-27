const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.extraNodeModules = {
  ...defaultConfig.resolver.extraNodeModules,
  "react-native-maps": require.resolve("./empty-module.js"), // crée ce fichier
};

defaultConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === "web" && moduleName === "react-native-maps") {
    return {
      type: "sourceFile",
      filePath: require.resolve("./empty-module.js"),
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = defaultConfig;
