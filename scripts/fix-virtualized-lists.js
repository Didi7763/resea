const fs = require('fs');
const path = require('path');

// Fonction pour corriger les VirtualizedLists nested in ScrollViews
function fixVirtualizedListsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Remplacer ScrollView par View quand il y a des FlatList à l'intérieur
    if (content.includes('ScrollView') && content.includes('FlatList')) {
      // Vérifier si la FlatList est dans le ScrollView principal (pas dans un Modal)
      const lines = content.split('\n');
      let inScrollView = false;
      let scrollViewStart = -1;
      let scrollViewEnd = -1;
      let hasFlatListInScrollView = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.includes('<ScrollView') && !line.includes('Modal')) {
          inScrollView = true;
          scrollViewStart = i;
        }
        
        if (inScrollView && line.includes('</ScrollView>')) {
          scrollViewEnd = i;
          inScrollView = false;
          
          // Vérifier s'il y a une FlatList entre scrollViewStart et scrollViewEnd
          for (let j = scrollViewStart; j <= scrollViewEnd; j++) {
            if (lines[j].includes('<FlatList')) {
              hasFlatListInScrollView = true;
              break;
            }
          }
          
          if (hasFlatListInScrollView) {
            // Remplacer ScrollView par View
            lines[scrollViewStart] = lines[scrollViewStart].replace('<ScrollView', '<View');
            lines[scrollViewEnd] = lines[scrollViewEnd].replace('</ScrollView>', '</View>');
            modified = true;
            console.log(`✅ Corrigé VirtualizedList dans ScrollView: ${filePath}`);
          }
          
          // Reset pour le prochain ScrollView
          hasFlatListInScrollView = false;
        }
      }
      
      if (modified) {
        content = lines.join('\n');
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
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
      fixVirtualizedListsInFile(filePath);
    }
  });
}

// Démarrer la correction
console.log('🔧 Début de la correction des VirtualizedLists...');
walkDir('./app');
walkDir('./components');
console.log('✅ Correction des VirtualizedLists terminée !');

