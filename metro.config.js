// metro.config.js
/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 */

const { getDefaultConfig } = require("@react-native/metro-config");

const config = getDefaultConfig(__dirname);

// If you need TypeScript or cjs support, uncomment and adjust:
// config.resolver.sourceExts = [...config.resolver.sourceExts, "ts", "tsx", "cjs"];

module.exports = config;
