const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Fix for import.meta in Zustand v5 and other modern ESM libraries
// Tells Metro to prefer CommonJS / browser builds instead of modern ESM
if (!config.resolver.unstable_conditionNames) {
  config.resolver.unstable_conditionNames = ['require', 'react-native', 'browser'];
} else {
  config.resolver.unstable_conditionNames.push('require', 'browser');
}

module.exports = config;
