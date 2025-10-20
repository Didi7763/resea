# 🗺️ Carte des Résidences - Documentation

## 📋 Vue d'ensemble

Cette implémentation fournit une carte interactive avec géolocalisation, marqueurs de résidences et calcul d'itinéraires pour l'application REASA.

## 🏗️ Architecture

### Fichiers créés :

1. **`types/map.ts`** - Types et interfaces pour la carte et géolocalisation
2. **`services/ResidenceService.ts`** - Service pour gérer les résidences (données de test Cocody)
3. **`services/RouteService.ts`** - Service pour calculer les itinéraires avec Google Directions API
4. **`hooks/useLocation.ts`** - Hook personnalisé pour la géolocalisation et permissions
5. **`app/map.tsx`** - Page principale de la carte
6. **`app/(tabs)/index.tsx`** - Ajout du bouton d'accès à la carte

## 🔧 Configuration requise

### 1. Permissions

Ajoutez dans `app.json` :

```json
{
  "expo": {
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Permettez à REASA d'accéder à votre position pour afficher les résidences à proximité et calculer les itinéraires.",
          "locationAlwaysPermission": "Permettez à REASA d'accéder à votre position en arrière-plan pour les notifications de nouvelles résidences.",
          "locationWhenInUsePermission": "Permettez à REASA d'accéder à votre position pour afficher les résidences à proximité."
        }
      ]
    ]
  }
}
```

### 2. Clé API Google Maps

Dans `services/RouteService.ts`, remplacez :
```typescript
const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY';
```

**Pour obtenir une clé API :**
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un projet ou sélectionnez un projet existant
3. Activez l'API **Directions API** et **Maps SDK for Android/iOS**
4. Créez des identifiants API

## 🚀 Fonctionnalités

### ✅ Implémenté

1. **📍 Géolocalisation utilisateur**
   - Position actuelle en temps réel
   - Gestion des permissions (demande automatique)
   - Mises à jour de position en continu

2. **🏠 Marqueurs de résidences**
   - 4 résidences de test dans Cocody, Abidjan
   - Marqueurs personnalisés avec icônes
   - Sélection interactive

3. **🗺️ Calcul d'itinéraires**
   - Intégration Google Directions API
   - Affichage de polylines rouges
   - Distance et durée du trajet

4. **🎨 Interface utilisateur**
   - Carte Google Maps interactive
   - Panneau de permissions
   - Détails des résidences
   - Boutons d'action (Voir détails, Naviguer)

5. **⚡ Gestion d'état**
   - États de chargement
   - Gestion des erreurs
   - Permissions dynamiques

## 📍 Données de test (Cocody, Abidjan)

### Résidences incluses :

1. **Résidence Cocody Centre**
   - Position : 5.3600, -3.9877
   - Prix : 250,000 FCFA
   - 3 chambres, 120m²

2. **Villa Cocody Riviera**
   - Position : 5.3650, -3.9920
   - Prix : 450,000 FCFA
   - 4 chambres, 180m²

3. **Appartement Cocody 2 Plateaux**
   - Position : 5.3580, -3.9850
   - Prix : 180,000 FCFA
   - 2 chambres, 85m²

4. **Résidence Cocody Angré**
   - Position : 5.3720, -3.9950
   - Prix : 320,000 FCFA
   - 3 chambres, 140m²

## 🔄 Flux utilisateur

1. **Ouverture de la carte** → Demande de permission de localisation
2. **Permission accordée** → Affichage de la position utilisateur
3. **Sélection d'une résidence** → Calcul automatique de l'itinéraire
4. **Affichage des détails** → Distance, durée, prix, adresse
5. **Actions disponibles** → Voir détails, Naviguer

## 🛠️ Services

### ResidenceService
```typescript
// Récupérer toutes les résidences
const residences = await residenceService.getAllResidences();

// Rechercher par critères
const filtered = await residenceService.searchResidences({
  minPrice: 200000,
  maxPrice: 400000,
  minRooms: 3
});
```

### RouteService
```typescript
// Calculer un itinéraire
const route = await routeService.calculateRoute(origin, destination);

// Décoder une polyline
const coordinates = routeService.decodePolyline(route.polyline);
```

### useLocation Hook
```typescript
const {
  location,
  permissionStatus,
  isLoading,
  requestPermission,
  getCurrentLocation
} = useLocation();
```

## 🎯 Intégration Backend

### Structure prête pour l'API :

```typescript
// Dans ResidenceService.ts, remplacez getAllResidences() :
public async getAllResidences(): Promise<Residence[]> {
  const response = await fetch('YOUR_API_URL/residences');
  return response.json();
}

// Dans RouteService.ts, utilisez votre clé API :
const GOOGLE_API_KEY = 'YOUR_ACTUAL_API_KEY';
```

## 🧪 Test

1. **Lancez l'application** : `npx expo start`
2. **Allez sur la page d'accueil**
3. **Cliquez sur "🗺️ Carte"**
4. **Autorisez la localisation**
5. **Testez la sélection de résidences**
6. **Vérifiez les itinéraires calculés**

## 🔒 Sécurité

- ✅ Gestion sécurisée des permissions
- ✅ Validation des données de localisation
- ✅ Gestion des erreurs API
- ✅ Protection contre les accès non autorisés

## 🐛 Dépannage

### Erreurs courantes :

1. **"Permission de localisation refusée"**
   - Vérifiez les paramètres de l'appareil
   - Redémarrez l'application

2. **"Impossible de calculer l'itinéraire"**
   - Vérifiez votre clé API Google
   - Vérifiez la connexion internet

3. **Carte ne s'affiche pas**
   - Vérifiez que `react-native-maps` est installé
   - Vérifiez la configuration Google Maps

## 📚 Ressources

- [Documentation expo-location](https://docs.expo.dev/versions/latest/sdk/location/)
- [Documentation react-native-maps](https://github.com/react-native-maps/react-native-maps)
- [Google Directions API](https://developers.google.com/maps/documentation/directions)
- [Google Maps Platform](https://developers.google.com/maps)

## 🎯 Prochaines étapes

1. **Intégration backend** : Remplacer les données de test par une API
2. **Filtres avancés** : Prix, nombre de chambres, distance
3. **Favoris** : Sauvegarder les résidences préférées
4. **Notifications** : Alertes pour nouvelles résidences
5. **Mode hors ligne** : Cache des données de carte









