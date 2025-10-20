# 🗺️ Tutoriel : Intégration Google Distance Matrix API

## 📋 Table des matières
1. [Prérequis](#prérequis)
2. [Création du projet Google Cloud](#création-du-projet-google-cloud)
3. [Activation des APIs](#activation-des-apis)
4. [Génération de la clé API](#génération-de-la-clé-api)
5. [Configuration de la sécurité](#configuration-de-la-sécurité)
6. [Intégration dans l'application](#intégration-dans-lapplication)
7. [Utilisation dans le code](#utilisation-dans-le-code)
8. [Test et débogage](#test-et-débogage)

---

## 🎯 Prérequis

- Compte Google Cloud Platform (gratuit)
- Projet Expo/React Native configuré
- Compréhension de base des APIs REST

---

## 🏗️ 1. Création du projet Google Cloud

### Étape 1 : Accéder à Google Cloud Console
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Connectez-vous avec votre compte Google
3. Cliquez sur "Sélectionner un projet" en haut à gauche

### Étape 2 : Créer un nouveau projet
1. Cliquez sur "Nouveau projet"
2. Nommez votre projet : `reasa-distance-api`
3. Cliquez sur "Créer"

### Étape 3 : Sélectionner le projet
1. Une fois créé, sélectionnez votre projet dans la liste
2. Notez l'ID du projet (ex: `reasa-distance-api-123456`)

---

## 🔧 2. Activation des APIs

### Étape 1 : Aller à la bibliothèque d'APIs
1. Dans le menu latéral, cliquez sur "APIs et services" > "Bibliothèque"
2. Recherchez et activez les APIs suivantes :

### APIs à activer :
- **Distance Matrix API** (pour calculer les distances et temps)
- **Directions API** (pour les itinéraires détaillés)
- **Geocoding API** (pour convertir adresses en coordonnées)

### Étape 2 : Activer chaque API
1. Recherchez "Distance Matrix API"
2. Cliquez sur l'API
3. Cliquez sur "Activer"
4. Répétez pour chaque API

---

## 🔑 3. Génération de la clé API

### Étape 1 : Créer une clé API
1. Dans le menu latéral, cliquez sur "APIs et services" > "Identifiants"
2. Cliquez sur "Créer des identifiants" > "Clé API"
3. Une clé API sera générée automatiquement

### Étape 2 : Copier la clé
1. Copiez la clé générée (format : `AIzaSyC...`)
2. **⚠️ IMPORTANT** : Gardez cette clé secrète !

---

## 🛡️ 4. Configuration de la sécurité

### Étape 1 : Restreindre la clé API
1. Cliquez sur la clé API créée
2. Dans "Restrictions d'application", sélectionnez "Applications iOS" et "Applications Android"
3. Ajoutez vos identifiants de bundle :
   - iOS : `com.yourcompany.reasa`
   - Android : `com.yourcompany.reasa`

### Étape 2 : Restreindre les APIs
1. Dans "Restrictions d'API", sélectionnez "Restreindre la clé"
2. Sélectionnez uniquement les APIs nécessaires :
   - Distance Matrix API
   - Directions API
   - Geocoding API

---

## 📱 5. Intégration dans l'application

### Étape 1 : Installer les dépendances
```bash
npm install axios
```

### Étape 2 : Créer le fichier de configuration
Créez `constants/api.ts` :

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

### Étape 3 : Créer le service Distance API
Créez `services/DistanceService.ts` :

```typescript
import axios from 'axios';
import { GOOGLE_API_CONFIG } from '../constants/api';

export interface DistanceMatrixRequest {
  origins: string;
  destinations: string;
  mode?: 'driving' | 'walking' | 'bicycling' | 'transit';
  units?: 'metric' | 'imperial';
  language?: string;
}

export interface DistanceMatrixResponse {
  destination_addresses: string[];
  origin_addresses: string[];
  rows: Array<{
    elements: Array<{
      distance?: {
        text: string;
        value: number;
      };
      duration?: {
        text: string;
        value: number;
      };
      status: string;
    }>;
  }>;
  status: string;
}

class DistanceService {
  private static instance: DistanceService;
  private apiKey: string;

  private constructor() {
    this.apiKey = GOOGLE_API_CONFIG.API_KEY;
  }

  public static getInstance(): DistanceService {
    if (!DistanceService.instance) {
      DistanceService.instance = new DistanceService();
    }
    return DistanceService.instance;
  }

  /**
   * Calcule la distance et le temps entre plusieurs origines et destinations
   */
  async getDistanceMatrix(request: DistanceMatrixRequest): Promise<DistanceMatrixResponse> {
    try {
      const params = new URLSearchParams({
        origins: request.origins,
        destinations: request.destinations,
        key: this.apiKey,
        mode: request.mode || 'driving',
        units: request.units || 'metric',
        language: request.language || 'fr',
      });

      const response = await axios.get(
        `${GOOGLE_API_CONFIG.BASE_URL}${GOOGLE_API_CONFIG.ENDPOINTS.DISTANCE_MATRIX}?${params}`
      );

      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors du calcul de distance:', error);
      throw error;
    }
  }

  /**
   * Calcule la distance entre deux coordonnées
   */
  async getDistanceBetweenCoordinates(
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number },
    mode: 'driving' | 'walking' | 'bicycling' = 'driving'
  ) {
    const originStr = `${origin.latitude},${origin.longitude}`;
    const destinationStr = `${destination.latitude},${destination.longitude}`;

    const response = await this.getDistanceMatrix({
      origins: originStr,
      destinations: destinationStr,
      mode,
    });

    if (response.status === 'OK' && response.rows[0]?.elements[0]?.status === 'OK') {
      return {
        distance: response.rows[0].elements[0].distance,
        duration: response.rows[0].elements[0].duration,
      };
    }

    throw new Error('Impossible de calculer la distance');
  }

  /**
   * Calcule les distances vers plusieurs destinations depuis une origine
   */
  async getDistancesToMultipleDestinations(
    origin: { latitude: number; longitude: number },
    destinations: Array<{ latitude: number; longitude: number }>,
    mode: 'driving' | 'walking' | 'bicycling' = 'driving'
  ) {
    const originStr = `${origin.latitude},${origin.longitude}`;
    const destinationsStr = destinations
      .map(dest => `${dest.latitude},${dest.longitude}`)
      .join('|');

    const response = await this.getDistanceMatrix({
      origins: originStr,
      destinations: destinationsStr,
      mode,
    });

    if (response.status === 'OK') {
      return response.rows[0].elements.map((element, index) => ({
        destination: destinations[index],
        distance: element.distance,
        duration: element.duration,
        status: element.status,
      }));
    }

    throw new Error('Impossible de calculer les distances');
  }
}

export default DistanceService;
```

---

## 💻 6. Utilisation dans le code

### Étape 1 : Mettre à jour le RouteService existant
Modifiez `services/RouteService.ts` :

```typescript
import DistanceService from './DistanceService';
import { Residence } from '../types/map';

class RouteService {
  private static instance: RouteService;
  private distanceService: DistanceService;

  private constructor() {
    this.distanceService = DistanceService.getInstance();
  }

  public static getInstance(): RouteService {
    if (!RouteService.instance) {
      RouteService.instance = new RouteService();
    }
    return RouteService.instance;
  }

  /**
   * Calcule les distances vers toutes les résidences depuis la position utilisateur
   */
  async calculateDistancesToResidences(
    userLocation: { latitude: number; longitude: number },
    residences: Residence[]
  ) {
    try {
      console.log('🗺️ Calcul des distances vers', residences.length, 'résidences...');
      
      const distances = await this.distanceService.getDistancesToMultipleDestinations(
        userLocation,
        residences.map(residence => residence.location)
      );

      // Associer les distances aux résidences
      const residencesWithDistances = residences.map((residence, index) => ({
        ...residence,
        distance: distances[index].distance,
        duration: distances[index].duration,
        distanceStatus: distances[index].status,
      }));

      console.log('✅ Distances calculées avec succès');
      return residencesWithDistances;
    } catch (error) {
      console.error('❌ Erreur lors du calcul des distances:', error);
      throw error;
    }
  }

  /**
   * Trie les résidences par distance
   */
  sortResidencesByDistance(residences: Residence[]) {
    return residences.sort((a, b) => {
      if (!a.distance || !b.distance) return 0;
      return a.distance.value - b.distance.value;
    });
  }

  /**
   * Filtre les résidences dans un rayon donné
   */
  filterResidencesByRadius(
    residences: Residence[],
    maxDistanceKm: number
  ) {
    return residences.filter(residence => {
      if (!residence.distance) return false;
      return residence.distance.value <= maxDistanceKm * 1000; // Conversion en mètres
    });
  }
}

export default RouteService;
```

### Étape 2 : Utilisation dans l'écran Explore
Modifiez `app/(tabs)/explore.tsx` :

```typescript
// ... imports existants ...
import RouteService from '../../services/RouteService';

// Dans votre composant Explore
const ExploreScreen = () => {
  // ... code existant ...
  const routeService = RouteService.getInstance();

  // Fonction pour calculer les distances
  const calculateDistances = async (residences: Residence[]) => {
    if (!userLocation) return residences;

    try {
      const residencesWithDistances = await routeService.calculateDistancesToResidences(
        userLocation,
        residences
      );

      // Trier par distance
      const sortedResidences = routeService.sortResidencesByDistance(residencesWithDistances);
      
      // Filtrer dans un rayon de 10km
      const nearbyResidences = routeService.filterResidencesByRadius(sortedResidences, 10);

      setResidences(nearbyResidences);
    } catch (error) {
      console.error('Erreur lors du calcul des distances:', error);
      // En cas d'erreur, afficher les résidences sans distances
      setResidences(residences);
    }
  };

  // Appeler cette fonction quand les résidences sont chargées
  useEffect(() => {
    if (residences.length > 0 && userLocation) {
      calculateDistances(residences);
    }
  }, [residences, userLocation]);

  // ... reste du code ...
};
```

---

## 🧪 7. Test et débogage

### Étape 1 : Test de base
```typescript
// Test simple dans votre composant
const testDistanceAPI = async () => {
  try {
    const distanceService = DistanceService.getInstance();
    
    const result = await distanceService.getDistanceBetweenCoordinates(
      { latitude: 5.3600, longitude: -3.9877 }, // Cocody Centre
      { latitude: 5.3750, longitude: -3.9750 }  // Riviera Palmeraie
    );
    
    console.log('Distance test:', result);
  } catch (error) {
    console.error('Erreur test:', error);
  }
};
```

### Étape 2 : Vérification des quotas
1. Allez dans Google Cloud Console
2. APIs et services > Tableau de bord
3. Vérifiez l'utilisation de vos APIs

---

## ⚠️ Points importants

1. **Sécurité** : Ne partagez jamais votre clé API
2. **Quotas** : Surveillez votre utilisation
3. **Coûts** : Les APIs Google Maps sont payantes après un certain seuil
4. **Performance** : Mettez en cache les résultats fréquents
5. **Erreurs** : Gérez toujours les cas d'erreur

---

## 📚 Ressources utiles

- [Documentation Google Distance Matrix API](https://developers.google.com/maps/documentation/distance-matrix)
- [Guide de facturation Google Cloud](https://cloud.google.com/maps-platform/pricing)
- [Exemples de requêtes](https://developers.google.com/maps/documentation/distance-matrix/requests-distance-matrix)

---

🎉 **Félicitations !** Votre application REASA dispose maintenant d'un système complet de calcul d'itinéraires avec Google Distance Matrix API !
