const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔧 Mise à jour des dépendances...');

try {
  // Mettre à jour les dépendances principales
  console.log('📦 Installation des dépendances manquantes...');
  
  const dependencies = [
    'react-native-virtualized-view',
    'react-native-raw-bottom-sheet',
    'expo-auth-session',
    'expo-crypto',
    '@react-navigation/bottom-tabs',
    '@react-navigation/elements',
    '@react-navigation/native',
    'react-native-calendars',
    'react-native-maps',
    'react-native-modern-datepicker',
    'react-native-otp-entry',
    'react-native-pager-view',
    'react-native-picker-select',
    'react-native-reanimated',
    'react-native-safe-area-context',
    'react-native-screens',
    'react-native-svg',
    'react-native-tab-view',
    'react-native-webview',
    'validate.js'
  ];

  dependencies.forEach(dep => {
    try {
      console.log(`📦 Installation de ${dep}...`);
      execSync(`npm install ${dep}`, { stdio: 'inherit' });
    } catch (error) {
      console.log(`⚠️  ${dep} déjà installé ou erreur: ${error.message}`);
    }
  });

  // Nettoyer le cache
  console.log('🧹 Nettoyage du cache...');
  try {
    execSync('npx expo install --fix', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  Erreur lors du nettoyage du cache');
  }

  console.log('✅ Mise à jour des dépendances terminée !');
  console.log('🚀 Vous pouvez maintenant démarrer l\'application avec: npm start');

} catch (error) {
  console.error('❌ Erreur lors de la mise à jour:', error.message);
}

