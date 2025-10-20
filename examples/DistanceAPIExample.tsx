import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { colors } from '../constants/theme';
import DistanceService from '../services/DistanceService';
import RouteService from '../services/RouteService';
import { Residence } from '../types/map';

/**
 * Exemple d'utilisation de l'API Google Distance Matrix
 * Ce composant montre comment utiliser les services de distance
 */
const DistanceAPIExample: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  // Exemple de résidences de test
  const testResidences: Residence[] = [
    {
      id: '1',
      name: 'Résidence Cocody Centre',
      description: 'Appartement moderne au cœur de Cocody',
      price: 150000,
      location: { latitude: 5.3600, longitude: -3.9877 },
      images: [],
      amenities: [],
      rooms: 3,
      bathrooms: 2,
      owner: 'John Doe',
      rating: 4.5,
    },
    {
      id: '2',
      name: 'Villa Riviera Palmeraie',
      description: 'Villa luxueuse dans un quartier calme',
      price: 250000,
      location: { latitude: 5.3750, longitude: -3.9750 },
      images: [],
      amenities: [],
      rooms: 4,
      bathrooms: 3,
      owner: 'Jane Smith',
      rating: 4.8,
    },
    {
      id: '3',
      name: 'Studio Plateau Dokui',
      description: 'Studio moderne et fonctionnel',
      price: 80000,
      location: { latitude: 5.3500, longitude: -4.0000 },
      images: [],
      amenities: [],
      rooms: 1,
      bathrooms: 1,
      owner: 'Mike Johnson',
      rating: 4.2,
    },
  ];

  // Position utilisateur simulée (Cocody Centre)
  const userLocation = { latitude: 5.3600, longitude: -3.9877 };

  /**
   * Test 1: Calcul de distance entre deux points
   */
  const testSingleDistance = async () => {
    setLoading(true);
    try {
      const distanceService = DistanceService.getInstance();
      
      const result = await distanceService.getDistanceBetweenCoordinates(
        userLocation,
        testResidences[1].location, // Riviera Palmeraie
        'driving'
      );
      
      setResults({
        type: 'Single Distance',
        data: result,
      });
      
      Alert.alert(
        'Distance calculée',
        `Distance: ${result.distance?.text}\nDurée: ${result.duration?.text}`
      );
    } catch (error) {
      console.error('Erreur test distance simple:', error);
      Alert.alert('Erreur', 'Impossible de calculer la distance');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Test 2: Calcul de distances vers plusieurs résidences
   */
  const testMultipleDistances = async () => {
    setLoading(true);
    try {
      const routeService = RouteService.getInstance();
      
      const residencesWithDistances = await routeService.calculateDistancesToResidences(
        userLocation,
        testResidences
      );

      // Trier par distance
      const sortedResidences = routeService.sortResidencesByDistance(residencesWithDistances);
      
      // Filtrer dans un rayon de 10km
      const nearbyResidences = routeService.filterResidencesByRadius(sortedResidences, 10);

      setResults({
        type: 'Multiple Distances',
        data: {
          all: residencesWithDistances,
          sorted: sortedResidences,
          nearby: nearbyResidences,
        },
      });

      Alert.alert(
        'Distances calculées',
        `Résidences trouvées: ${residencesWithDistances.length}\n` +
        `Dans un rayon de 10km: ${nearbyResidences.length}`
      );
    } catch (error) {
      console.error('Erreur test distances multiples:', error);
      Alert.alert('Erreur', 'Impossible de calculer les distances');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Test 3: Calcul d'itinéraire complet
   */
  const testRouteCalculation = async () => {
    setLoading(true);
    try {
      const routeService = RouteService.getInstance();
      
      const route = await routeService.calculateRoute(
        userLocation,
        testResidences[1].location // Riviera Palmeraie
      );

      if (route) {
        setResults({
          type: 'Route Calculation',
          data: route,
        });

        Alert.alert(
          'Itinéraire calculé',
          `Distance: ${route.distance}\nDurée: ${route.duration}\nÉtapes: ${route.steps.length}`
        );
      } else {
        Alert.alert('Erreur', 'Aucun itinéraire trouvé');
      }
    } catch (error) {
      console.error('Erreur test itinéraire:', error);
      Alert.alert('Erreur', 'Impossible de calculer l\'itinéraire');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Test 4: Nettoyer le cache
   */
  const clearCache = () => {
    const distanceService = DistanceService.getInstance();
    distanceService.clearCache();
    Alert.alert('Cache vidé', 'Le cache des distances a été vidé');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Tests API Distance Matrix</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={testSingleDistance}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test Distance Simple</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={testMultipleDistances}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test Distances Multiples</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={testRouteCalculation}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test Itinéraire</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonSecondary]} 
          onPress={clearCache}
        >
          <Text style={styles.buttonText}>Vider Cache</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>🔄 Calcul en cours...</Text>
        </View>
      )}

      {results && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>📊 Résultats: {results.type}</Text>
          <Text style={styles.resultsText}>
            {JSON.stringify(results.data, null, 2)}
          </Text>
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>ℹ️ Informations</Text>
        <Text style={styles.infoText}>
          • Position utilisateur: {userLocation.latitude}, {userLocation.longitude}
        </Text>
        <Text style={styles.infoText}>
          • Résidences de test: {testResidences.length}
        </Text>
        <Text style={styles.infoText}>
          • Assurez-vous d'avoir configuré votre clé API dans constants/api.ts
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: colors.dark1,
  },
  buttonContainer: {
    gap: 15,
    marginBottom: 30,
  },
  button: {
    backgroundColor: colors.blue,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: colors.gray,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: colors.blue,
    fontWeight: '600',
  },
  resultsContainer: {
    backgroundColor: colors.grayscale100,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.dark1,
  },
  resultsText: {
    fontSize: 12,
    color: colors.dark2,
    fontFamily: 'monospace',
  },
  infoContainer: {
    backgroundColor: colors.transparentPrimary,
    padding: 15,
    borderRadius: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.dark1,
  },
  infoText: {
    fontSize: 14,
    color: colors.dark2,
    marginBottom: 5,
  },
});

export default DistanceAPIExample;







