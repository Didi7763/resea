const fs = require('fs');
const path = require('path');

// Fonction pour remplacer les imports problématiques
function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Remplacer react-native-virtualized-view par react-native
    if (content.includes('react-native-virtualized-view')) {
      content = content.replace(
        /import\s+\{\s*ScrollView\s*\}\s+from\s+['"]react-native-virtualized-view['"];?/g,
        'import { ScrollView } from \'react-native\';'
      );
      modified = true;
    }

    // Corriger les imports de RBSheet
    if (content.includes('react-native-raw-bottom-sheet')) {
      content = content.replace(
        /import\s+RBSheet\s+from\s+["']react-native-raw-bottom-sheet["'];?/g,
        'import RBSheet from "react-native-raw-bottom-sheet";'
      );
      modified = true;
    }

    // Corriger les propriétés TextInput problématiques
    if (content.includes('autoComplete="off"')) {
      content = content.replace(/autoComplete="off"/g, '');
      modified = true;
    }

    if (content.includes('textContentType="none"')) {
      content = content.replace(/textContentType="none"/g, '');
      modified = true;
    }

    if (content.includes('importantForAutofill="no"')) {
      content = content.replace(/importantForAutofill="no"/g, '');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Corrigé: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Erreur lors de la correction de ${filePath}:`, error.message);
  }
}

// Fonction pour parcourir récursivement les dossiers
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      walkDir(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fixImportsInFile(filePath);
    }
  });
}

// Démarrer la correction
console.log('🔧 Début de la correction des dépendances...');
walkDir('./app');
walkDir('./components');
console.log('✅ Correction terminée !');

