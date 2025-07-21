const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Assurer la compatibilité Hermes
config.transformer.hermesParser = true;

module.exports = config;