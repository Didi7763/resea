const fs = require('fs');
const path = require('path');

// Fonction pour corriger toutes les erreurs de syntaxe
function fixAllErrors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Corriger les erreurs de ref avec autoCapitalize mal placé
    if (content.includes('ref={(ref) = autoCapitalize="none">')) {
      content = content.replace(
        /ref=\{\(ref\) = autoCapitalize="none"> \{/g,
        'ref={(ref) => {'
      );
      modified = true;
    }

    // 2. Corriger les erreurs de syntaxe TextInput avec /> mal placé
    if (content.includes('/ autoCapitalize="none">')) {
      content = content.replace(
        /\/ autoCapitalize="none">/g,
        'autoCapitalize="none"\n          />'
      );
      modified = true;
    }

    // 3. Corriger les propriétés mal placées dans TextInput
    if (content.includes('multiline={true}\n          / autoCapitalize')) {
      content = content.replace(
        /multiline=\{true\}\n          \/ autoCapitalize="none">/g,
        'multiline={true}\n            autoCapitalize="none"\n          />'
      );
      modified = true;
    }

    // 4. Corriger les erreurs de syntaxe similaires
    if (content.includes('/> autoCapitalize="none">')) {
      content = content.replace(
        /\/> autoCapitalize="none">/g,
        'autoCapitalize="none"\n          />'
      );
      modified = true;
    }

    // 5. Corriger les erreurs de ref mal formatées
    if (content.includes('ref={(ref) => {') && content.includes('if (ref) inputRefs.current[index] = ref;')) {
      // Vérifier que la syntaxe est correcte
      const refPattern = /ref=\{\(ref\) => \{\s*if \(ref\) inputRefs\.current\[index\] = ref;\s*\}\}/g;
      if (!refPattern.test(content)) {
        content = content.replace(
          /ref=\{\(ref\) => \{\s*if \(ref\) inputRefs\.current\[index\] = ref;\s*\}\}/g,
          'ref={(ref) => {\n                          if (ref) inputRefs.current[index] = ref;\n                        }}'
        );
        modified = true;
      }
    }

    // 6. Corriger les imports ScrollView problématiques
    if (content.includes('react-native-virtualized-view')) {
      content = content.replace(
        /import\s+\{\s*ScrollView\s*\}\s+from\s+['"]react-native-virtualized-view['"];?/g,
        'import { ScrollView } from \'react-native\';'
      );
      modified = true;
    }

    // 7. Corriger les couleurs grayscale incohérentes
    const colorMappings = {
      'COLORS.greyscale500': 'COLORS.grayscale500',
      'COLORS.greyscale600': 'COLORS.grayscale600',
      'COLORS.greyscale700': 'COLORS.grayscale700',
      'COLORS.greyscale400': 'COLORS.grayscale400',
      'COLORS.greyscale300': 'COLORS.grayscale300',
      'COLORS.greyscale200': 'COLORS.grayscale200',
      'COLORS.greyscale100': 'COLORS.grayscale100',
      'COLORS.greyScale800': 'COLORS.greyscale800',
      'COLORS.greyScale700': 'COLORS.grayscale700',
      'COLORS.greyScale600': 'COLORS.grayscale600',
      'COLORS.greyScale500': 'COLORS.grayscale500',
      'COLORS.greyScale400': 'COLORS.grayscale400',
      'COLORS.greyScale300': 'COLORS.grayscale300',
      'COLORS.greyScale200': 'COLORS.grayscale200',
      'COLORS.greyScale100': 'COLORS.grayscale100',
    };

    Object.entries(colorMappings).forEach(([oldColor, newColor]) => {
      if (content.includes(oldColor)) {
        content = content.replace(new RegExp(oldColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newColor);
        modified = true;
      }
    });

    // 8. Supprimer les propriétés TextInput problématiques
    const problematicProps = [
      'autoComplete="off"',
      'textContentType="none"',
      'importantForAutofill="no"',
      'autoCorrect={false}',
      'spellCheck={false}'
    ];

    problematicProps.forEach(prop => {
      if (content.includes(prop)) {
        content = content.replace(new RegExp(`\\s*${prop.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'g'), ' ');
        modified = true;
      }
    });

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
      fixAllErrors(filePath);
    }
  });
}

// Démarrer la correction complète
console.log('🔧 Début de la correction complète de toutes les erreurs...');
walkDir('./app');
walkDir('./components');
console.log('✅ Correction complète terminée !');
console.log('🚀 Vous pouvez maintenant démarrer l\'application avec: npm start');

