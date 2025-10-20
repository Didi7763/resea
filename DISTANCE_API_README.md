# 🗺️ Intégration Google Distance Matrix API - REASA

## 📋 Vue d'ensemble

Ce guide vous accompagne dans l'intégration de l'API Google Distance Matrix dans votre application REASA pour calculer les distances et temps de trajet entre les utilisateurs et les résidences.

## 🚀 Démarrage rapide

### 1. Configuration de la clé API

1. **Créez votre projet Google Cloud** :
   - Allez sur [Google Cloud Console](https://console.cloud.google.com/)
   - Créez un nouveau projet ou sélectionnez un existant
   - Activez les APIs : **Distance Matrix API**, **Directions API**, **Geocoding API**

2. **Générez votre clé API** :
   - APIs et services > Identifiants > Créer des identifiants > Clé API
   - Copiez la clé générée

3. **Configurez la sécurité** :
   - Restreignez la clé aux applications iOS/Android
   - Limitez aux APIs nécessaires uniquement

### 2. Intégration dans le code

1. **Mettez à jour `constants/api.ts`** :
```typescript
export const GOOGLE_API_CONFIG = {
  BASE_URL: 'https://maps.googleapis.com/maps/api',
  API_KEY: 'VOTRE_CLE_API_ICI', // Remplacez par votre vraie clé
  ENDPOINTS: {
    DISTANCE_MATRIX: '/distancematrix/json',
    DIRECTIONS: '/directions/json',
    GEOCODING: '/geocode/json',
  }
};
```

2. **Utilisez le service dans votre code** :
```typescript
import DistanceService from '../services/DistanceService';
import RouteService from '../services/RouteService';

// Calcul de distance simple
const distanceService = DistanceService.getInstance();
const result = await distanceService.getDistanceBetweenCoordinates(
  { latitude: 5.3600, longitude: -3.9877 }, // Origine
  { latitude: 5.3750, longitude: -3.9750 }, // Destination
  'driving'
);

// Calcul de distances vers plusieurs résidences
const routeService = RouteService.getInstance();
const residencesWithDistances = await routeService.calculateDistancesToResidences(
  userLocation,
  residences
);
```

## 📁 Structure des fichiers

```
services/
├── DistanceService.ts          # Service principal pour les calculs de distance
├── RouteService.ts            # Service étendu pour les itinéraires

constants/
├── api.ts                     # Configuration de l'API

examples/
├── DistanceAPIExample.tsx     # Exemple d'utilisation complet

types/
├── map.ts                     # Types pour les données de carte
```

## 🔧 Fonctionnalités disponibles

### DistanceService
- ✅ Calcul de distance entre deux coordonnées
- ✅ Calcul de distances vers plusieurs destinations
- ✅ Cache automatique des résultats (5 minutes)
- ✅ Gestion des erreurs et timeouts
- ✅ Support des modes de transport (voiture, marche, vélo)

### RouteService (étendu)
- ✅ Calcul d'itinéraires complets avec étapes
- ✅ Tri des résidences par distance
- ✅ Filtrage par rayon de distance
- ✅ Décodage de polylines Google
- ✅ Calcul de distance à vol d'oiseau

## 💡 Exemples d'utilisation

### 1. Calcul de distance simple
```typescript
const distance = await distanceService.getDistanceBetweenCoordinates(
  userLocation,
  residence.location,
  'driving'
);

console.log(`Distance: ${distance.distance?.text}`);
console.log(`Durée: ${distance.duration?.text}`);
```

### 2. Calcul de distances vers toutes les résidences
```typescript
const residencesWithDistances = await routeService.calculateDistancesToResidences(
  userLocation,
  residences
);

// Trier par distance
const sortedResidences = routeService.sortResidencesByDistance(residencesWithDistances);

// Filtrer dans un rayon de 5km
const nearbyResidences = routeService.filterResidencesByRadius(sortedResidences, 5);
```

### 3. Calcul d'itinéraire complet
```typescript
const route = await routeService.calculateRoute(
  userLocation,
  residence.location
);

if (route) {
  console.log(`Distance: ${route.distance}`);
  console.log(`Durée: ${route.duration}`);
  console.log(`Étapes: ${route.steps.length}`);
}
```

## 🧪 Tests

Utilisez le composant `DistanceAPIExample.tsx` pour tester toutes les fonctionnalités :

```typescript
import DistanceAPIExample from './examples/DistanceAPIExample';

// Dans votre navigation
<DistanceAPIExample />
```

Ce composant inclut :
- ✅ Test de distance simple
- ✅ Test de distances multiples
- ✅ Test de calcul d'itinéraire
- ✅ Gestion du cache
- ✅ Affichage des résultats

## ⚠️ Points importants

### Sécurité
- 🔒 Ne partagez jamais votre clé API
- 🔒 Restreignez la clé aux applications nécessaires
- 🔒 Surveillez l'utilisation et les quotas

### Performance
- ⚡ Le cache automatique réduit les appels API
- ⚡ Les requêtes multiples sont optimisées
- ⚡ Timeout de 10 secondes par défaut

### Coûts
- 💰 Les APIs Google Maps sont payantes après un certain seuil
- 💰 Surveillez votre utilisation dans Google Cloud Console
- 💰 Configurez des alertes pour les quotas

## 🐛 Dépannage

### Erreurs courantes

1. **"REQUEST_DENIED"** :
   - Vérifiez que votre clé API est correcte
   - Assurez-vous que les APIs sont activées
   - Vérifiez les restrictions de la clé

2. **"OVER_QUERY_LIMIT"** :
   - Vous avez dépassé votre quota
   - Attendez ou augmentez votre quota
   - Vérifiez l'utilisation dans Google Cloud Console

3. **"NOT_FOUND"** :
   - Les coordonnées sont invalides
   - Vérifiez le format des coordonnées
   - Assurez-vous que les points existent

4. **"ZERO_RESULTS"** :
   - Aucun itinéraire trouvé entre les points
   - Vérifiez que les points sont accessibles
   - Essayez un mode de transport différent

### Logs de débogage
```typescript
// Activez les logs détaillés
console.log('🗺️ Calcul de distance...');
console.log('✅ Distance calculée:', result);
console.error('❌ Erreur:', error);
```

## 📚 Ressources

- [Documentation Google Distance Matrix API](https://developers.google.com/maps/documentation/distance-matrix)
- [Guide de facturation Google Cloud](https://cloud.google.com/maps-platform/pricing)
- [Exemples de requêtes](https://developers.google.com/maps/documentation/distance-matrix/requests-distance-matrix)
- [Tutoriel complet](GOOGLE_DISTANCE_API_TUTORIAL.md)

## 🎯 Prochaines étapes

1. **Testez l'intégration** avec `DistanceAPIExample.tsx`
2. **Intégrez dans votre écran Explore** pour afficher les distances
3. **Ajoutez des filtres** par distance dans la recherche
4. **Optimisez les performances** avec la mise en cache
5. **Surveillez l'utilisation** dans Google Cloud Console

---

🎉 **Félicitations !** Votre application REASA dispose maintenant d'un système complet de calcul d'itinéraires avec Google Distance Matrix API !
