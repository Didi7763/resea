const fs = require('fs');
const path = require('path');

// Fonction pour corriger les erreurs de syntaxe
function fixSyntaxErrors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Corriger les erreurs de syntaxe TextInput
    if (content.includes('/ autoCapitalize="none">')) {
      content = content.replace(
        /\/ autoCapitalize="none">/g,
        'autoCapitalize="none"\n          />'
      );
      modified = true;
    }

    // Corriger les autres erreurs de syntaxe similaires
    if (content.includes('/> autoCapitalize')) {
      content = content.replace(
        /\/> autoCapitalize="none">/g,
        'autoCapitalize="none"\n          />'
      );
      modified = true;
    }

    // Corriger les propriétés mal placées
    if (content.includes('multiline={true}\n          / autoCapitalize')) {
      content = content.replace(
        /multiline=\{true\}\n          \/ autoCapitalize="none">/g,
        'multiline={true}\n            autoCapitalize="none"\n          />'
      );
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Corrigé les erreurs de syntaxe: ${filePath}`);
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
      fixSyntaxErrors(filePath);
    }
  });
}

// Démarrer la correction
console.log('🔧 Début de la correction des erreurs de syntaxe...');
walkDir('./app');
walkDir('./components');
console.log('✅ Correction des erreurs de syntaxe terminée !');

