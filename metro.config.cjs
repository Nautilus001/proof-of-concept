const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix: Match the variable name case (config vs config)
config.resolver.sourceExts.push("cjs");

module.exports = config;