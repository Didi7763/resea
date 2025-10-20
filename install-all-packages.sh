#!/bin/bash

echo "🚀 Installation de tous les packages React Native/Expo courants..."

# Packages Expo essentiels
echo "📦 Installation des packages Expo..."
npx expo install expo-linking expo-status-bar expo-font expo-splash-screen expo-system-ui expo-checkbox expo-location expo-image-picker expo-document-picker expo-linear-gradient expo-constants expo-web-browser -- --legacy-peer-deps

# Packages React Native essentiels
echo "📦 Installation des packages React Native..."
npm install react-native-reanimated react-native-worklets react-native-tab-view react-native-safe-area-context react-native-otp-entry react-native-raw-bottom-sheet react-native-modal react-native-vector-icons react-native-svg react-native-modern-datepicker react-native-picker-select react-native-maps --legacy-peer-deps

# Packages de navigation
echo "📦 Installation des packages de navigation..."
npm install @react-navigation/native @react-navigation/stack react-native-screens react-native-gesture-handler --legacy-peer-deps

# Mise à jour automatique des versions compatibles
echo "🔧 Mise à jour des versions compatibles..."
npx expo install --fix -- --legacy-peer-deps

echo "✅ Installation terminée !"
echo "📱 Vous pouvez maintenant démarrer l'application avec: npx expo start --clear"



