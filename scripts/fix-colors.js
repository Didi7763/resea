const fs = require('fs');
const path = require('path');

// Fonction pour corriger les références aux couleurs grayscale
function fixColorReferences(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Mappings des couleurs problématiques vers les bonnes couleurs
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

    // Appliquer les corrections
    Object.entries(colorMappings).forEach(([oldColor, newColor]) => {
      if (content.includes(oldColor)) {
        content = content.replace(new RegExp(oldColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newColor);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Corrigé les couleurs: ${filePath}`);
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
      fixColorReferences(filePath);
    }
  });
}

// Démarrer la correction
console.log('🔧 Début de la correction des couleurs grayscale...');
walkDir('./app');
walkDir('./components');
console.log('✅ Correction des couleurs terminée !');

