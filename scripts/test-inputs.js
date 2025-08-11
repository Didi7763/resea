const fs = require('fs');
const path = require('path');

// Fonction pour corriger les problèmes de saisie dans les TextInput
function fixTextInputIssues(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Corriger les propriétés TextInput problématiques
    const problematicProps = [
      'autoComplete="off"',
      'textContentType="none"',
      'importantForAutofill="no"',
      'autoCorrect={false}',
      'spellCheck={false}'
    ];

    // Supprimer les propriétés problématiques
    problematicProps.forEach(prop => {
      if (content.includes(prop)) {
        content = content.replace(new RegExp(`\\s*${prop.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'g'), ' ');
        modified = true;
      }
    });

    // Ajouter les propriétés recommandées pour une meilleure saisie
    if (content.includes('<TextInput') && !content.includes('autoCapitalize')) {
      content = content.replace(
        /<TextInput([^>]*)>/g,
        '<TextInput$1 autoCapitalize="none">'
      );
      modified = true;
    }

    // Corriger les imports ScrollView problématiques
    if (content.includes('react-native-virtualized-view')) {
      content = content.replace(
        /import\s+\{\s*ScrollView\s*\}\s+from\s+['"]react-native-virtualized-view['"];?/g,
        'import { ScrollView } from \'react-native\';'
      );
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Corrigé les problèmes de saisie: ${filePath}`);
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
      fixTextInputIssues(filePath);
    }
  });
}

// Démarrer la correction
console.log('🔧 Début de la correction des problèmes de saisie...');
walkDir('./app');
walkDir('./components');
console.log('✅ Correction des problèmes de saisie terminée !');

