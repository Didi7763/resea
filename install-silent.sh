#!/bin/bash

echo "🚀 Installation silencieuse des packages..."

# Configuration pour éviter les warnings
npm config set engine-strict false
npm config set audit false

# Installation silencieuse
echo "📦 Installation des packages..."
npm install --silent --legacy-peer-deps

# Mise à jour Expo
echo "🔧 Mise à jour Expo..."
npx expo install --fix -- --legacy-peer-deps --silent

echo "✅ Installation terminée sans warnings !"
echo "📱 Démarrez avec: npx expo start --clear"



